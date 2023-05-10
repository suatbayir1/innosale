import React, { Component } from "react"
import { Fab, Stack } from "@mui/material";
import InputSlider from "../../components/Slider";
import BasicTextFields from "../../components/TextField";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

class ImportantWordBlock extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const { importantWords } = this.props
        return importantWords.map((important, key) => {
            return(
                <Stack direction='row' spacing={7} key={key}>
                    <BasicTextFields
                        title = "Important Word"
                        value = {important.word}
                        name = {"importantWordField_" + key}
                        handleInputChange = {(name, value) => {
                            this.props.handleBlockInput("importantWords", name, value)
                        }}
                        isImportantWord={true}
                    />
                    <InputSlider
                        title = "Important Word Frequency"
                        name = {"importantWordSlider_" + key}
                        value = {important.freq}
                        handleSlider = {(name, value) => {
                            this.props.handleBlockSlider('importantWords', name, value)
                        }}
                    />
                    <Fab
                        size="small"
                        color="error"
                        onClick={() => {
                            this.props.handleBlockRemoveItem("importantWords", key)
                        }}
                        style={{ alignSelf: 'center' }}>
                        <DeleteForeverRoundedIcon />
                    </Fab>
                </Stack>
            )
        })
    }
}

export default ImportantWordBlock;