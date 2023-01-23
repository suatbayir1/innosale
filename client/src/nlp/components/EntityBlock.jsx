import React, { Component } from "react"
import { Fab, Stack } from "@mui/material";
import Selector from "../../components/Selector";
import InputSlider from "../../components/Slider";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

class EntityBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { entities, entitiesList } = this.props

        const findSelectedEntities = () => {
            const selectedEntities = [];

            for (let i = 0; i < entities.length; i++) {
                if (!selectedEntities.includes(entities[i].name)) {
                    selectedEntities.push(entities[i].name)
                }
            }

            return selectedEntities;
        }

        
        const getEntitiesList = (key) => {
            const returnList = [...entitiesList]
            
            for (let i = 0; i < key; i++) {
                var element = entities[i];
                
                for (let j = 0; j < returnList.length; j++) {
                    if (returnList[j].value == (element ? element.name : "null"))
                    {
                        returnList.splice(j, 1)
                        console.log(element ? element.name : "null")
                        break
                    }
                }
            }
            
            if (returnList.length == 0) this.props.handleBlockRemoveItem("entities", key)
            return returnList
        }

        return entities.map((ent_, key) => {

            return (
                <Stack direction='row' spacing={7} key={key}>
                    <Selector
                        name = {"entityField_" + key}
                        title = "Entities"
                        value = {ent_.name}
                        items = {getEntitiesList(key)}
                        handleSelect = {this.props.handleBlockSelect}
                    />
                    <InputSlider
                        title = "Entity Frequency"
                        name = {"entitySlider_" + key}
                        value = {ent_.freq}
                        handleSlider = {(name, value) => {
                            this.props.handleBlockSlider('entities', name, value)
                        }}
                    />
                    <Fab
                        size="small"
                        color="error"
                        onClick={() => {
                            this.props.handleBlockRemoveItem("entities", key)
                        }}
                        style={{ alignSelf: 'center' }}>
                        <DeleteForeverRoundedIcon />
                    </Fab>
                </Stack>
            )
        })
    }
}

export default EntityBlock;