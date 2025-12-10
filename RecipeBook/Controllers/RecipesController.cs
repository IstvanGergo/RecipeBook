using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using RecipeBook.Data;
using RecipeBook.Models;
using RecipeBook.ViewModels;
using static RecipeBook.Controllers.ChatCompletions;

namespace RecipeBook.Controllers
{
    public class RecipesController : Controller
    {
        private readonly RecipeDbContext _context;
        private readonly ChatClient _chatClient;
        public RecipesController( RecipeDbContext context, ChatClient chatClient )
        {
            _context = context;
            _chatClient = chatClient;
        }
         
        // GET: Recipes
        public async Task<IActionResult> Index()
        {
            List<RecipeDisplayModel> recipeViewModels = [];
            var recipeList =  _context.Recipes
                .Include(r => r.tags)
                .ToListAsync();
            await recipeList;
            foreach ( var recipe in recipeList.Result )
            {
                RecipeDisplayModel model = new( recipe );
                recipeViewModels.Add( model );
            }
            return View( recipeViewModels );
        }

        // GET: Recipes/Details/5
        public async Task<IActionResult> Details( int? id )
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes
                .Include(r => r.tags)
                                .Include( r => r.quantities)
                    .ThenInclude( q => q.ingredient )
                .Include( r=> r.quantities )
                    .ThenInclude( q=>q.measurement )
                .Include(r => r.recipe_steps)
                .FirstOrDefaultAsync(m => m.recipe_id == id);
            if (recipe == null)
            {
                return NotFound();
            }
            RecipeDisplayModel model = new( recipe );

            return View( model );
        }

        // GET: Recipes/Create
        public async Task<IActionResult> Create()
        {
            ViewBag.AllTags = await _context.Tags.ToListAsync();
            return View( new RecipeDisplayModel() );
        }

        // POST: Recipes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create( RecipeDisplayModel recipe )
        {
            if (!ModelState.IsValid)
            {
                return View( recipe );
            }
            Recipe newRecipe = await RecipeMapper.ToEntityAsync(recipe, _context);
            _context.Add( newRecipe );
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: Recipes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes
                .Include(r => r.tags)
                .FirstOrDefaultAsync(r => r.recipe_id == id);
            ViewBag.AllTags = await _context.Tags.ToListAsync();
            if (recipe == null)
            {
                return NotFound();
            }
            RecipeDisplayModel recipeVM = new( recipe );
            return View( recipeVM );
        }

        // POST: Recipes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RecipeDisplayModel model)
        {
            var recipe = await _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                .Include(r => r.recipe_steps)
                .FirstOrDefaultAsync(r => r.recipe_id == model.id);

            if ( recipe == null )
                return NotFound();

            recipe.recipe_name = model.name;
            recipe.prep_time = model.prep_time;
            if(model.description != null )
            {
            recipe.recipe_description = model.description;
            }
            recipe.tags.Clear();

            foreach ( var selectedTag in model.selectedTagIds )
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.tag_id == selectedTag);
                if ( tag != null )
                {
                    recipe.tags.Add( tag );
                }
            }
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(recipe);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecipeExists(recipe.recipe_id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(recipe);
        }

        // GET: Recipes/Delete/5    
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes
                .FirstOrDefaultAsync(m => m.recipe_id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        // POST: Recipes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe != null)
            {
                _context.Recipes.Remove(recipe);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.recipe_id == id);
        }
        [HttpPost, ActionName( "Extract" )]
        public async Task<IActionResult> ExtractRecipe( [FromForm] IFormFile image )
        {
            if ( image == null || image.Length == 0 )
            {
                return BadRequest( "Invalid image" );
            }

            byte[] imageBytes;
            using ( var memoryStream = new MemoryStream() )
            {
                await image.CopyToAsync( memoryStream );
                imageBytes = memoryStream.ToArray();
            }
            BinaryData binaryData = new( imageBytes );
            List<ChatMessage> messages = [
                new UserChatMessage(ChatMessageContentPart.CreateImagePart(binaryData, image.ContentType.ToString(), ChatImageDetailLevel.Auto))
                ];
            var response = await _chatClient.CompleteChatAsync( messages, recipeReturn );
            var result = response.Value.Content[0].Text;
            var extracted = JsonSerializer.Deserialize<RecipeDto>( result );
            if(extracted.name == string.Empty )
            {
                return RedirectToAction( nameof( Index ) );
            }
            var newRecipe = await RecipeMapper.FromImportDto( extracted, _context );
            _context.Recipes.Add( newRecipe );
            _context.SaveChanges();
            return RedirectToAction( nameof( Edit ), new { id = newRecipe.recipe_id } );
        }
    }

}
