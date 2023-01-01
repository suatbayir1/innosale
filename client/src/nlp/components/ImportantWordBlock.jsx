import React, { Component } from "react"
import { Fab, Stack } from "@mui/material";
import InputSlider from "../../components/Slider";
import BasicTextFields from "../../components/TextField";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

class ImportantWordBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            importantWords: props.importantWords
        }
    }

    handleInputChange = (event) => {
        const name = event.target.name
        const split_name = name.split("_")
        const state_number = Number(split_name[split_name.length - 1])

        const { importantWords } = this.state
        importantWords[state_number].word = String(event.target.value);
        
        this.setState({
            importantWords: importantWords
        });
        this.props.handleBlockChanges("importantWords", importantWords)
    }

    handleSliderChange = (event) => {
        const name = event.target.name
        const split_name = name.split("_")
        const state_number = Number(split_name[split_name.length - 1])
        
        const { importantWords } = this.state
        importantWords[state_number].freq = Number(event.target.value)

        this.setState({
            importantWords: importantWords
        });
        this.props.handleBlockChanges("importantWords", importantWords)
    }

    render(){

        return this.state.importantWords.map((important, key) => {
            return(
                <Stack direction='row' spacing={7} key={key}>
                    <BasicTextFields
                        title="Important Word"
                        value={important.word}
                        name={"importantWordField_" + key}
                        handleInputChange={this.handleInputChange}
                    />
                    <InputSlider
                        title="Important Word Frequency"
                        name={"importantWordSlider_" + key}
                        value={important.freq}
                        handleSliderChange={this.handleSliderChange}
                        handleInputChange={this.handleSliderChange}
                    />
                    <Fab
                        size="small"
                        color="error"
                        onClick={() => {
                            this.props.handleBlockRemoveItem("importantWords", key);
                        }}
                        style={{alignSelf: 'center'}}>
                        <DeleteForeverRoundedIcon/>
                    </Fab>
                </Stack>
            )
        })
    }
}

export default ImportantWordBlock;