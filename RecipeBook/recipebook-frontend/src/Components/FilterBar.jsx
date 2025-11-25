import { useEffect, useState } from "react";
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
const API_URL = "https://localhost:7270/recipesapi/";
const NAMES_API_URL = API_URL + "names";
const INGREDIENTS_API_URL = API_URL + "ingredients";
export default function FilterBar({ recipes, setFiltered }) {
    const [names, setNames] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState([]);

    const [ingredient, selectIngredient] = useState('');
    const [recipe, selectRecipe] = useState('');
    const handleIngredientChange = (event) => {
        selectIngredient(event.target.value);
    };
    const handleRecipeChange = (event) => {
        selectRecipe(event.target.value);
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchNames = await fetch(NAMES_API_URL);
                const responseNames = await fetchNames.json();
                setNames(responseNames);
                const fetchIngredients = await fetch(INGREDIENTS_API_URL);
                const responseIngredients = await fetchIngredients.json();
                setIngredients(responseIngredients);
            }
            catch {

            }
        };
        fetchData();
    }, []);

    const handleFilter = () => {
        setFiltered(
            recipes.filter((r) =>
                r.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    };

    return (
        <div className="filter-bar">
            <FormControl fullWidth>
                <InputLabel id="recipes-select-label">Receptek</InputLabel>
                <Select
                    type="text"
                    label="Receptek"
                    value={recipe}
                    onChange={handleRecipeChange}
                >
                    {
                        names.map(n => (
                            <MenuItem>{n.recipe_name}</MenuItem>))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="ingredients-select-label">Hozzávalók</InputLabel>
                <Select
                    type="text"
                    label="Hozzávalók"
                    value={ingredient}
                    onChange={handleIngredientChange}
                >
                    {
                        ingredients.map(i => (
                            <MenuItem>{i.ingredient_name}</MenuItem>))
                    }
                </Select>
            </FormControl>
            <button onClick={handleFilter}>Keresés</button>
        </div>
    );
}
