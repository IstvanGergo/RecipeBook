import type React from "react"

import { Link } from "react-router-dom"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import type { Recipe } from "../types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (id: number) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete && window.confirm(`Biztosan törölni szeretnéd a "${recipe.name}" receptet?`)) {
      onDelete(recipe.id)
      }
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardActionArea component={Link} to={`/recipes/${recipe.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="180"
          image={
            recipe.recipe_picture ||
            `/placeholder.svg?height=180&width=400&query=${encodeURIComponent(recipe.name)}`
          }
          alt={recipe.name}
          sx={{ objectFit: "cover" }}
        />

        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600} sx={{ textTransform: "capitalize" }}>
              {recipe.name}
            </Typography>
          }
          subheader={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {recipe.prep_time} perc
              </Typography>
            </Box>
          }
          sx={{ pb: 0 }}
        />

        <CardContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
            {recipe.description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {recipe.selectedTagNames.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: "#fff3e0",
                  color: "#e65100",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5, borderTop: "1px solid #eee" }}>
        <Button
          component={Link}
          to={`/recipes/${recipe.id}/edit`}
          startIcon={<EditIcon />}
          size="small"
          sx={{
            color: "#1976d2",
            "&:hover": { bgcolor: "#e3f2fd" },
          }}
        >
          Szerkesztés
        </Button>
        <Button
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
          size="small"
          sx={{
            color: "#d32f2f",
            "&:hover": { bgcolor: "#ffebee" },
          }}
        >
          Törlés
        </Button>
      </CardActions>
    </Card>
  )
}
