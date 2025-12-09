import { Link } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Recipe Book
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" component={Link} to="/recipes">
            Receptek
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Hozzáadás
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
