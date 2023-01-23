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
import Selector from "../../components/Selector";
import { Stack } from "@mui/material";

// Actions
import { setOverlay, uploadAudioFile, setUploadAudioLoading, updateAudio, getAllSettings } from "../../store/index";

// Constants
import { addAudioFileMessage } from "../../shared/constants/constants";

class Summarize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settingsList: [],
            selectedSettingId: '',
            selectedSettingIndex: 0,
            selectedSettingName: '',

        }
    }

    componentDidMount() {
        // Settings Select
        const { getAllSettings } = this.props;
        getAllSettings()

        this.setSettingSelect()
        console.log(this.state.settingsList)
    }

    setSettingSelect = () => {
        const { settingsList } = this.state;
        const { summarizeSettings } = this.props;

        summarizeSettings.map((value, key) => {
            settingsList.push({
                "key": key,
                "value": value._id,
                "text": value.name
            })
        })

        this.setState({
            settingsList: settingsList
        })
    }

    handleSelect = async (event, name, value, index) => {
        await this.setState({
            selectedSettingIndex: index,
            selectedSettingName: name,
            selectedSettingId: value
        }, () => {
            console.log(this.state.selectedSettingIndex);
            console.log(this.state.selectedSettingName);
            console.log(this.state.selectedSettingId);
        })
    }

    render() {
        const { model, teklifId } = this.state;
        const { setOverlay, uploadAudioLoading, dialogData } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="lg"
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
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                            <FormControl style={{ minWidth: "100%", flexDirection: "row" }}>
                                {/**/}
                                    <Stack style={{ minWidth: "45%" }}>
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
                                    </Stack>
                                    <Stack style = {{ marginLeft: 20 }}>
                                        <Selector
                                            name = {"selectedSettingId"}
                                            title = "Summarize Settings"
                                            value = {this.state.selectedSettingId}
                                            items = {this.state.settingsList}
                                            handleSelect = {this.handleSelect}
                                        />
                                    </Stack>
                            </FormControl>
                        </Grid>
                    </Grid>
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
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        uploadAudioLoading: state.nlp.uploadAudioLoading,
        dialogData: state.shared.dialogData,
        summarizeSettings: state.nlp.summarizeSettings
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        uploadAudioFile: (payload) => dispatch(uploadAudioFile(payload)),
        setUploadAudioLoading: (payload) => dispatch(setUploadAudioLoading(payload)),
        updateAudio: (payload) => dispatch(updateAudio(payload)),
        getAllSettings: () => dispatch(getAllSettings())
    }
}

export default connect(mstp, mdtp)(Summarize);
