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
import TextField from '@mui/material/TextField';

// Actions
import { setOverlay, uploadAudioFile, setUploadAudioLoading, updateAudio } from "../../store/index";

// Constants
import { addAudioFileMessage } from "../../shared/constants/constants";

class UploadAudioFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teklifId: "",
            model: "tiny",
            files: []
        }
    }

    componentDidMount() {
        const { dialogData } = this.props;
        console.log({ dialogData })

        if (dialogData.mode === "edit") {
            this.setState({
                model: dialogData.data.model,
            })
        }

        if (dialogData.data.teklifId) {
            this.setState({
                teklifId: dialogData.data.teklifId,
            })
        }
    }

    handleChange = (files) => {
        this.setState({
            files: files
        });
    }

    upload = () => {
        const { files, model, teklifId } = this.state;
        const { uploadAudioFile, setUploadAudioLoading } = this.props;

        if (files[0] === undefined) {
            NotificationManager.error("You have not selected any files", "Missing Data", 3000);
            return;
        }

        if (teklifId === "" || teklifId < 1) {
            NotificationManager.error("Teklif Id cannot be empty or zero", "Wrong Data", 3000);
            return;
        }

        setUploadAudioLoading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('filename', files[0]["name"]);
        formData.append('model', model);
        formData.append('teklifId', teklifId);

        uploadAudioFile(formData)
    }

    save = () => {
        const { model, teklifId } = this.state;
        const { dialogData, updateAudio, setUploadAudioLoading } = this.props;

        setUploadAudioLoading(true);

        const payload = {
            "attributes": {
                "model": model,
                "teklifId": teklifId
            },
            "where": {
                "id": dialogData.data.id
            }
        }

        updateAudio(payload);
    }

    render() {
        const { model, teklifId } = this.state;
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

                                    <Grid item xs={12} md={12} >
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Id"
                                                variant="outlined"
                                                value={teklifId}
                                                type={"number"}
                                                inputProps={{
                                                    min: 0
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled={dialogData.data.teklifId ? true : false}
                                                onChange={(e) => { this.setState({ teklifId: e.target.value }) }}
                                            />
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
                                        maxFileSize={999999999}	
                                        dropzoneText={"Drag and drop an audio file here or click"}
                                    /> 
                                    /*
                                    <DropzoneAreaBase
                                        onChange={this.handleChange}
                                        filesLimit={1}
                                        showPreviews={true}
                                        acceptedFiles={['audio/*', 'video/*']}
                                        showPreviewsInDropzone={false}
                                        showFileNames={true}
                                        showFileNamesInPreview={true}
                                        maxFileSize={999999999}	
                                        dropzoneText={"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
                                    />
                                    */
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
