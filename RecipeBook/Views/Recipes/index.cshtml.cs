using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Data;
using RecipeBook.Models;

namespace RecipeBook.Views.Recipes
{
    public class indexModel : PageModel
    {
        private readonly RecipeDbContext _context;

        public indexModel(RecipeDbContext context)
        {
            _context = context;
        }

        public IList<Recipe> recipe { get;set; } = default!;

        public async Task OnGetAsync()
        {
            recipe = await _context.Recipes.ToListAsync();
        }
    }
}
