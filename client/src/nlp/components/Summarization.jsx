import React, { Component } from "react"
import { Header } from "../../components";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import { connect } from "react-redux";
import SummarizeSettingSelect from "../../components/SummarizeSettingSelect";
// Actions
import { setOverlay, setDialogData } from "../../store/index";
import InputSlider from "../../components/Slider";

import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import IconButton from '@mui/material/IconButton';
import BasicTextFields from "../../components/TextField";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import { Box, Divider, Fab, Stack } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles"
import importantWord from "./ImportantWord";
import entities from "./Entities";


class Summarization extends Component {
    openSummarizeSettingsDialog = () => {
        const { setOverlay } = this.props;

        setOverlay("summarize-settings");
    }

    render() {
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="NLP" title="Summarization" />
                <div style={{ flex: 1, display: 'row', flexDirection: 'row' }}>
                    <Stack spacing={2} direction='row' marginBottom={5}>
                        <SummarizeSettingSelect />
                        <Button
                            variant="contained"
                            startIcon={<SaveOutlinedIcon/>}
                            style={{ textTransform: 'none' }}
                            color="primary"
                        >
                            Save Settings
                        </Button>
                        <Button
                            style={{ textTransform: 'none' }}
                            variant="contained"
                            startIcon={<TextSnippetRoundedIcon/>}
                            color="primary"
                        >
                            Summarize
                        </Button>
                    </Stack>

                    <Stack spacing={10} marginBottom={5} direction='row'>
                        <InputSlider name="Numeric Frequency" />
                        <InputSlider name="Normal Words Frequency" />
                    </Stack>

                    <Stack spacing={2} direction='row'>
                        <div style={{borderRadius: '5px', borderWidth: 1, borderColor: 'darkgrey', width: '50%'}}>
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                spacing={0}
                                margin={2}
                                divider={<Divider orientation="horizontal" flexItem />}
                            >
                                <div style={{fontWeight: 'bold', marginBottom: 15}}>ENTITIES</div>
                                <div style={{ maxWidth: '100%', maxHeight: '400px' , overflow:'scroll', overflowX: 'hidden', overflowY: 'auto'}}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                        divider={<Divider orientation="horizontal" flexItem />}
                                    >
                                        <div/>
                                        {entities("a", "a")}
                                        <div/>
                                    </Stack>
                                </div>
                                <Fab size="small" color="success" style={{alignSelf: 'center', marginTop: 15}}>
                                    <ControlPointRoundedIcon/>
                                </Fab>
                            </Stack>
                        </div>

                        <div style={{borderRadius: '5px', borderWidth: 1, borderColor: 'darkgrey', width: '50%'}}>
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                spacing={0}
                                margin={2}
                                divider={<Divider orientation="horizontal" flexItem />}
                            >
                                <div style={{fontWeight: 'bold', marginBottom: 15}}>IMPORTANT WORDS</div>
                                <div style={{ maxWidth: '100%', maxHeight: '400px' , overflow:'scroll', overflowX: 'hidden', overflowY: 'auto'}}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                        divider={<Divider orientation="horizontal" flexItem />}
                                    >
                                        <div/>
                                        {importantWord("a", "a")}
                                        <div/>
                                    </Stack>
                                </div>
                                <Fab size="small" color="success" style={{alignSelf: 'center', marginTop: 15}}>
                                    <ControlPointRoundedIcon/>
                                </Fab>
                            </Stack>
                        </div>
                    </Stack>
                </div>   
            </div>
        )
    }
}


const mstp = (state) => {
    return {
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
    }
}

export default connect(mstp, mdtp)(Summarization);
