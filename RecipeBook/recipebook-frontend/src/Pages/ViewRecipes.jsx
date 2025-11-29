import { useEffect, useState } from "react";
import RecipeCard from "../Components/RecipeCard";
import FilterBar from "../Components/FilterBar";
const API_URL = "https://localhost:7270/recipesapi/";
export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);

    const editRecipe = (id) => {
        console.log("Editing recipe:", id);
        // navigate to edit page OR open a modal
    };

    const deleteRecipe = async (id) => {
        console.log("Deleting recipe:", id);

        await fetch(`${API_URL}${id}`, { method: "DELETE" });

        setRecipes(recipes.filter(r => r.id !== id));
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                const recipesData = await response.json();
                setRecipes(recipesData);
            }
            finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1>Recipes</h1>
                <FilterBar
                    recipes={recipes}
                    setFiltered={setFiltered}
                />
            </div>
            { recipes && !loading && (
                <div className="recipes">
                    {
                        recipes.map(r => (
                            <RecipeCard key={r.id} recipe={r}
                                onEdit={editRecipe}
                                onDelete={deleteRecipe} />
                        ))}
                </div>
            )}
        </div>
    );
}
