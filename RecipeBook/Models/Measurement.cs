using System;
using System.Collections.Generic;

namespace RecipeBook.Models;

public partial class Measurement
{
    public int measurement_id { get; set; }

    public string measurement_name { get; set; } = null!;

    public virtual ICollection<Quantity> Quantities { get; set; } = new List<Quantity>();
}
