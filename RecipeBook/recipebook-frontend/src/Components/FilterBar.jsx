import { useEffect, useState } from "react";
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    TextField
} from '@mui/material';

const API_URL = "https://localhost:7270/recipesapi/";

export default function FilterBar({ onFilter }) {
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [tags, setTags] = useState([]);

    const [ingredientsSelected, setIngredientsSelected] = useState([]);
    const [tagsSelected, setTagsSelected] = useState([]);

    const fetchFilterData = async () => {
        const i = await fetch(`${API_URL}ingredients`);
        const fetchedIngredients = await i.json();
        const t = await fetch(`${API_URL}tags`);
        const fetchedTags = await t.json();

        setIngredients(fetchedIngredients);
        setTags(fetchedTags);
    };

    useEffect(() => {
        fetchFilterData();
    }, []);

    return (
        <div className="filter-bar">
            <TextField
                sx={{ marginBottom: 2 }}
                label="Recept"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                <InputLabel id="tags-select-label">Tagek</InputLabel>
                <Select
                    labelId="tags-label"
                    multiple
                    value={tagsSelected}
                    onChange={(e) => setTagsSelected(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {tags.map((t) => (
                        <MenuItem key={t.tag_name} value={t.tag_name}>
                            <Checkbox checked={tagsSelected.includes(t.tag_name)} />
                            <ListItemText primary={t.tag_name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                onClick={() => onFilter(name, ingredientsSelected, tagsSelected)}
            >
                Apply filters
            </Button>
        </div>
    );
}
