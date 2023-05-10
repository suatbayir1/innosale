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

import DeleteIcon from '@mui/icons-material/Delete';
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
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestorePageRoundedIcon from '@mui/icons-material/RestorePageRounded';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Actions
import { setOverlay, setDialogData, uploadAudioFile, setUploadAudioLoading, updateAudio, getAllSettings, getTransribeResults, editTranscribeResult, getQueueTable, getHash, addTranscribeQueue, deleteFromTranscribeQueue } from "../../store/index";

// Constants
import { addAudioFileMessage } from "../../shared/constants/constants";
import BasicTable from '../../components/BasicTable';
import { WindowSharp } from '@mui/icons-material';

class Transcribe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageOpen: true,
            modelSelect: '',
            transcribeButtonActive: false,
            transcribeResultActive: false,

            transcribeResultText: '',
            transcribeResultRestore: '',
        }
    }

    transcribeModelsList = [
        { 'key': 1, 'value': "tiny", 'text': "Tiny" },
        { 'key': 2, 'value': "base", 'text': "Base" },
        { 'key': 3, 'value': "small", 'text': "Small" },
        { 'key': 4, 'value': "medium", 'text': "Medium" },
        { 'key': 5, 'value': "large", 'text': "Large" },
        { 'key': 6, 'value': "large-v2", 'text': "Large v2" },
    ]
    
    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    sec_to_hms = (seconds) => {
        const format = val => `${Math.floor(val)}`
        const hours = seconds / 3600
        const minutes = (seconds % 3600) / 60
        
        return [hours, minutes, seconds % 60].map(format).join(':')
    }

    componentDidMount() {
        const { getQueueTable, getTransribeResults, getHash, dialogData } = this.props;
        getTransribeResults({ 'path': dialogData.data.path })
        getHash({ 'path': dialogData.data.path })
        getQueueTable()

        const intervalQueue = setInterval(getQueueTable, 15000)
        this.setState({ intervalQueue })
        //this.refreshQueue()
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalQueue)
    }

    refreshQueue = async () => {
        const { pageOpen } = await this.state
        const { getQueueTable } = await this.props;
        await getQueueTable()
        await this.wait_for_seconds(10)
        
        if (pageOpen) {
            await this.refreshQueue()
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })

        if (event.target.name === "modelSelect") {
            this.activeController(event.target.value)
        }
    }

    activeController = (value) => {
        this.setState({ transcribeButtonActive: true })
        
        const { transcribeResults, queueTable, currentHash } = this.props
        let didLoopBreaked = false

        if (queueTable) {
            for (let i = 0; i < queueTable.length; i++) {               
                if (queueTable[i].model_name === value && queueTable[i].hash === currentHash) {
                    this.setState({
                        transcribeButtonActive: false,
                        transcribeResultActive: false
                    })
                    didLoopBreaked = true
                    break
                }
            }

            if (!didLoopBreaked && transcribeResults)
            {
                if (transcribeResults.results) {
                    didLoopBreaked = false
    
                    for (let i = 0; i < transcribeResults.results.length; i++) {
                        if (transcribeResults.results[i].model_name === value) {
                            this.setState({
                                transcribeButtonActive: false,
                                transcribeResultActive: true,
                                transcribeResultText: transcribeResults.results[i].modified_result,
                                transcribeResultRestore: transcribeResults.results[i].model_result
                            })
                            didLoopBreaked = true
                            break
                        }
                    }
                }
            }

            if (!didLoopBreaked) {
                this.setState({
                    transcribeButtonActive: true,
                    transcribeResultActive: false,
                })
            }
        }
    }

    render() {
        const { setOverlay, dialogData, queueTable, currentHash, editTranscribeResult, deleteFromTranscribeQueue } = this.props
        const { modelSelect, transcribeButtonActive, transcribeResultActive, transcribeResultText } = this.state

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    Transcribe 
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setOverlay("none")
                            this.setState({ pageOpen: false })
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
                <DialogContent dividers style={{ width: "100%" }}>
                    <FormControl style={{ width: "100%" }}>
                        <Stack spacing={3} margin={3} direction="row" style={{ width: "100%" }}>
                            <FormControl style={{ width: 250 }}>
                                <InputLabel>Transcribe Model</InputLabel>
                                <Select
                                    name="modelSelect"
                                    value={modelSelect}
                                    label="Transcribe Model"
                                    onChange={this.handleChange}
                                >
                                    {
                                        this.transcribeModelsList.map((item, index) => {
                                            return <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <Button
                                variant = "outlined"
                                disabled = {!transcribeButtonActive}
                                startIcon = { <RecordVoiceOverRoundedIcon /> }
                                onClick = {() => {
                                    const { modelSelect } = this.state
                                    const { addTranscribeQueue } = this.props


                                    addTranscribeQueue({
                                        'model': modelSelect,
                                        'path': dialogData.data.path
                                    })

                                    this.setState({ transcribeButtonActive: false })
                                }}
                            >
                                Transcribe
                            </Button>
                        </Stack>
                        <Stack spacing={3} margin={3} marginTop={0} direction="row">
                            {
                                transcribeResultActive

                                ?

                                <Stack style={{ width: "100%" }} direction="column">
                                    <TextField
                                        style = {{ marginTop: "10px", width: "100%" }}
                                        name = "transcribeResultText"
                                        label = "Transcribe Result"
                                        value = {transcribeResultText}
                                        onChange = {this.handleChange}
                                        multiline
                                        rows = {10}
                                    />

                                    <Stack marginTop={2} spacing={2} style={{ width: "50%", alignSelf: 'end', justifyContent: 'end' }} direction="row">
                                        <Button
                                            variant = "outlined"
                                            startIcon = { <SaveRoundedIcon /> }
                                            onClick = {() => {
                                                editTranscribeResult({
                                                    "path": dialogData.data.path,
                                                    "model_name": modelSelect,
                                                    "new_result": transcribeResultText
                                                })
                                            }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant = "outlined"
                                            startIcon = { <RestorePageRoundedIcon /> }
                                            onClick = {() => this.setState({ transcribeResultText: this.state.transcribeResultRestore })}
                                        >
                                            Restore
                                        </Button>
                                        <Button
                                            variant = "outlined"
                                            startIcon = { <SimCardDownloadRoundedIcon /> }
                                            onClick = {() => {
                                                const blob = new Blob([transcribeResultText], { type: "text/plain" });
                                                const url = URL.createObjectURL(blob);
                                                const link = document.createElement("a");
                                                link.download = "export.txt";
                                                link.href = url;
                                                link.click();
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </Stack>
                                </Stack>

                                :

                                <Stack style={{ width: "100%" }}>
                                    {
                                        queueTable

                                        ?
                                        
                                        queueTable.length > 0
                                        
                                        ?  
                                    
                                        <TableContainer style = {{ width: '100%', maxHeight: '300px' }} component={Paper}>
                                            <Table style = {{ width: '100%' }} stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Line</TableCell>
                                                        <TableCell align="center">Status</TableCell>
                                                        <TableCell align="center">Estimated Transcribe Time</TableCell>
                                                        <TableCell align="center">Estimated Wait Time</TableCell>
                                                        <TableCell align="center">Model</TableCell>
                                                        <TableCell align="center">Sound Length</TableCell>
                                                        <TableCell align="center">Cancel Process</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        queueTable.map((item) => (
                                                        
                                                            <TableRow
                                                                key={item.line}
                                                                sx = {{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="center" component="th" scope="row">
                                                                    {item.line}
                                                                </TableCell>
                                                                <TableCell align="center">{currentHash == item.hash ? item.status + " (you)" : item.status}</TableCell>
                                                                <TableCell align="center">{this.sec_to_hms(item.est_transcribe_time)}</TableCell>
                                                                <TableCell align="center">{this.sec_to_hms(item.est_wait_time)}</TableCell>
                                                                <TableCell align="center">{item.model_name.charAt(0).toUpperCase() + item.model_name.slice(1)}</TableCell>
                                                                <TableCell align="center">{this.sec_to_hms(item.sound_len)}</TableCell>
                                                                <TableCell align="center">
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        color={"error"}
                                                                        disabled={item.status === "in_process" || currentHash != item.hash ? true : false}
                                                                        onClick={() => {
                                                                            deleteFromTranscribeQueue({
                                                                                'hash': item.hash,
                                                                                'model_name': item.model_name,
                                                                                'status': item.status  
                                                                            })
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        
                                        :
                                        
                                        "There isn't any transcribe process in queue."
                                        
                                        :
                                        
                                        "There isn't any transcribe process in queue."
                                    }
                                </Stack>
                            }
                        </Stack>
                    </FormControl>
                </DialogContent>
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        dialogData: state.shared.dialogData,
        queueTable: state.nlp.queueTable,
        currentHash: state.nlp.currentHash,
        transcribeResults: state.nlp.transcribeResults,

    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        getQueueTable: () => dispatch(getQueueTable()),
        getHash: (payload) => dispatch(getHash(payload)),
        getTransribeResults: (payload) => dispatch(getTransribeResults(payload)),
        editTranscribeResult: (payload) => dispatch(editTranscribeResult(payload)),
        addTranscribeQueue: (payload) => dispatch(addTranscribeQueue(payload)),
        deleteFromTranscribeQueue: (payload) => dispatch(deleteFromTranscribeQueue(payload))
    }
}

export default connect(mstp, mdtp)(Transcribe);
