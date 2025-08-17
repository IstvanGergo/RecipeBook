using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Recipe_tag
{
    public int recipe_id { get; set; }

    public int tag_id { get; set; }

    public virtual Recipe recipe { get; set; } = null!;

    public virtual Tag tag { get; set; } = null!;
}
