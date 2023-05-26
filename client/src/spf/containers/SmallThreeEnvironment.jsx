// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";

// Components
import { Header } from '../../components';
import Selector from '../components/Selector'
import ThreeScene from '../../nlp/components/ThreeScene';
import ThreeScene_ from '../components/ThreeScene_'

// Actions
import { getParts, get_teklif_ids, getFileSpecs, get_similar_parts, get_selected_part } from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";
import { CircularProgress, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CalculateIcon from '@mui/icons-material/Calculate';
import LinearProgress from '@mui/material/LinearProgress';
import AllSimilarPartsDialog from "../components/AllSimilarPartsDialog";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SmallEnvironmentService } from '../../shared/services';


class SmallThreeEnvironment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            part_container: document.getElementById("part_container")
        }
    }

    async componentDidMount() {
        await this.props.getFileSpecs({
            'path': "/root/service_3d/server/static/igs/001_2020_Teklifid_10.igs"
        })
        await this.wait_for_seconds(1)
        await this.setState({
            part_container: document.getElementById("part_container")
        }, () => {
            this.small_scene = new SmallEnvironmentService({
                "partModelPreviewScene": this.state.part_container,
                "width": 1280,
                "height": 720,
                "vm": this
            })
            this.small_scene.addPlyFile('001_2020_Teklifid_10', true)
            //this.small_scene.addFileWithSpecs(this.props.fileSpecs)
            this.small_scene.animate()
            console.log(this.small_scene)
        })
       
    }

    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    render() {
        return (
            <Stack id="part_container" width={1280} height={720} marginRight={5} style={{ "borderRadius": 5 }}>

            </Stack>
        );
    }
};

const mstp = (state) => {
    return {
        fileSpecs: state.icp.fileSpecs,
    }
}

const mdtp = (dispatch) => {
    return {
        getFileSpecs: (payload) => dispatch(getFileSpecs(payload)),
    }
}

export default connect(mstp, mdtp)(SmallThreeEnvironment);
