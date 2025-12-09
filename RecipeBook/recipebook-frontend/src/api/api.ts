import type { Recipe } from "../types/recipe"

const API_URL = "https://localhost:7270/api/recipe"

export async function getRecipes(params?: URLSearchParams): Promise<Recipe[]> {
  if (params) {
      const res = await fetch(`${API_URL}?${params.toString()}`)
      return res.json()
  }
  const res = await fetch(API_URL)
  return res.json()
}

export async function getRecipeById(id: number | string): Promise<Recipe> {
  const res = await fetch(`${API_URL}/${id}`)
  return res.json()
}

export async function createRecipe(recipe: FormData) {
  return fetch(API_URL, {
    method: "POST",
    body: recipe,
  })
}

export async function editRecipe(id: number, recipe: Recipe) {
    return fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
    })
}
export async function deleteRecipe(id: number | string): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" })
}
