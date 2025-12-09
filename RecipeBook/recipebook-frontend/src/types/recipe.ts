// Recipe-related interfaces for the application

export interface Quantity {
  ingredient_name: string
  measurement_name: string
  quantity: number
}

export interface RecipeStep {
  recipe_id: number
  step_description: string
  step_number: number
}

export interface Recipe {
  id: number
  name: string
  prep_time: number
  description: string
  recipe_picture: string | null
  quantities: Quantity[]
  recipe_steps: RecipeStep[]
  selectedTagIds: number[]
  selectedTagNames: string[]
}

export interface Ingredient {
  ingredient_name: string
}

export interface Tag {
  tag_name: string
}
