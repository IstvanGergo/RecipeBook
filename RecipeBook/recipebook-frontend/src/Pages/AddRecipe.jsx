import { useState } from "react";
import { createRecipe } from "../Api/Api";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
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

export default function AddRecipe() {
    const [recipe, setRecipe] = useState({ name: "", ingredients: "", steps: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        createRecipe(recipe);
    };

    return (
        <div className="container">
            <h1>Add Recipe</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Recipe Name"
                    value={recipe.name}
                    onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                />
                <textarea
                    placeholder="Ingredients"
                    value={recipe.ingredients}
                    onChange={(e) =>
                        setRecipe({ ...recipe, ingredients: e.target.value })
                    }
                />
                <textarea
                    placeholder="Preparation Steps"
                    value={recipe.steps}
                    onChange={(e) => setRecipe({ ...recipe, steps: e.target.value })}
                />
                <button type="submit">Add</button>
            </form>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                />
            </Button>
        </div>
    );
}
