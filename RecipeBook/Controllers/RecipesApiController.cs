using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using RecipeBook.Data;
using RecipeBook.ViewModels;
using static RecipeBook.Controllers.ChatCompletions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RecipeBook.Controllers
{
    [Route( "[controller]" )]
    [ApiController]
    public class RecipesApiController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly ChatClient _chatClient;

        public RecipesApiController( RecipeDbContext context )
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeViewModel>>> GetRecipes()
        {
            var recipes = await _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.ingredient)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.measurement)
                .Include(r => r.recipe_steps)
                .ToListAsync();

            var recipeViewModels = recipes.Select(r => new RecipeViewModel(r)).ToList();

            return Ok( recipeViewModels );
        }
        [Route( "ingredients" )]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngredientViewModel>>> getIngredients()
        {
            var ingredients = await _context.Ingredients.ToListAsync();
            return Ok( ingredients );
        }

        [Route( "names" )]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> getRecipeNames()
        {
            var recipeNames = await _context.Recipes.ToListAsync();
            return Ok( recipeNames );
        }

        [Route( "/{name}/{tags}/{ingredients}" )]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeViewModel>>> GetFilteredRecipes( [FromRoute] string? name, [FromRoute] List<string>? tags, [FromRoute] List<string>? ingredients )
        {
            var recipeQuery = _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.ingredient)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.measurement)
                .Include(r => r.recipe_steps)
                .AsQueryable();
            if ( !string.IsNullOrEmpty( name ) )
            {
                recipeQuery = recipeQuery.Where(r => r.recipe_name.ToLower().Contains(name.ToLower()));
            }
            if ( tags != null && tags.Count != 0 )
            {
                recipeQuery = recipeQuery.Where(r=> r.tags.Any(t => tags.Contains(t.tag_id.ToString())
                || tags.Contains(t.tag_name.ToLower())));
            }
            if ( ingredients != null && ingredients.Count() != 0 )
            {
                recipeQuery = recipeQuery.Where( r =>
                    r.quantities.Any( q =>
                        ingredients.Contains( q.ingredient.ingredient_id.ToString() ) ||
                        ingredients.Contains( q.ingredient.ingredient_name ) ) );
            }

            var recipes = await recipeQuery.ToListAsync();
            var recipeViewModels = recipes.Select(r => new RecipeViewModel(r)).ToList();

            return Ok( recipeViewModels );
        }
        [Route("create")]
        [HttpPost]
        public async Task<ActionResult<IEnumerable<RecipeViewModel>>> CreateRecipe( [FromForm] IFormFile image)
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
                new UserChatMessage(ChatMessageContentPart.CreateImagePart(binaryData,image.ContentType.ToString(),ChatImageDetailLevel.Auto))
                ];
            var response = await _chatClient.CompleteChatAsync(messages, recipeReturn);
            var result = response.Value.Content[0].Text;
            var extracted = JsonSerializer.Deserialize<RecipeDto>( result );
            var newRecipeViewModel = await RecipeMapper.FromImportDto( extracted, _context );
            var recipe = await RecipeMapper.ToEntityAsync( newRecipeViewModel, _context );
            _context.Recipes.Add( recipe );
            await _context.SaveChangesAsync();

            // Load the full recipe with navigation properties
            var fullRecipe = await _context.Recipes
            .Include(r => r.tags)
            .Include(r => r.quantities)
                .ThenInclude(q => q.ingredient)
            .Include(r => r.quantities)
                .ThenInclude(q => q.measurement)
            .Include(r => r.recipe_steps)
            .FirstAsync(r => r.recipe_id == recipe.recipe_id);

            var addedRecipe = new RecipeViewModel(fullRecipe);

            return Ok( addedRecipe );
        }
        [Route("{id}")]
        [HttpDelete]
        public async Task<IActionResult> deleteRecipe(int id )
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if ( recipe == null )
            {
                return NotFound();
            }
            _context.Recipes.Remove( recipe );
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
