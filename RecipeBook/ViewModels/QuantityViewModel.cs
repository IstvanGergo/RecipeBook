using RecipeBook.Models;

namespace RecipeBook.ViewModels
{
    public class QuantityViewModel
    {
        public string ingredient_name { get; set; }
        public string measurement_name { get; set; }
        public int quantity { get; set; }
        public QuantityViewModel() { }
        public QuantityViewModel( Quantity _quantity )
        {
            ingredient_name = _quantity.ingredient.ingredient_name;
            measurement_name = _quantity.measurement.measurement_name;
            quantity = _quantity.ingredient_quantity;
        }
    }
}
