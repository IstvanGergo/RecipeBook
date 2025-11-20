import { useEffect, useState } from "react";
import { getRecipes } from "../Api/Api";
import RecipeCard from "../Components/RecipeCard";
import FilterBar from "../Components/FilterBar";

export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        getRecipes().then(data => {
            setRecipes(data);
            setFiltered(data);
        });
    }, []);

    return (
        <div className="container">
            <h1>Recipes</h1>
            <FilterBar
                recipes={recipes}
                setFiltered={setFiltered}
            />
            {filtered.map(r => (
                <RecipeCard key={r.id} recipe={r} />
            ))}
        </div>
    );
}
