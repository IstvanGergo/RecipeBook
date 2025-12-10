import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getRecipeById } from "../api/api"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import ListAltIcon from "@mui/icons-material/ListAlt"
import type { Recipe, RecipeStep } from "../types/recipe"


function compareSteps(a: RecipeStep, b: RecipeStep): number {
  return a.step_number - b.step_number
}

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)
      setError(null)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const recipe = await getRecipeById(Number(id));
      const foundRecipe = (recipe)

      if (foundRecipe) {
        setRecipe(foundRecipe)
      } else {
        setError("A recept nem található.")
      }

      setLoading(false)
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={48} sx={{ color: "#e65100" }} />
      </Box>
    )
  }

  if (error || !recipe) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 4 }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mb: 3, color: "#e65100" }}>
            Vissza a receptekhez
          </Button>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="error">
              {error || "A recept nem található."}
            </Typography>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", pb: 4 }}>
      <Container maxWidth="md"  sx={{mt: 4}}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mb: 3, color: "#e65100" }}>
          Vissza a receptekhez
        </Button>

        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <Box
            component="img"
            src={
              recipe.recipe_picture ||
              `/placeholder.svg?height=300&width=800&query=${encodeURIComponent(recipe.name + " hungarian food dish")}`
            }
            alt={recipe.name}
            sx={{ width: "100%", height: 300, objectFit: "cover" }}
          />

          <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize", mb: 1 }}>
              {recipe.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccessTimeIcon sx={{ color: "#e65100" }} />
              <Typography variant="body1" color="text.secondary">
                {recipe.prep_time} perc
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {recipe.description}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {recipe.selectedTagNames.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    bgcolor: "#fff3e0",
                    color: "#e65100",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#e65100" }}
              >
                <RestaurantIcon />
                Hozzávalók
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {recipe.quantities.map((q, idx) => (
                    <Typography component="li" variant="body1" key={idx} sx={{ mb: 1, py: 0.5 }}>
                      <Box component="span" sx={{ fontWeight: 500 }}>
                        {q.ingredient_name}
                      </Box>
                      {q.quantity !== 0 && (
                        <Box component="span" sx={{ ml: 1, color: "text.secondary" }}>
                          — {q.quantity} {q.measurement_name}
                        </Box>
                      )}
                      {q.quantity === 0 && (
                        <Box component="span" sx={{ ml: 1, color: "text.secondary" }}>
                          — {q.measurement_name}
                        </Box>
                      )}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#e65100" }}
              >
                <ListAltIcon />
                Elkészítés
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[...recipe.recipe_steps].sort(compareSteps).map((step) => (
                  <Paper
                    key={step.step_number}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "#e65100",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {step.step_number}
                    </Box>
                    <Typography variant="body1" sx={{ pt: 0.5 }}>
                      {step.step_description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
