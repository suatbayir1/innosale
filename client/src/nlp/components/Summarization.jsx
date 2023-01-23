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
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';

import CleaningServicesTwoToneIcon from '@mui/icons-material/CleaningServicesTwoTone';
import { Box, Divider, Fab, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles"

// Components
import { Header } from "../../components";
import Selector from "../../components/Selector";
import EntityBlock from "./EntityBlock";
import ImportantWordBlock from "./ImportantWordBlock";
import SaveSettingDialog from "../../components/SaveSettingDialog";
import SettingConfirmationDialog from "../../components/SettingConfirmationDialog";
import InputSlider from "../../components/Slider";
// Actions
import { setOverlay, setDialogData, saveSettings, updateSettings, getAllSettings, getSummarize, getEntities, getSetting, removeSetting } from "../../store/index";
import SummarizeResultDialog from "../../components/SummarizeResultDialog";


class Summarization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Setting Select
            settingsList: [],
            selectedSettingId: '',
            selectedSettingIndex: 0,
            selectedSettingName: '',

            // Save Dialog
            saveSettingName: '',
            selectedRadio: 'new',
            
            // Summarize
            normalWordsFrequencyValue: 0,
            numericFrequencyValue: 0,
            importantWords: [],
            entities: [],

            // Entities
            entitiesList: [],
            
            // Confirmation Dialogs
            openClearScreen: false,
            openDeleteSetting: false
        }
    }

    clearScreen = () => {
        this.setState({
            // Setting Select
            selectedSettingId: '',
            selectedSettingIndex: 0,
            selectedSettingName: '',

            // Save Dialog
            saveSettingName: '',
            selectedRadio: 'new',
            
            // Summarize
            normalWordsFrequencyValue: 0,
            numericFrequencyValue: 0,
            importantWords: [],
            entities: [],
            
            // Confirmation Dialogs
            openClearScreen: false,
            openDeleteSetting: false
        })
    }

    handleDialogBox = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    getSummarizeId = (summarizeId = "0") => {
        console.log({
            "_id": summarizeId == "0" ? this.state.selectedSettingId : summarizeId,
            "path": "/root/whisper_service/static/meetings/m_01.txt"
        })

        return ({
            "_id": summarizeId == "0" ? this.state.selectedSettingId : summarizeId,
            "path": "/root/whisper_service/static/meetings/m_01.txt"
        })
    }
    summarizer = async (summarizeId = "0") => {
        const { getSummarize } = this.props;
        await getSummarize(this.getSummarizeId(summarizeId))
        const { summarizeResult } = this.props;
        console.log(summarizeResult)
    }

    async componentDidMount() {
        // Settings Select
        const { getAllSettings, getEntities } = this.props;
        await getEntities()
        await this.setEntities()

        await getAllSettings()
        await this.setSettingSelect()
        
        await getAllSettings()
        await this.setSettingSelect()

        await this.clearScreen()
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
        for (let i = 0; i < summarizeSettings.length; i++) {
            if (summarizeSettings[i]._id == value) return i;
        }
    }

    handleSelectChance = async (event) => {
        await this.setState({
            [event.target.name]: event.target.value
        });
        const selectedKey = await this.findSelectedKey(event.target.value);
        const setting = this.props.settingsList[selectedKey];
        
        this.setState({
            settingName: setting.name,
            numericFrequencyValue: setting.number,
            normalWordsFrequencyValue: setting.normal,
            entities: setting.entities,
            importantWords: setting.important_words
        })
        
    }

    handleBlockChanges = (target, value) => {
        this.setState({
            [target]: value
        });
    };

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    setSettingSelect = async () => {
        //const { settingsList } = this.state;
        const settingsList = await [];
        const { summarizeSettings } = await this.props;
        

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

    setEntities = () => {
        const { entityList } = this.props
        const { entitiesList } = this.state

        entityList.map((value, key) => {
            entitiesList.push({
                "key": key,
                "value": value.value,
                "text": value.name
            })
        })

        this.setState({
            entitiesList: entitiesList
        })
    }

    addNewItem = (state_name) => {
        if (state_name == "importantWords") {
            this.setState({
                importantWords: [
                    ...this.state.importantWords,
                    { 'word': '', 'freq': 0 }
                ]
            })
        }
        else if (state_name == "entities") {
            this.setState({
                entities: [
                    ...this.state.entities,
                    { 'name': '', 'freq': 0 }
                ]
            })
        }
    }

    findIndex = (name) => {
        const nameList = name.split("_")
        const nameLen = nameList.length
        return nameList[nameLen - 1] 
    }

    applySetting = async (index) => {
        const { summarizeSettings } = this.props 
        console.log(summarizeSettings[index])
        
        await this.setState({ 
            selectedSetting: summarizeSettings[index], 
            saveSettingName: summarizeSettings[index].name,
            entities: summarizeSettings[index].entities,
            importantWords: summarizeSettings[index].important_words,
            normalWordsFrequencyValue: summarizeSettings[index].normal,
            numericFrequencyValue: summarizeSettings[index].number
        })
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // Summarize Settings Select
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

        


        //const { getSetting } = this.props
        //await getSetting({ '_id': value })
        await this.applySetting(index)
        
    }

    // Numeric & Normal Words Frequency
    handleSlider = (sliderName, freq) => {
        this.setState({
            [sliderName]: Number(freq)
        })
    }

    // Entities Block's Select
    handleBlockSelect = async (event) => {
        const { entities } = this.state
        const index = this.findIndex(event.target.name)

        entities[index].name = event.target.value

        this.setState({
            entities: entities
        })
    }

    // Entities & Important Words Block's Slider
    handleBlockSlider = (blockName, name, value) => {
        const index = this.findIndex(name)

        if (blockName == "entities") {
            const { entities } = this.state
            entities[index].freq = Number(value)
            this.setState({ entities: entities })
        }
        else if (blockName == "importantWords") {
            const { importantWords } = this.state
            importantWords[index].freq = Number(value)
            this.setState({ importantWords: importantWords })
        }
    }

    // Save Setting Dialog & Important Words Block's Input
    handleBlockInput = (blockName, name, value) => {
        if (blockName == "importantWords") {
            const index = this.findIndex(name)
            const { importantWords } = this.state
            
            importantWords[index].word = value
            
            this.setState({
                importantWords: importantWords
            })
        }
        else if (blockName == "saveDialog") {
            this.setState({
                [name]: value
            })
        }
    }

    // Remove Items
    handleBlockRemoveItem = (blockName, key) => {
        if (blockName == "importantWords") {
            this.state.importantWords.splice(key, 1)
            this.setState({ importantWords: this.state.importantWords })
        }
        else if (blockName == "entities") {
            this.state.entities.splice(key, 1)
            this.setState({ entities: this.state.entities })
        }
    };

    save = async (onSummarizeButton=false) => {
        const payload = {
            _id: this.state.selectedSettingId,
            name: this.state.saveSettingName,
            normal: this.state.normalWordsFrequencyValue,
            number: this.state.numericFrequencyValue,
            entities: this.state.entities,
            important_words: this.state.importantWords
        }
        const { selectedRadio } = await this.state
        if (onSummarizeButton) {
            await this.props.saveSettings(payload);
            await this.setState(
                {
                    insertedId: this.props.insertedId
                }, async () => {
                    await this.summarizer(this.state.insertedId);
                    await this.props.removeSetting({ '_id': this.state.insertedId }) 
                }
            )

        }
        else {
            if (selectedRadio == "edit") {
                await this.props.updateSettings(payload);
                await alert("Update setting record success!")
            }
            else if (selectedRadio == "new") {
                await this.props.saveSettings(payload);
                await alert("New setting record success!")
            }
            
            await window.location.reload();
            const { getAllSettings } =await this.props;
            await getAllSettings()
            await this.setSettingSelect()
            await this.clearScreen()
            await window.location.reload();
            window.location.reload();
            
        }
    }

    render() {
        const { numericFrequencyValue, normalWordsFrequencyValue, selectedSettingId } = this.state;

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="NLP" title="Summarization" />
                <div style={{ flex: 1, display: 'row', flexDirection: 'row' }}>
                <SettingConfirmationDialog
                        open = {this.state.openDeleteSetting}
                        setOpen = {this.handleDialogBox}
                        name = {"openDeleteSetting"}
                        header = {"Warning"}
                        text = {"Are you sure you want to delete this setting completely?"}
                        confirmedFunction = { async () => {
                            const selected = selectedSettingId.toString();

                            await this.props.removeSetting({
                                '_id': selected
                            })
                            const { getAllSettings } = await this.props;
                            this.setState({});
                            await getAllSettings()
                            await this.setSettingSelect()
                            this.setState({});

                            const settingsList = await []
                            await this.state.settingsList.map((value, key) => {
                                if (value.value != selected) {
                                    settingsList.push({
                                        "key": key,
                                        "value": value.value,
                                        "text": value.text
                                    })
                                }
                            })
                           
                            await this.setState({
                                selectedSettingIndex: 0,
                                selectedSettingName: '',
                                selectedSettingId: '',
                                settingsList: settingsList
                            }, async () => {
                                await this.clearScreen()
                            })
                            
                        }}
                    />
                    <SettingConfirmationDialog
                        open = {this.state.openClearScreen}
                        setOpen = {this.handleDialogBox}
                        name = {"openClearScreen"}
                        header = {"Warning"}
                        text = {"Are you sure you want to clear screen?"}
                        confirmedFunction = {this.clearScreen}
                    />
                    
                    <Stack spacing={2} direction='row' marginBottom={5}>
                        <Selector
                            name = {"selectedSettingId"}
                            title = "Summarize Settings"
                            value = {this.state.selectedSettingId}
                            items = {this.state.settingsList}
                            handleSelect = {this.handleSelect}
                        />
                        <Button
                            style={{ textTransform: 'none', height: '56px' }}
                            variant="outlined"
                            startIcon={<AutoDeleteIcon />}
                            color="error"
                            onClick={() => this.handleDialogBox("openDeleteSetting", true)}
                        >
                            Delete Setting
                        </Button>
                        <Button
                            style={{ textTransform: 'none', height: '56px' }}
                            variant="outlined"
                            startIcon={<CleaningServicesTwoToneIcon />}
                            color="warning"
                            onClick={() => this.handleDialogBox("openClearScreen", true)}
                        >
                            Clear Screen
                        </Button>
                        <SaveSettingDialog
                            handleBlockChanges={this.handleBlockChanges}
                            save={this.save}
                            saveSettingName = {this.state.saveSettingName}
                            selectedRadio = {this.state.selectedRadio}
                        />
                        <SummarizeResultDialog
                            save = {this.save}
                            summarizeResult = {this.props.summarizeResult}
                        />
                        <div>
                            <Button
                                style={{ textTransform: 'none' }}
                                variant="contained"
                                startIcon={<TextSnippetRoundedIcon />}
                                color="primary"
                                onClick={() => {console.log(this.state)}}
                            >
                                Log State
                            </Button>
                        </div>
                        
                    </Stack>

                    <Stack spacing={10} marginBottom={5} direction='row'>
                        <InputSlider
                            title = "Numeric Frequency"
                            name = "numericFrequencyValue"
                            value = {numericFrequencyValue}
                            handleSlider = {this.handleSlider}
                        />
                        <InputSlider
                            title = "Normal Words Frequency"
                            name = "normalWordsFrequencyValue"
                            value = {normalWordsFrequencyValue}
                            handleSlider = {this.handleSlider}
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
                                <div style={{ maxWidth: '100%', maxHeight: '300px', overflow: 'scroll', overflowX: 'hidden', overflowY: 'auto' }}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                        >
                                        <div />
                                        <EntityBlock
                                            entities = {this.state.entities}
                                            entitiesList = {this.state.entitiesList}
                                            handleBlockSelect = {this.handleBlockSelect}
                                            handleBlockSlider = {this.handleBlockSlider}
                                            handleBlockRemoveItem = {this.handleBlockRemoveItem}
                                        />
                                        <div />
                                    </Stack>
                                </div>
                                <Fab
                                    size="small"
                                    color="success"
                                    style={{ alignSelf: 'center', marginTop: 15 }}
                                    onClick={() => { this.addNewItem("entities"); }}
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
                                <div style={{ maxWidth: '100%', maxHeight: '300px', overflow: 'scroll', overflowX: 'hidden', overflowY: 'auto' }}>
                                    <Stack
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                    >
                                        <div />
                                        <ImportantWordBlock
                                            importantWords={this.state.importantWords}
                                            handleBlockInput = {this.handleBlockInput}
                                            handleBlockSlider = {this.handleBlockSlider}
                                            handleBlockRemoveItem = {this.handleBlockRemoveItem}
                                        />
                                        <div />

                                    </Stack>
                                </div>
                                <Fab
                                    size="small"
                                    color="success"
                                    style={{ alignSelf: 'center', marginTop: 15 }}
                                    onClick={() => { this.addNewItem("importantWords"); }}
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
        selectedSetting: state.nlp.selectedSetting,
        summarizeSettings: state.nlp.summarizeSettings,
        summarizeResult: state.nlp.summarizeResult,
        entityList: state.nlp.entityList,
        insertedId: state.nlp.insertedId

    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        saveSettings: (payload) => dispatch(saveSettings(payload)),
        updateSettings: (payload) => dispatch(updateSettings(payload)),
        getAllSettings: () => dispatch(getAllSettings()),
        getEntities: () => dispatch(getEntities()),
        getSummarize: (payload) => dispatch(getSummarize(payload)),
        getSetting: (payload) => dispatch(getSetting(payload)),
        removeSetting: (payload) => dispatch(removeSetting(payload))
        
    }
}

export default connect(mstp, mdtp)(Summarization);
