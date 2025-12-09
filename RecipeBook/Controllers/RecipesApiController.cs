using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using RecipeBook.Data;
using RecipeBook.Models;
using RecipeBook.ViewModels;
using static RecipeBook.Controllers.ChatCompletions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RecipeBook.Controllers
{
    [Route( "api/recipe" )]
    [ApiController]
    public class RecipesApiController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly ChatClient _chatClient;

        public RecipesApiController( RecipeDbContext context, ChatClient chatClient )
        {
            _context = context;
            _chatClient = chatClient;
        }


        [Route( "ingredient" )]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngredientDisplayModel>>> getIngredients()
        {
            var ingredients = await _context.Ingredients.ToListAsync();
            return Ok( ingredients );
        }

        [Route( "tag" )]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> getTags()
        {
            var tags = await _context.Tags.ToListAsync();
            return Ok( tags );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<RecipeDisplayModel>> GetRecipeById( int id )
        {
            var recipe = await _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.ingredient)
                .Include(r => r.quantities)
                    .ThenInclude(q => q.measurement)
                .Include(r => r.recipe_steps)
                .FirstOrDefaultAsync(r => r.recipe_id == id);

            if ( recipe == null )
                return NotFound();

            return new RecipeDisplayModel( recipe );
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDisplayModel>>> GetFilteredRecipes( [FromQuery] string? name, [FromQuery] List<string>? tags, [FromQuery] List<string>? ingredients )
        {
            var recipeQuery = _context.Recipes
                .Include(r => r.tags)
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
            var recipeViewModels = recipes.Select(r => new RecipeDisplayModel(r)).ToList();

            return Ok( recipeViewModels );
        }
        
        [HttpPost]
        public async Task<ActionResult<IEnumerable<RecipeDisplayModel>>> CreateRecipe( [FromForm] IFormFile image)
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
            var newRecipe = await RecipeMapper.FromImportDto( extracted, _context );
            _context.Recipes.Add( newRecipe );
            await _context.SaveChangesAsync();

            // Load the full recipe with navigation properties
            var fullRecipe = await _context.Recipes
            .Include(r => r.tags)
            .Include(r => r.quantities)
                .ThenInclude(q => q.ingredient)
            .Include(r => r.quantities)
                .ThenInclude(q => q.measurement)
            .Include(r => r.recipe_steps)
            .FirstAsync(r => r.recipe_id == newRecipe.recipe_id);

            var addedRecipe = new RecipeDisplayModel(fullRecipe);
            return CreatedAtAction(
            nameof( GetRecipeById ),
            new { id = newRecipe.recipe_id },  
            addedRecipe              
            );
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteRecipe(int id )
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
        
        [Route( "{id}" )]
        [HttpPut]
        public async Task<IActionResult> UpdateRecipe( int id, [FromBody] RecipeDisplayModel updatedRecipe )
        {
            var existing = await _context.Recipes
        .Include(r => r.recipe_steps)
        .Include(r => r.quantities)
            .ThenInclude(q => q.ingredient)
        .Include(r => r.quantities)
            .ThenInclude(q => q.measurement)
        .Include(r => r.tags)
        .FirstOrDefaultAsync(r => r.recipe_id == id);

            if ( existing == null )
                return NotFound( $"Recipe with ID {id} not found." );
            _context.Update( existing );

            Recipe updated = await RecipeMapper.ToEntityAsync(updatedRecipe, _context);

            existing.recipe_name = updated.recipe_name;
            existing.prep_time = updated.prep_time;
            existing.recipe_description = updated.recipe_description;
            existing.recipe_picture = updated.recipe_picture;

            existing.recipe_steps.Clear();
            existing.quantities.Clear();
            existing.tags.Clear();

            foreach ( var step in updated.recipe_steps )
                existing.recipe_steps.Add( step );

            foreach ( var quantity in updated.quantities )
                existing.quantities.Add( quantity );

            foreach ( var tag in updated.tags )
                existing.tags.Add( tag );
            await _context.SaveChangesAsync();

            return Ok( new { message = "Recipe updated successfully." } );
        }

    }
}
