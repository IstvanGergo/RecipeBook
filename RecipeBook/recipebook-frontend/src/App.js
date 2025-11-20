import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ViewRecipes from "./Pages/ViewRecipes";
import AddRecipe from "./Pages/AddRecipe";
import RecipeDetails from "./Pages/RecipeDetails";
import Navbar from "./Components/NavBar";

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<ViewRecipes />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route path="/add" element={<AddRecipe />} />
            </Routes>
        </Router>
    );
}
