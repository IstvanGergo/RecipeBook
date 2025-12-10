import { useEffect, useState } from "react"
import { getRecipes } from "../api/api"
import FilterBar from "../components/FilterBar"
import RecipeCard from "../components/RecipeCard"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import type { Recipe } from "../types/recipe"


export default function ViewRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredRecipes = recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchData = async () => {
    setLoading(true)
    const recipes = await getRecipes();
    setRecipes(recipes as Recipe[])
    setLoading(false)
  }

  const handleDelete = (id: number) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }
  const handleFilter = async (name: string, selectedIngredients: string[], selectedTags: string[]) => {
    const params = new URLSearchParams();

    if (name) {
        params.append("name", name);
    }
    selectedIngredients.forEach(i =>
        params.append("ingredients", i))
    selectedTags.forEach(i =>
        params.append("tags", i))

    setLoading(true);
    const res = await getRecipes(params);

    setRecipes(res as Recipe[])
    setLoading(false);
    }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
          <TextField
            label="Keresés receptek között..."
            variant="outlined"
            fullWidth
            value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ bgcolor: "white", borderRadius: 1, marginBottom: 2 }}
                  />
            <FilterBar
                onFilter={handleFilter}/>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={48} sx={{ color: "#e65100" }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              justifyItems: "center",
            }}
          >
            {filteredRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} onDelete={handleDelete} />
            ))}
          </Box>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ py: 8 }}>
            Nem található recept.
          </Typography>
        )}
      </Container>
    </Box>
  )
}
