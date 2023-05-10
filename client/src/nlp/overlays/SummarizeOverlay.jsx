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
import { Divider, Stack } from "@mui/material";
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

// Actions
import { setOverlay, setDialogData, uploadAudioFile, setUploadAudioLoading, updateAudio, getAllSettings, getTransribeResults, getSummarize } from "../../store/index";

// Constants
import { addAudioFileMessage } from "../../shared/constants/constants";

class Summarize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelSelect: '',
            settingSelect: '',

            transcribedText: '',
            summarizedText: '',
            similarityType: 'jaccard',

            settingSelectActive: false,
            summarizeButtonActive: false,
            summarizeButtonLoading: false,
            summarizedTextActive: false

        }
    }

    componentDidMount() {
        const { getAllSettings, getTransribeResults, dialogData } = this.props;
        getTransribeResults({ 'path': dialogData.data.path })
        getAllSettings()
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })

        const { transcribeResults } = this.props

        if (event.target.name === "modelSelect" && event.target.value != "not_found") {
            for (let i = 0; i < transcribeResults.results.length; i++) {
                if (event.target.value == transcribeResults.results[i].model_name) {
                    this.setState({ transcribedText: transcribeResults.results[i].modified_result })
                    break
                }
            }
            this.setState({ settingSelectActive: true })
        }

        else if (event.target.name === "settingSelect")
            this.setState({ summarizeButtonActive: true })
    }
    
    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }
    
    capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    render() {
        const { modelSelect, settingSelect, transcribedText, summarizedText, settingSelectActive, summarizeButtonActive, summarizeButtonLoading, summarizedTextActive, similarityType } = this.state;
        const { setOverlay, dialogData, transcribeResults, summarizeSettings, getSummarize, summarizeResult } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    Summarize 
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setOverlay("none")
                        }}
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
                {
                    transcribeResults

                    ?

                    transcribeResults.results

                    ?
                
                    <DialogContent dividers>
                        <Stack
                            direction='row'
                            spacing={2.7}
                            margin={2}
                            divider={<Divider orientation="vertical" flexItem />}   
                            style={{ margin: "10px", width: '100%' }}
                        >
                            <Stack style={{ width: "50%" }}>
                                <FormControl style={{ width: 250 }}>
                                    <InputLabel>Transcribe Models</InputLabel>
                                    <Select
                                        name="modelSelect"
                                        value={modelSelect}
                                        label="Transcribe Models"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            transcribeResults.results
                                            ?
                                            transcribeResults.results.map((item, index) => {
                                                return <MenuItem key={index} value={item.model_name}>{this.capitalize(item.model_name)}</MenuItem>
                                            })
                                            :
                                            <MenuItem value={"not_found"}>There isn't any transcribe result for this audio recording.</MenuItem>
                                        }
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack style={{ width: "50%" }}>
                                <FormControl style={{ width: 250 }}>
                                    <InputLabel>Summarize Settings</InputLabel>
                                    <Select
                                        disabled = {!settingSelectActive}
                                        name="settingSelect"
                                        value={settingSelect}
                                        label="Summarize Settings"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            summarizeSettings.map((item, index) => {
                                                return <MenuItem key={index} value={item._id}>{this.capitalize(item.name)}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack style = {{ width: '45%' }}>
                                <FormControl>
                                    <FormLabel id="similarityType">Similarity Type</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="similarityType"
                                        defaultValue="jaccard"
                                        name="similarityType"
                                        value={similarityType}
                                        onChange={this.handleChange}
                                    >
                                        <FormControlLabel value="jaccard" control={<Radio disabled={!summarizeButtonActive}/>} label="Set" />
                                        <FormControlLabel value="cosinus" control={<Radio disabled={!summarizeButtonActive}/>} label="Vector" />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            <Stack style = {{ width: '25%' }}>
                                <Button
                                    disabled={!summarizeButtonActive}
                                    style={{ textTransform: 'none', height: '56px' }}
                                    startIcon={summarizeButtonLoading ? <CircularProgress size={15} thickness={5} color={"inherit"} /> : <SummarizeRoundedIcon />}
                                    variant="outlined"
                                    onClick={async () => {
                                        await this.setState({ summarizedTextActive: false, summarizeButtonActive: false, summarizeButtonLoading: true })

                                        await getSummarize({ '_id': settingSelect, 'text': transcribedText, 'similarity_type': similarityType })
                                        await this.wait_for_seconds(1)

                                        await this.setState({ summarizedTextActive: true, summarizeButtonActive: true, summarizeButtonLoading: false, summarizedText: summarizeResult.result })
                                    }}
                                >
                                    Summarize
                                </Button>
                            </Stack>
                            <Stack style = {{ width: '25%' }}>
                                <Button
                                    disabled={!summarizeButtonActive || summarizeButtonLoading || !summarizedTextActive}
                                    style={{ textTransform: 'none', height: '56px' }}
                                    startIcon={<SimCardDownloadIcon />}
                                    variant="outlined"
                                    onClick={() => {
                                        const blob = new Blob([summarizedText], { type: "text/plain" });
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement("a");
                                        link.download = "sumarization_result.txt";
                                        link.href = url;
                                        link.click();
                                    }}
                                >
                                    Download
                                </Button>
                            </Stack>
                            
                        </Stack>
                        <Stack
                            direction='row'
                            spacing={3}
                            margin={2}
                            divider={<Divider orientation="vertical" flexItem  />}   
                            style={{ margin: "10px" }}
                        >
                            <DialogContentText width='50%' textAlign={'justify'}>
                                <TextField
                                    style={{ marginTop: "10px", width: "100%" }}
                                    name="transcribedText"
                                    label="Transcribed Text"
                                    multiline
                                    rows={10}
                                    value={transcribedText}
                                    onChange={this.handleChange}
                                />
                            </DialogContentText>
                            <DialogContentText width='50%' textAlign={'justify'}>
                                <TextField
                                    style={{ marginTop: "10px", width: "100%" }}
                                    name="summarizedText"
                                    label="Summarized Text"
                                    multiline
                                    rows={10}
                                    value={summarizedTextActive ? summarizeResult.result: ''}
                                />
                            </DialogContentText>
                        </Stack>
                    </DialogContent>

                    :
                                        
                    <DialogContent>There isn't any transcribe result for this audio recording.</DialogContent>

                    :
                    
                    <DialogContent>There isn't any transcribe result for this audio recording.</DialogContent>
                    
                }
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        uploadAudioLoading: state.nlp.uploadAudioLoading,
        dialogData: state.shared.dialogData,
        summarizeSettings: state.nlp.summarizeSettings,
        transcribeResults: state.nlp.transcribeResults,
        summarizeResult: state.nlp.summarizeResult
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        uploadAudioFile: (payload) => dispatch(uploadAudioFile(payload)),
        setUploadAudioLoading: (payload) => dispatch(setUploadAudioLoading(payload)),
        updateAudio: (payload) => dispatch(updateAudio(payload)),
        getAllSettings: () => dispatch(getAllSettings()),
        getTransribeResults: (payload) => dispatch(getTransribeResults(payload)),
        getSummarize: (payload) => dispatch(getSummarize(payload))
    }
}

export default connect(mstp, mdtp)(Summarize);
