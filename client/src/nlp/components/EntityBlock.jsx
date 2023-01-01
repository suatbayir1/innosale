import React, { Component } from "react"
import { Fab, Stack } from "@mui/material";
import Selector from "../../components/Selector";
import InputSlider from "../../components/Slider";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

class EntityBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entities: props.entities
        }
    }

    handleSelectChance = (event) => {
        const name = event.target.name
        const split_name = name.split("_")
        const state_number = Number(split_name[split_name.length - 1])

        const { entities } = this.state
        entities[state_number].name = String(event.target.value)

        this.setState({
            entities: entities
        });
        this.props.handleBlockChanges("entities", entities)
    }

    handleSliderChange = (event) => {
        const name = event.target.name
        const split_name = name.split("_")
        const state_number = Number(split_name[split_name.length - 1])
        
        const { entities } = this.state
        entities[state_number].freq = Number(event.target.value)

        this.setState({
            entities: entities
        });
        this.props.handleBlockChanges("entities", entities)
    }

    render(){
        const items = [
            { "key": 1, "value": "IYILESTIRME", "text": "İyileştirme" },
            { "key": 2, "value": "INDIRIM", "text": "İndirim" },
            { "key": 3, "value": "SACKALIN", "text": "Sac Kalınlığı" },
            { "key": 4, "value": "BANTGORUNUM", "text": "Bant Görünümü" }
        ]
        return this.state.entities.map((ent_, key) => {
            return(
                <Stack direction='row' spacing={7} key={key}>
                    <Selector
                        name = {"entityField_" + key}
                        title = "Entities"
                        handleSelectChance={(e) => this.handleSelectChance(e, null)}
                        items = {items}
                    />
                    <InputSlider
                        title="Entity Frequency"
                        name={"entitySlider_" + key}
                        value={ent_.freq}
                        handleSliderChange={this.handleSliderChange}
                        handleInputChange={this.handleSliderChange}
                    />
                    <Fab
                        size="small"
                        color="error"
                        onClick={() => {
                            this.props.handleBlockRemoveItem("entities", key)
                        }}
                        style={{alignSelf: 'center'}}>
                        <DeleteForeverRoundedIcon/>
                    </Fab>
                </Stack>
            )
        })
    }
}

export default EntityBlock;