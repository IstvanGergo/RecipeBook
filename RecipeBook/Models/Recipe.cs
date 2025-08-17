using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RecipeBook.Models;

public partial class Recipe
{
    public int recipe_id { get; set; }
    [Display( Name = "Recept neve" )]
    public string recipe_name { get; set; } = null!;
    [Display( Name = "Elkészítési idő" )]
    public short prep_time { get; set; }
    [Display( Name = "Recept rövid leírása" )]
    public string? recipe_description { get; set; }

    public byte[]? recipe_picture { get; set; }
    [Display( Name = "Hozzávalók" )]
    public virtual ICollection<Quantity> Quantities { get; set; } = new List<Quantity>();
    [Display( Name = "Lépések" )]
    public virtual ICollection<Recipe_step> Recipe_steps { get; set; } = new List<Recipe_step>();
    [Display( Name = "Tagek" )]
    public virtual ICollection<Tag> tags { get; set; } = new List<Tag>();
}