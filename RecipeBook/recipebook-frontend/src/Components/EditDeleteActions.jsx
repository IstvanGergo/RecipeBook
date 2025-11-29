import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function EditDeleteActions({ onEdit, onDelete }) {
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const handleDeleteClick = () => {
        setConfirmOpen(true);
    };

    const handleCancel = () => {
        setConfirmOpen(false);
    };

    const handleConfirmDelete = () => {
        setConfirmOpen(false);
        onDelete(); // Call parent's delete handler
    };

    return (
        <>
            {/* Buttons */}
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={onEdit}>
                    Edit
                </Button>

                <Button variant="outlined" color="error" onClick={handleDeleteClick}>
                    Delete
                </Button>
            </Stack>

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={handleCancel}>
                <DialogTitle>Confirm delete</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}