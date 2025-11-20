import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
    return (
        <div className="card">
            <h3>{recipe.name}</h3>
            <Link to={`/recipes/${recipe.id}`}>View</Link>
        </div>
    );
}
