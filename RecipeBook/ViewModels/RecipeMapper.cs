using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Data;
using RecipeBook.Models;

namespace RecipeBook.ViewModels
{
    public class RecipeMapper
    {
        public static async Task<Recipe> ToEntityAsync(RecipeViewModel _model, RecipeDbContext _dbContext )
        {
            var recipe = new Recipe
            {
                recipe_name = _model.name,
                prep_time = _model.prep_time,
                recipe_description = _model.description,
                recipe_picture = _model.recipe_picture,
            };
            foreach ( var step in _model.recipe_steps )
            {
                recipe.recipe_steps.Add( new Recipe_step
                {
                    step_description = step.step_description,
                    step_number = step.step_number
                } );
            }
            for ( int i = 0; i < _model.selectedTagIds.Count(); ++i )
            {
                var tagId = _model.selectedTagIds[i];
                var tagName = _model.selectedTagNames.ElementAtOrDefault(i);
                var tag = await _dbContext.Tags.FindAsync(tagId);
                recipe.tags.Add( tag );

            }
            foreach ( var qDto in _model.quantities ?? Enumerable.Empty<QuantityViewModel>() )
            {
                var ingredient = await _dbContext.Ingredients
                .FirstOrDefaultAsync(i => i.ingredient_name == qDto.ingredient_name);
                if ( ingredient == null )
                {
                    ingredient = new Ingredient { ingredient_name = qDto.ingredient_name };
                    _dbContext.Ingredients.Add( ingredient );
                }
                var measurement = _dbContext.Measurements.Local
                .FirstOrDefault(m => m.measurement_name == qDto.measurement_name);
                if(measurement == null )
                {
                    measurement = await _dbContext.Measurements
                    .FirstOrDefaultAsync(m => m.measurement_name == qDto.measurement_name);
                    if ( measurement == null)
                    {
                        measurement = new Measurement { measurement_name = qDto.measurement_name };
                        _dbContext.Measurements.Add( measurement );
                    }
                }

                var quantity = new Quantity
                {
                    ingredient = ingredient,
                    measurement = measurement,
                    ingredient_quantity = qDto.quantity
                };

                recipe.quantities.Add( quantity );
            }
            _dbContext.SaveChanges();
            return recipe;
        }
        public static async Task<RecipeViewModel> FromImportDto( RecipeDto dto, RecipeDbContext _dbContext )
        {
            var recipe = new RecipeViewModel()
            {
                name = dto.name,
                prep_time = ( short )dto.time,
                description = dto.short_description,

                selectedTagNames = dto.tags, 

                recipe_steps = dto.steps
                    .Select( s => new Recipe_step { step_number = s.number, step_description = s.description } )
                    .ToList(),

                quantities = dto.quantities
                    .Select( q => new QuantityViewModel
                    {
                        ingredient_name = q.ingredient,
                        measurement_name = q.measurement,
                        quantity = q.quantity
                    } )
                    .ToList()
            };

            // Handle tags not in DB
            var existingTags = await _dbContext.Tags.Where( t=> dto.tags.Contains(t.tag_name) ).ToListAsync();
            var existingTagNames = existingTags.Select( t=>t.tag_name ).ToList();
            var newTagNames = dto.tags.Except(existingTagNames).ToList();
            var newTags = newTagNames.Select(name => new Tag{ tag_name = name }).ToList();

            _dbContext.Tags.AddRange(newTags);
            var allTags = existingTags.Concat(newTags).ToList();

            await _dbContext.SaveChangesAsync();
            foreach( var t in allTags )
            {
                recipe.selectedTagIds.Add(t.tag_id);
            }
            return recipe;
        }
    }
}
