using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Data;
using RecipeBook.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RecipeBook.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class RecipesApiController : ControllerBase
    {
        private readonly RecipeDbContext _context;

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
    }
}
