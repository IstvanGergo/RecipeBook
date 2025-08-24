using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using RecipeBook.Models;

namespace RecipeBook.ViewModels
{
    public class RecipeViewModel
    {
        public RecipeViewModel() { }
        public RecipeViewModel(Recipe recipe)
        {
            id = recipe.recipe_id;
            name = recipe.recipe_name;
            prep_time = recipe.prep_time;
            description = recipe.recipe_description;
            recipe_picture = recipe.recipe_picture;
            foreach(Quantity q in recipe.quantities )
            {
                ingredients.Add( q.ingredient );
                measurements.Add( q.measurement );
            }
            foreach( Recipe_step step in recipe.recipe_steps )
            {
                recipe_steps.Add( step );
            }
            foreach( Tag tag in recipe.tags )
            {
                tags.Add( tag );
            }
        }
        public int id { get; set; }
        public string name { get; set; }
        public short prep_time { get; set; }
        public string? description { get; set; }

        public byte[]? recipe_picture { get; set; }
        [Display( Name = "Hozzávalók" )]
        public List<Ingredient> ingredients { get; set; } = [];
        [Display( Name = "Mértékegységek" )]
        public List<int> selectedIngredients { get; set; } = [];
        public List<Measurement> measurements { get; set; } = [];
        [Display( Name = "Lépések" )]
        public List<int> selectedMeasurements { get; set; } = [];

        public List<Recipe_step> recipe_steps { get; set; } = [];
        [Display( Name = "Tagek" )]
        public List<int> selectedTagIds { get; set; } = [];
        public List<Tag> tags { get; set; } = [];
    }
}
