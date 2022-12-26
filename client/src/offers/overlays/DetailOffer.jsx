// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { NotificationManager } from 'react-notifications';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { DropzoneArea } from "mui-file-dropzone";

// Actions
import { setOverlay, addPart, setPartsGridLoading, updatePart, setPartOverlayLoading } from "../../store/index";

// Services
import { SceneService } from '../../shared/services'

// Scene Helpers
var camera, controls, scene, renderer;

class DetailOffer extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { setOverlay, dialogData } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
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
                    </Grid>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={dialogData.mode === "add" ? <AddIcon /> : <CheckIcon />}
                        style={{ textTransform: 'none' }}
                        onClick={dialogData.mode === "add" ? this.add : this.update}
                        color={dialogData.mode === "add" ? "primary" : "success"}
                    >
                        {dialogData.mode === "add" ? "Add Part" : "Update Part"}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        dialogData: state.shared.dialogData,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
    }
}

export default connect(mstp, mdtp)(DetailOffer);