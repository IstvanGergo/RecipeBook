import { useEffect, useState } from "react";
import RecipeCard from "../Components/RecipeCard";
import FilterBar from "../Components/FilterBar";
const API_URL = "https://localhost:7270/recipesapi/";
export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);

    const listToShow = filtered.length > 0 ? filtered : recipes;

    const editRecipe = (id) => {
        console.log("Editing recipe:", id);
    };

    const deleteRecipe = async (id) => {
        console.log("Deleting recipe:", id);

        await fetch(`${API_URL}${id}`, { method: "DELETE" });

        setRecipes(recipes.filter(r => r.id !== id));
    };

    const handleFilter = async (name, selectedIngredients, selectedTags) => {
        const params = new URLSearchParams();

        if (name) params.append("name", name);
        selectedIngredients.forEach(i =>
         console.log(i + "\n"))
        selectedIngredients.forEach(i =>
            params.append("ingredients", i)
        );

        selectedTags.forEach(t =>
            params.append("tags", t),
        );

        setLoading(true);
        
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const data = await res.json();

        setFiltered(data);
        setRecipes();
        setLoading(false);
    };

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

    useEffect(() => {
            fetchData();
        }, []);

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1>Recipes</h1>
                <FilterBar
                    onFilter={handleFilter}
                />
            </div>

            { !loading && (
                <div className="recipes">
                    {
                        listToShow.map(r => (
                            <RecipeCard
                                key={r.id}
                                recipe={r}
                                onEdit={editRecipe}
                                onDelete={deleteRecipe}
                            />
                        ))}
                </div>
            ) }
        </div>
    );
}
