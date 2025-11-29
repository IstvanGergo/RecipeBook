using Humanizer;
using RecipeBook.Models;
using RecipeBook.ViewModels;

namespace RecipeBook.ViewModels
{
    public class RecipeDto
    {
        public string name { get; set; }
        public short time { get; set; }
        public string short_description { get; set; }
        public List<string> tags { get; set; }
        public List<StepDto> steps { get; set; }
        public List<QuantityDto> quantities { get; set; }
    }
    public class StepDto
    {
        public int number { get; set; }
        public string description { get; set; }
    }

    public class QuantityDto
    {
        public string ingredient { get; set; }
        public double quantity { get; set; }
        public string measurement { get; set; }
    }
}
