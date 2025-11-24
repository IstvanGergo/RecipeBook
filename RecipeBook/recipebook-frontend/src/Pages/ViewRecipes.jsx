import { useEffect, useState } from "react";
import RecipeCard from "../Components/RecipeCard";
import FilterBar from "../Components/FilterBar";
const API_URL = "https://localhost:7270/api/recipesapi";
export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <>
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
                            <RecipeCard key={r.id} recipe={r} />
                        ))}
                </div>
            )}
        </>
    );
}
