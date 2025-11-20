import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById, deleteRecipe } from "../Api/Api";

export default function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        getRecipeById(id).then(setRecipe);
    }, [id]);

    if (!recipe) return <p>Loading...</p>;

    return (
        <div className="container">
            <h1>{recipe.name}</h1>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Steps:</strong> {recipe.steps}</p>

            <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
            <button onClick={() => { deleteRecipe(id); navigate("/recipes"); }}>
                Delete
            </button>
        </div>
    );
}