// Libraries
import React, { Component } from "react"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import { connect } from "react-redux";
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import IconButton from '@mui/material/IconButton';
import BasicTextFields from "../../components/TextField";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import { Box, Divider, Fab, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles"

// Components
import { Header } from "../../components";
import Selector from "../../components/Selector";
import ImportantWord from "./ImportantWord";
import EntityBlock from "./EntityBlock";
import ImportantWordBlock from "./ImportantWordBlock";

import entities from "./Entities";

import InputSlider from "../../components/Slider";
// Actions
import { setOverlay, setDialogData, saveSettings, updateSettings, getAllSettings } from "../../store/index";
import SaveSettingDialog from "../../components/SaveSettingDialog";

class Summarization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectList: [],
            settingId: '',
            settingName: '',
            summarizeSettingSelect: 0,
            numericFrequencyValue: 0,
            normalWordsFrequencyValue: 0,
            entities: [],
            importantWords: []
        }
        
    }

    databaseConnect = () => {
        const { summarizeSettings } = this.props;
        console.log(this.state)
        console.log(summarizeSettings)
        
    }

    setSettingSelect = () => {
        const selectList = [];
        const { summarizeSettings } = this.props;

        summarizeSettings.map((value, key) => {
            selectList.push({
                "key": key,
                "value": value._id,
                "text": value.name
            })      
        })
        return selectList;
    }

    componentDidMount() {
        const { getAllSettings } = this.props;
        getAllSettings();
        this.setState({
            selectList: this.setSettingSelect()
        })
    }

    handleSliderChange = (event, newValue) => {
        this.setState({
            [event.target.name]: newValue
        });
    };

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: Number(event.target.value)
        });
    };

    findSelectedKey = (value) => {
        const { summarizeSettings } = this.props;
        for (let i = 0; i < summarizeSettings.length; i++)
        {
            if (summarizeSettings[i]._id == value) return i;
        }
    }

    handleSelectChance = async (event) => {
        await this.setState({
            [event.target.name]: event.target.value
        });
        const selectedKey = await this.findSelectedKey(event.target.value);
        const setting = this.props.summarizeSettings[selectedKey];

        this.setState({
            settingName: setting.name,
            numericFrequencyValue: setting.number,
            normalWordsFrequencyValue: setting.normal,
            entities: setting.entities,
            importantWords: setting.important_words
        })
        console.log(this.state)
    }

    handleBlockChanges = (target, value) => {
        console.log(value)
        this.setState({
            [target]: value
        });
        
    };

    handleBlockRemoveItem = (state_name, key) => {
        if (state_name == "importantWords"){
            this.state.importantWords.splice(key, 1)
            this.setState({ importantWords: this.state.importantWords })
        }
        else if (state_name == "entities"){
            this.state.entities.splice(key, 1)
            this.setState({ entities: this.state.entities })
        }
    };

    

    addNewItem = (state_name) => {
        if (state_name == "importantWords"){
            this.state.importantWords.push({'word': '', 'freq': 0})
            this.setState({ importantWords: this.state.importantWords })
        }
        else if (state_name == "entities"){
            this.state.entities.push({'name': '', 'freq': 0})
            this.setState({ entities: this.state.entities })
        }
    }

    save = (save_mode) => {
        console.log(save_mode)
        const payload = {
            _id: this.state.settingId,
            name: this.state.settingName,
            normal: this.state.normalWordsFrequencyValue,
            number: this.state.numericFrequencyValue,
            entities: this.state.entities,
            important_words: this.state.importantWords
        }

        if (save_mode == "edit")
        {
            this.props.updateSettings(payload);
            window.location.reload();        
            alert("Update setting record success!")
        }
        else if (save_mode == "new")
        {
            this.props.saveSettings(payload);
            window.location.reload();        
            alert("New setting record success!")
        }
    }

    render() {
        const { numericFrequencyValue, normalWordsFrequencyValue } = this.state;
        
        const items = [
            { "key": "0", "value": "63ada8a8d4f9446683ec449b", "text": "Met01"},
            { "key": "1", "value": "2", "text": "Met12"},
            { "key": "2", "value": "3", "text": "Met23"},
            { "key": "3", "value": "4", "text": "Met34"},
            { "key": "4", "value": "5", "text": "Met45"}
        ];
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="NLP" title="Summarization" />
                <div style={{ flex: 1, display: 'row', flexDirection: 'row' }}>
                    <Stack spacing={2} direction='row' marginBottom={5}>       
                        <Selector
                            name = "settingId"
                            title = "Summarize Settings"
                            handleSelectChance={this.handleSelectChance}
                            value = {this.state.settingId}
                            items = {this.state.selectList}
                        />
                        <Button
                            variant="contained"
                            startIcon={<SaveOutlinedIcon />}
                            style={{ textTransform: 'none' }}
                            color="primary"
                            onClick={this.save}
                        >
                            Save Settings
                        </Button>
                        <SaveSettingDialog
                            name={this.state.settingName}
                            handleBlockChanges={this.handleBlockChanges}
                            save={this.save}
                        />
                        <Button
                            style={{ textTransform: 'none' }}
                            variant="contained"
                            startIcon={<TextSnippetRoundedIcon />}
                            color="primary"
                            onClick={this.databaseConnect}
                        >
                            Summarize
                        </Button>
                    </Stack>

                    <Stack spacing={10} marginBottom={5} direction='row'>
                        <InputSlider
                            title="Numeric Frequency"
                            name="numericFrequencyValue"
                            value={numericFrequencyValue}
                            handleInputChange={this.handleInputChange}
                            handleSliderChange={this.handleSliderChange}
                        />
                        <InputSlider
                            title="Normal Words Frequency"
                            name="normalWordsFrequencyValue"
                            value={normalWordsFrequencyValue}
                            handleInputChange={this.handleInputChange}
                            handleSliderChange={this.handleSliderChange}
                        />
                    </Stack>

                    <Stack spacing={2} direction='row'>

                        <div style={{ borderRadius: '5px', borderWidth: 1, borderColor: 'darkgrey', width: '50%' }}>
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                spacing={0}
                                margin={2}
                                divider={<Divider orientation="horizontal" flexItem />}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: 15 }}>ENTITIES</div>
                                <div style={{ maxWidth: '100%', maxHeight: '400px', overflow: 'scroll', overflowX: 'hidden', overflowY: 'auto' }}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                        divider={<Divider orientation="horizontal" flexItem />}
                                    >
                                        <div />
                                        <EntityBlock
                                            entities={this.state.entities}
                                            handleBlockChanges={this.handleBlockChanges}
                                            handleBlockRemoveItem={this.handleBlockRemoveItem}
                                        />
                                        <div />
                                    </Stack>
                                </div>
                                <Fab
                                    size="small"
                                    color="success"
                                    style={{ alignSelf: 'center', marginTop: 15 }}
                                    onClick={() => {this.addNewItem("entities");}}
                                >
                                    <ControlPointRoundedIcon />
                                </Fab>
                            </Stack>
                        </div>

                        <div style={{ borderRadius: '5px', borderWidth: 1, borderColor: 'darkgrey', width: '50%' }}>
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                spacing={0}
                                margin={2}
                                divider={<Divider orientation="horizontal" flexItem />}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: 15 }}>IMPORTANT WORDS</div>
                                <div style={{ maxWidth: '100%', maxHeight: '400px', overflow: 'scroll', overflowX: 'hidden', overflowY: 'auto' }}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                        divider={<Divider orientation="horizontal" flexItem />}
                                    >
                                        <div />
                                        <ImportantWordBlock
                                            importantWords={this.state.importantWords}
                                            handleBlockChanges={this.handleBlockChanges}
                                            handleBlockRemoveItem={this.handleBlockRemoveItem}
                                        />
                                        <div />

                                    </Stack>
                                </div>
                                <Fab
                                    size="small"
                                    color="success"
                                    style={{ alignSelf: 'center', marginTop: 15 }}
                                    onClick={() => {this.addNewItem("importantWords");}}
                                >
                                    <ControlPointRoundedIcon />
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
        summarizeSettings: state.nlp.summarizeSettings
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        saveSettings: (payload) => dispatch(saveSettings(payload)),
        updateSettings: (payload) => dispatch(updateSettings(payload)),
        getAllSettings: () => dispatch(getAllSettings()),
    }
}

export default connect(mstp, mdtp)(Summarization);
