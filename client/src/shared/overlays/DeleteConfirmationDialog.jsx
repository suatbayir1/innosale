// Libraries
import React, { Component } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';

class DeleteConfirmationDialog extends Component {
    render() {
        const { open, onClose, text, onAccept } = this.props;

        return (
            <Dialog open={open} aria-labelledby="customized-dialog-title" maxWidth={"xs"}>
                <DialogTitle>
                    Are you sure ?
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <DialogContentText>
                                {text}
                            </DialogContentText>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={<CloseIcon />}
                        style={{ textTransform: 'none' }}
                        onClick={onClose}
                        color="error"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckIcon />}
                        style={{ textTransform: 'none' }}
                        onClick={onAccept}
                        color="success"
                    >
                        Yes, I Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default DeleteConfirmationDialog;