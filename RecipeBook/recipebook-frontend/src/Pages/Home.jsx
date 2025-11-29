import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container">
            <h1>Receptkezelő</h1>
            <Link to="/recipes">Receptek</Link>
            <br />
            <Link to="/add">Recept hozzáadása</Link>
        </div>
    );
}
