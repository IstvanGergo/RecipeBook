import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container">
            <h1>Welcome to the Recipe App</h1>
            <Link to="/recipes">View Recipes</Link>
            <br />
            <Link to="/add">Add Recipe</Link>
        </div>
    );
}
