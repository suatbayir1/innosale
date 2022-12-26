// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { DropzoneArea } from "mui-file-dropzone";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { NotificationManager } from 'react-notifications';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';

// Actions
import { setOverlay, uploadAudioFile, setUploadAudioLoading, updateAudio } from "../../store/index";

// Constants
import { addAudioFileMessage } from "../../shared/constants/constants";

class UploadAudioFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            model: "tiny",
            files: []
        }
    }

    componentDidMount() {
        const { dialogData } = this.props;

        if (dialogData.mode === "edit") {
            this.setState({
                model: dialogData.data.model
            })
        }
    }

    handleChange = (files) => {
        this.setState({
            files: files
        });
    }

    upload = () => {
        const { files, model } = this.state;
        const { uploadAudioFile, setUploadAudioLoading } = this.props;

        if (files[0] === undefined) {
            NotificationManager.error("You have not selected any files", "Missing Data", 3000);
            return;
        }

        setUploadAudioLoading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('filename', files[0]["name"]);
        formData.append('model', model);

        uploadAudioFile(formData)
    }

    save = () => {
        const { model } = this.state;
        const { dialogData, updateAudio, setUploadAudioLoading } = this.props;

        setUploadAudioLoading(true);

        const payload = {
            "attributes": {
                "model": model,
            },
            "where": {
                "id": dialogData.data.id
            }
        }

        updateAudio(payload);
    }

    render() {
        const { model } = this.state;
        const { setOverlay, uploadAudioLoading, dialogData } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {dialogData.title || ""}
                    {
                        !uploadAudioLoading &&
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
                    }
                </DialogTitle>

                {
                    uploadAudioLoading ? <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: '300px'
                    }}>
                        <CircularProgress size={200} thickness={1} />
                    </Box>
                        :
                        <>
                            <DialogContent dividers>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <DialogContentText>
                                            {addAudioFileMessage}
                                        </DialogContentText>
                                    </Grid>

                                    <Grid item xs={12} md={12}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <InputLabel id="model-select">Model</InputLabel>
                                            <Select
                                                labelId="model-select"
                                                id="model-select"
                                                value={model}
                                                label="Model"
                                                onChange={(e) => { this.setState({ model: e.target.value }) }}
                                            >
                                                <MenuItem value={"tiny"}>Tiny</MenuItem>
                                                <MenuItem value={"base"}>Base</MenuItem>
                                                <MenuItem value={"small"}>Small</MenuItem>
                                                <MenuItem value={"medium"}>Medium</MenuItem>
                                                <MenuItem value={"large"}>Large</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12}>

                                    </Grid>
                                </Grid>
                                {
                                    dialogData.mode === "upload" &&
                                    < DropzoneArea
                                        onChange={this.handleChange}
                                        filesLimit={1}
                                        showPreviews={true}
                                        acceptedFiles={['audio/*', 'video/*']}
                                        showPreviewsInDropzone={false}
                                        showFileNames={true}
                                        showFileNamesInPreview={true}
                                        dropzoneText={"Drag and drop an audio file here or click"}
                                    />
                                }
                            </DialogContent>
                            <DialogActions style={{ justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={dialogData.mode === "upload" ? <FileUploadIcon /> : <CheckIcon />}
                                    style={{ textTransform: 'none' }}
                                    onClick={dialogData.mode === "upload" ? this.upload : this.save}
                                    color={dialogData.mode === "upload" ? "primary" : "success"}
                                >
                                    {dialogData.mode === "upload" ? "Upload" : "Save"}
                                </Button>
                            </DialogActions>
                        </>
                }
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        uploadAudioLoading: state.nlp.uploadAudioLoading,
        dialogData: state.shared.dialogData
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        uploadAudioFile: (payload) => dispatch(uploadAudioFile(payload)),
        setUploadAudioLoading: (payload) => dispatch(setUploadAudioLoading(payload)),
        updateAudio: (payload) => dispatch(updateAudio(payload)),
    }
}

export default connect(mstp, mdtp)(UploadAudioFile);
