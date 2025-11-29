using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Quantity
{
    public int quantity_id { get; set; }

    public int recipe_id { get; set; }

    public int ingredient_id { get; set; }

    public int measurement_id { get; set; }

    public double ingredient_quantity { get; set; }

    public virtual Ingredient ingredient { get; set; } = null!;

    public virtual Measurement measurement { get; set; } = null!;

    public virtual Recipe recipe { get; set; } = null!;
}
