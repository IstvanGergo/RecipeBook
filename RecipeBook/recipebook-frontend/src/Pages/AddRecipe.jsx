import { useEffect, useState } from "react";
import { createRecipe } from "../Api/Api";
import { styled } from '@mui/material/styles';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    TextField,
    Button
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const API_URL = "https://localhost:7270/recipesapi/";
const INGREDIENTS_API_URL = API_URL + "ingredients";

export default function AddRecipe() {
    const [recipe, setRecipe] = useState({ name: "", ingredients: "", steps: "" });
    const [ingredients, setIngredients] = useState([]);

    const [ingredientsSelected, setIngredientsSelected] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchIngredients = await fetch(INGREDIENTS_API_URL);
                const responseIngredients = await fetchIngredients.json();
                setIngredients(responseIngredients);
            }
            catch {

            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createRecipe(recipe);
    };

    return (
        <div className="container">
            <h2>Recept hozzáadása manuálisan</h2>
            <TextField
                sx={{ marginBottom: 2 }}
                label="Recept"
                variant="outlined"
                fullWidth
            />
            <FormControl fullWidth
                sx={{ marginBottom: 2 }}>
                <InputLabel id="ingredients-select-label">Hozzávalók</InputLabel>
                <Select
                    labelId="ingredients-label"
                    multiple
                    value={ingredientsSelected}
                    onChange={(e) => setIngredientsSelected(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {ingredients.map((i) => (
                        <MenuItem key={i.ingredient_name} value={i.ingredient_name}>
                            <Checkbox checked={ingredientsSelected.includes(i.ingredient_name)} />
                            <ListItemText primary={i.ingredient_name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth
                sx={{ marginBottom: 2 }}>
                <InputLabel id="tags-select-label">Hozzávalók</InputLabel>
                <Select
                    labelId="ingredients-label"
                    multiple
                    value={ingredientsSelected}
                    onChange={(e) => setIngredientsSelected(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {ingredients.map((i) => (
                        <MenuItem key={i.ingredient_name} value={i.ingredient_name}>
                            <Checkbox checked={ingredientsSelected.includes(i.ingredient_name)} />
                            <ListItemText primary={i.ingredient_name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}>
                Recept feltöltése
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                />
            </Button>
            <h2>Recept hozzáadása kép alapján</h2>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Kép feltöltése
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                />
            </Button>
        </div>
    );
}
