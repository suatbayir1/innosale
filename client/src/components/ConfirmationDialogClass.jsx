// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

// Actions
import { setOverlay, } from "../store/index";

const styles = theme => ({
    root: {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
        }
    }
});

class ConfirmationDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { setOverlay } = this.props;

        return (
            <Dialog open={true} aria-labelledby="customized-dialog-title" maxWidth={"lg"}>
                <DialogTitle>
                    Are you sure ?
                    <IconButton
                        aria-label="close"
                        onClick={() => { setOverlay("none") }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <DialogContentText>
                                <Grid container spacing={2}>
                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Id"
                                                variant="outlined"
                                                type={"number"}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Talep Rev No"
                                                type={"number"}
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContentText>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={<CheckIcon />}
                        style={{ textTransform: 'none' }}
                        color="success"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        );
    }
};

const mstp = (state) => {
    return {
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
    }
}

export default withStyles(styles)(connect(mstp, mdtp)(ConfirmationDialog));
