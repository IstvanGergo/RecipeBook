import { useState } from "react";
import { createRecipe } from "../Api/Api";

export default function AddRecipe() {
    const [recipe, setRecipe] = useState({ name: "", ingredients: "", steps: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        createRecipe(recipe);
    };

    return (
        <div className="container">
            <h1>Add Recipe</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Recipe Name"
                    value={recipe.name}
                    onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                />
                <textarea
                    placeholder="Ingredients"
                    value={recipe.ingredients}
                    onChange={(e) =>
                        setRecipe({ ...recipe, ingredients: e.target.value })
                    }
                />
                <textarea
                    placeholder="Preparation Steps"
                    value={recipe.steps}
                    onChange={(e) => setRecipe({ ...recipe, steps: e.target.value })}
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
}
