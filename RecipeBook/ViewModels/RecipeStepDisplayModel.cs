using RecipeBook.Models;
namespace RecipeBook.ViewModels
{
    public class RecipeStepDisplayModel
    {
        public int recipe_id { get; set; }

        public string step_description { get; set; } = null!;

        public int step_number { get; set; }
        public RecipeStepDisplayModel() { }
        public RecipeStepDisplayModel( Recipe_step _recipe_step )
        {
            recipe_id = _recipe_step.recipe_id;
            step_number = _recipe_step.step_number;
            step_description = _recipe_step.step_description;
        }
    }
}
