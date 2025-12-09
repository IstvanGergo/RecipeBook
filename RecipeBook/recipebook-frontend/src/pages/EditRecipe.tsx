"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { editRecipe, getRecipeById } from "../api/api"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import type { Recipe } from "../types/recipe"

interface EditQuantityState {
  ingredient_name: string
  measurement_name: string
  quantity: number
}

export default function RecipeEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [quantities, setQuantities] = useState<EditQuantityState[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)
        const found = (await getRecipeById(Number(id)) as Recipe)
      if (found) {
        setRecipe(found)
        setQuantities(found.quantities.map((q) => ({ ...q })))
      }
      setLoading(false)
    }
    fetchRecipe()
  }, [id])

  const handleQuantityChange = (index: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setQuantities((prev) => prev.map((q, i) => (i === index ? { ...q, quantity: numValue } : q)))
  }

  const handleSave = async () => {
    setSaving(true)
      try {
          const updatedRecipe: Recipe = {
              id: recipe!.id,
              name: recipe!.name,
              prep_time: recipe!.prep_time,
              description: recipe!.description,
              recipe_picture: recipe!.recipe_picture,
              recipe_steps: recipe!.recipe_steps ?? [],
              selectedTagIds: recipe!.selectedTagIds ?? [],
              selectedTagNames: recipe!.selectedTagNames ?? [],
              quantities: quantities.map((q) => ({
                  ingredient_name: q.ingredient_name,
                  measurement_name: q.measurement_name,
                  quantity: q.quantity,
              })),
          }

          await editRecipe(recipe!.id, updatedRecipe)
          alert("Recept sikeresen mentve!")
          navigate(`/recipes/${id}`)
      } catch (err) {
          alert("Hiba történt a mentés során.")
      } finally {
          setSaving(false)
      }
  }
  

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "grey.100",
        }}
      >
        <CircularProgress size={48} sx={{ color: "#e65100" }} />
      </Box>
    )
  }

  if (!recipe) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h5" textAlign="center" color="text.secondary">
            A recept nem található.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#e65100" }}>
              Vissza a receptekhez
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", pb: 4 }}>
      <Box sx={{ bgcolor: "#e65100", color: "white", py: 2, mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={600}>
              Recept szerkesztése
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize", mb: 1 }}>
            {recipe.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {recipe.description}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "#e65100" }}>
            Hozzávalók szerkesztése
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {quantities.map((q, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  bgcolor: "#fafafa",
                  borderRadius: 1,
                  border: "1px solid #eee",
                }}
              >
                <Typography sx={{ flex: 2, fontWeight: 500 }}>{q.ingredient_name}</Typography>
                <TextField
                  type="number"
                  value={q.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  size="small"
                  inputProps={{ min: 0, step: 5 }}
                  sx={{ width: 100 }}
                />
                <Typography sx={{ flex: 1, color: "text.secondary" }}>{q.measurement_name}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: "#e65100", color: "#e65100" }}>
              Mégse
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{ bgcolor: "#e65100", "&:hover": { bgcolor: "#bf360c" } }}
            >
              {saving ? "Mentés..." : "Mentés"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
