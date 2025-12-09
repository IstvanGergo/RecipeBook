"use client"

import React, { useState, ChangeEvent } from "react"
import { createRecipe } from "../api/api"
import { styled } from "@mui/material/styles"
import {
    Button,
    Typography,
    Container,
    Stack,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
})

export default function AddRecipe() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setSelectedFile(file)
        setMessage(file ? `Kiválasztott fájl: ${file.name}` : "")
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Kérlek, válassz ki egy képet!")
            return
        }

        setUploading(true)
        setMessage("Feltöltés folyamatban...")

        try {
            const formData = new FormData()
            formData.append("image", selectedFile)

            const response = await createRecipe(formData)

            if (response.ok) {
                setMessage("Recept sikeresen feltöltve!")
            } else {
                setMessage("Hiba történt a feltöltés során.")
            }
        } catch (error) {
            console.error(error)
            setMessage("Nem sikerült csatlakozni a szerverhez.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h2" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
                Recept hozzáadása kép alapján
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Kép kiválasztása
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </Button>

                <Button
                    variant="outlined"
                    color="success"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? "Feltöltés..." : "Feltöltés indítása"}
                </Button>
            </Stack>

            {message && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Container>
    )
}
