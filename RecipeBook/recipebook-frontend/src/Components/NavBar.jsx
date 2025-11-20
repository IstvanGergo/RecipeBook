import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link> |
            <Link to="/recipes">Recipes</Link> |
            <Link to="/add">Add Recipe</Link>
        </nav>
    );
}
