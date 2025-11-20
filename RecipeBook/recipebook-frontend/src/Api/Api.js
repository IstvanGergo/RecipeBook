const API_URL = "http://localhost:7270/api/recipesapi";

export async function getRecipes() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function getRecipeById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
}

export async function createRecipe(recipe) {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
    });
}

export async function deleteRecipe(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
