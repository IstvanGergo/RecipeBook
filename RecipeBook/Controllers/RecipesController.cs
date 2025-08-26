using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Data;
using RecipeBook.Models;
using RecipeBook.ViewModels;

namespace RecipeBook.Controllers
{
    public class RecipesController : Controller
    {
        private readonly RecipeDbContext _context;

        public RecipesController(RecipeDbContext context)
        {
            _context = context;
        }

        // GET: Recipes
        public async Task<IActionResult> Index()
        {
            List<RecipeViewModel> recipeViewModels = [];
            var recipeList =  _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                .Include(r => r.recipe_steps)
                .ToListAsync();
            await recipeList;
            foreach ( var recipe in recipeList.Result )
            {
                RecipeViewModel model = new( recipe );
                recipeViewModels.Add( model );
            }
            return View( recipeViewModels );
        }

        // GET: Recipes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes
                .Include(r => r.tags)
                .Include(r => r.quantities)
                .Include(r => r.recipe_steps)
                .FirstOrDefaultAsync(m => m.recipe_id == id);
            if (recipe == null)
            {
                return NotFound();
            }
            RecipeViewModel model = new( recipe );

            return View( model );
        }

        // GET: Recipes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Recipes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("recipe_id,recipe_name,prep_time,recipe_category_id")] Recipe recipe)
        {
            if (ModelState.IsValid)
            {
                _context.Add(recipe);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(recipe);
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
            RecipeViewModel recipeVM = new( recipe);
            return View( recipeVM );
        }

        // POST: Recipes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RecipeViewModel model)
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
            recipe.recipe_description = model.description;
            recipe.tags.Clear();

            foreach ( var tagId in model.selectedTagIds )
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.tag_id == tagId);
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
    }
}
