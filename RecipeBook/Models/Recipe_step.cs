using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Recipe_step
{
    public int recipe_id { get; set; }

    public string step_description { get; set; } = null!;

    public int step_number { get; set; }

    public virtual Recipe recipe { get; set; } = null!;
}
