import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import ViewRecipes from "./pages/ViewRecipe"
import AddRecipe from "./pages/AddRecipe"
import RecipeDetails from "./pages/RecipeDetails"
import Navbar from "./components/navbar"
import RecipeEdit from "./pages/EditRecipe";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e65100",
      light: "#ff833a",
      dark: "#ac1900",
    },
    secondary: {
      main: "#2e7d32",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ViewRecipes />} />
          <Route path="/recipes" element={<ViewRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/recipes/:id/edit" element={<RecipeEdit />} />
          <Route path="/add" element={<AddRecipe />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
