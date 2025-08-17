using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Ingredient
{
    public int ingredient_id { get; set; }

    public string ingredient_name { get; set; } = null!;

    public virtual ICollection<Quantity> Quantities { get; set; } = new List<Quantity>();
}
