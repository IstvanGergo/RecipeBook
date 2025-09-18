using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using RecipeBook.ViewModels;

namespace RecipeBook.Models;

public partial class Recipe
{

    public int recipe_id { get; set; }
    public string recipe_name { get; set; } = null!;
    public short prep_time { get; set; }
    public string? recipe_description { get; set; }

    public byte[]? recipe_picture { get; set; }
    public virtual ICollection<Quantity> quantities { get; set; } = [];
    public virtual ICollection<Recipe_step> recipe_steps { get; set; } = [];
    public virtual ICollection<Tag> tags { get; set; } = [];
}