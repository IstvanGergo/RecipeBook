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
                quantities.Add( q );
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
        public Recipe ToEntity(  )
        {
            var recipe = new Recipe
            {
                recipe_id = this.id,
                recipe_name = this.name,
                prep_time = this.prep_time,
                recipe_description = this.description,
                recipe_picture = this.recipe_picture,

                quantities = this.quantities.ToList(),
                recipe_steps = this.recipe_steps.ToList(),
                tags = this.selectedTagIds
                    .Select( tagId => new Tag { tag_id = tagId } )
                    .ToList()
            };

            return recipe;
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
        public List<Quantity> quantities { get; set; } = [];
        [Display( Name = "Lépések" )]
        public List<Recipe_step> recipe_steps { get; set; } = [];
        [Display( Name = "Tagek" )]
        public List<int> selectedTagIds { get; set; } = [];
        [Display( Name = "Tagek" )]
        public List<Tag> tags { get; set; } = [];
    }
}
