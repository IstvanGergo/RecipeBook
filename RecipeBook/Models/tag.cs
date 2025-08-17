using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Tag
{
    public int tag_id { get; set; }

    public string tag_name { get; set; } = null!;

    public virtual ICollection<Recipe> recipes { get; set; } = new List<Recipe>();
}
