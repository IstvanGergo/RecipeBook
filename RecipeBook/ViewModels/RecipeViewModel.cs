using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using RecipeBook.Models;

namespace RecipeBook.ViewModels
{
    public class RecipeViewModel
    {
        public RecipeViewModel() { }
        public RecipeViewModel( Recipe recipe )
        {
            id = recipe.recipe_id;
            name = recipe.recipe_name;
            prep_time = recipe.prep_time;
            description = recipe.recipe_description;
            recipe_picture = recipe.recipe_picture;
            foreach(Quantity q in recipe.quantities )
            {
                QuantityViewModel quantityViewModel = new QuantityViewModel(q);
                quantities.Add( quantityViewModel );
            }
            foreach( Recipe_step step in recipe.recipe_steps )
            {
                recipe_steps.Add( step );
            }
            foreach( Tag tag in recipe.tags )
            {
                selectedTagIds.Add( tag.tag_id );
                selectedTagNames.Add( tag.tag_name );
            }
        }
        public int id { get; set; }
        [Display( Name = "Recept neve" )]
        public string name { get; set; }
        [Display( Name = "Elkészítési idő" )]
        public short prep_time { get; set; }
        [Display( Name = "Rövid leírás" )]
        public string? description { get; set; }

        public byte[]? recipe_picture { get; set; }
        [Display( Name = "Hozzávalók" )]
        public List<QuantityViewModel> quantities { get; set; } = [];
        [Display( Name = "Lépések" )]
        public List<Recipe_step> recipe_steps { get; set; } = [];
        public List<int> selectedTagIds { get; set; } = [];
        [Display( Name = "Tagek" )]
        public List<string> selectedTagNames { get; set; } = [];
    }
}
