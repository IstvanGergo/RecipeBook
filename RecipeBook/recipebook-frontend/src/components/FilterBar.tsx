"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  TextField,
  type SelectChangeEvent,
  Box,
} from "@mui/material"
import type { Ingredient, Tag } from "../types/recipe"

const API_URL = "https://localhost:7270/api/recipe/"

interface FilterBarProps {
  onFilter: (name: string, ingredients: string[], tags: string[]) => void
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [name, setName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [ingredientsSelected, setIngredientsSelected] = useState<string[]>([])
  const [tagsSelected, setTagsSelected] = useState<string[]>([])

  const fetchFilterData = async () => {
    try {
      const i = await fetch(`${API_URL}ingredient`)
      const fetchedIngredients: Ingredient[] = await i.json()
      const t = await fetch(`${API_URL}tag`)
      const fetchedTags: Tag[] = await t.json();
      fetchedTags.sort((a, b) => a.tag_name.localeCompare(b.tag_name));
      fetchedIngredients.sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
      setIngredients(fetchedIngredients)
      setTags(fetchedTags)
    } catch (error) {
      console.error("Failed to fetch filter data:", error)
    }
  }

  useEffect(() => {
    fetchFilterData()
  }, [])

  const handleIngredientsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setIngredientsSelected(typeof value === "string" ? value.split(",") : value)
  }

  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setTagsSelected(typeof value === "string" ? value.split(",") : value)
  }

  return (
    <Box
      className="filter-bar"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 600, mx: "auto" }}
    >
      <FormControl fullWidth>
        <InputLabel id="ingredients-select-label">Hozzávalók</InputLabel>
        <Select
          labelId="ingredients-select-label"
          label="Hozzávalók"
          multiple
          value={ingredientsSelected}
          onChange={handleIngredientsChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {ingredients.map((i) => (
            <MenuItem key={i.ingredient_name} value={i.ingredient_name}>
              <Checkbox checked={ingredientsSelected.includes(i.ingredient_name)} />
              <ListItemText primary={i.ingredient_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="tags-select-label">Tagek</InputLabel>
        <Select
          labelId="tags-select-label"
          label="Tagek"
          multiple
          value={tagsSelected}
          onChange={handleTagsChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {tags.map((t) => (
            <MenuItem key={t.tag_name} value={t.tag_name}>
              <Checkbox checked={tagsSelected.includes(t.tag_name)} />
              <ListItemText primary={t.tag_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={() => onFilter(name, ingredientsSelected, tagsSelected)}>
        Apply filters
      </Button>
    </Box>
  )
}
