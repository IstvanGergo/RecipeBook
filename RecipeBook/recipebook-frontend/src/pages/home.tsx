import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
          Receptkezelő
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Fedezd fel és kezeld kedvenc receptjeidet!
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" size="large" component={Link} to="/recipes">
            Receptek
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/add">
            Recept hozzáadása
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
