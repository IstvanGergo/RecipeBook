using RecipeBook.Models;

namespace RecipeBook.ViewModels
{
    public class QuantityDisplayModel
    {
        public string ingredient_name { get; set; }
        public string measurement_name { get; set; }
        public double quantity { get; set; }
        public QuantityDisplayModel() { }
        public QuantityDisplayModel( Quantity _quantity )
        {
            ingredient_name = _quantity.ingredient.ingredient_name;
            measurement_name = _quantity.measurement.measurement_name;
            quantity = _quantity.ingredient_quantity;
        }
    }
}
