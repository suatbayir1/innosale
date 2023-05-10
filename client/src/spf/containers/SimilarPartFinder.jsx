// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";

// Components
import { Header } from '../../components';
import Selector from '../components/Selector'
import ThreeScene from '../../nlp/components/ThreeScene';
import ThreeScene_ from '../components/ThreeScene_'

// Actions
import { getParts, get_teklif_ids, getFileSpecs, get_similar_parts } from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";
import { CircularProgress, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CalculateIcon from '@mui/icons-material/Calculate';

class SimilarPartFinder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            part_container: document.getElementById("part_container"),
            similar_part_container: document.getElementById("similar_part_container"),
            
            load_button_disabled: false,
            load_button_loading: false,
            
            calculate_button_disabled: true,
            calculate_button_loading: false,

            selected_similar_part: [],
            selector_part_disabled: false,
            selector_part: "/root/innosale/server/static/igs/001_2020_Teklifid_6.igs",
            selector_geometry_option: "",
            checkbox_use_filter: false,
            checkbox_feature_base: false,
            checkbox_geometry_base: false,

            part_sac_kalinligi: "",
            part_net_x: "",
            part_net_y: "",
            part_kontur: "",
            part_yuzey_alanı: "",
            filter_sac_kalinligi: "",
            filter_net_x: "",
            filter_net_y: "",
            filter_kontur: "",
            filter_yuzey_alanı: "",

            rows: [
                //{id: 1, price: 1000, similarity_rate: 95, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 2, price: 1500, similarity_rate: 80, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 3, price: 1250, similarity_rate: 85, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 4, price: 2250, similarity_rate: 60, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 9, price: 1750, similarity_rate: 40, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},        
            ]
        }
        this.part_filter_values = {
            "part_sac_kalinligi": "Sac Kalınlığı",
            "part_net_x": "Net X",
            "part_net_y": "Net Y",
            "part_kontur": "Kontur",
            "part_yuzey_alanı": "Yüzey Alanı",
            "filter_sac_kalinligi": "Sac Kalınlığı",
            "filter_net_x": "Net X",
            "filter_net_y": "Net Y",
            "filter_kontur": "Kontur",
            "filter_yuzey_alanı": "Yüzey Alanı"
        }
        this.geometry_options = ["RMSE", "NORM", "BOTH"]
    }

    async componentDidMount() {
        const { get_teklif_ids, getFileSpecs } = await this.props

        await get_teklif_ids()
        await this.wait_for_seconds(1)
        await this.setState({
            part_container: document.getElementById("part_container"),
            similar_part_container: document.getElementById("similar_part_container")
        })
        this.similar_part_scene = new ThreeScene_({
            "partModelPreviewScene": this.state.similar_part_container,
            "width": 350,
            "height": 350
        })

        this.part_scene = new ThreeScene_({
            "partModelPreviewScene": this.state.part_container,
            "width": 350,
            "height": 350
        })
    }

    calculate_similar_parts = async () => {
        const { get_similar_parts, getFileSpecs } = await this.props
        await get_similar_parts({ 'path': this.state.selector_part })
        this.setState({ rows: [], selector_part_disabled: true, load_button_disabled: true, load_button_loading: false, calculate_button_disabled: true, calculate_button_loading: true })

        while (true) {
            if (this.props.similar_parts.path === this.state.selector_part) {
                for (var i = 0; i < this.props.similar_parts.parts.length; i++) {
                    const part = this.props.similar_parts.parts[i]
                    await getFileSpecs({ 'path': part.path })

                    while (true) {
                        if (this.props.fileSpecs.name === part.path) {
                            await this.setState({ rows: [...this.state.rows, part] })
                            await this.similar_part_scene.setDisplayPart(this.props.fileSpecs, false, part.id)
                            await this.similar_part_scene.scene.children.forEach(child => child.visible = `MeshGroup_${this.state.selected_similar_part}` === child.uuid ? true : false)
                            break
                        }
                        else {
                            await this.wait_for_seconds(0.5)
                        }
                    }
                }
                break
            }
            else {
                await this.wait_for_seconds(0.5)
            }
        }
        this.setState({ selector_part_disabled: false, load_button_disabled: false, load_button_loading: false, calculate_button_disabled: false, calculate_button_loading: false })
    }

    load_selected_part = async () => {
        const { getFileSpecs } = await this.props
        console.log(this.state)
        this.setState({ selector_part_disabled: true, load_button_disabled: true, load_button_loading: true, calculate_button_disabled: true, calculate_button_loading: false })
        await getFileSpecs({ 'path': this.state.selector_part })

        while (true) {
            if (this.props.fileSpecs.name === this.state.selector_part) {
                this.part_scene.setDisplayPart(this.props.fileSpecs)
                break
            }
            else {
                await this.wait_for_seconds(0.1)
            }
        }
        this.setState({ selector_part_disabled: false, load_button_disabled: false, load_button_loading: false, calculate_button_disabled: false })
    }

    change_similar_scene = (selected_similar_part) => {
        this.state.rows.forEach(row => {
            if (row.id === selected_similar_part) {
                this.similar_part_scene.scene.children.forEach(child => {
                    if (child.uuid === `MeshGroup_${row.id}`) child.visible = true
                    else child.visible = false
                })
            }
        })
    }

    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    isButtonDisabled = () => {
        const {
            selector_part,
            selector_geometry_option,
            checkbox_use_filter,
            checkbox_geometry_base,
            filter_sac_kalinligi,
            filter_net_x,
            filter_net_y,
            filter_kontur,
            filter_yuzey_alanı
        } = this.state;

        if (selector_part === "") {
            console.log("1");
            return true
        }
        if (checkbox_use_filter) {
            console.log("2")
            if (filter_sac_kalinligi === "") return true
            if (filter_net_x === "") return true
            if (filter_net_y === "") return true
            if (filter_kontur === "") return true
            if (filter_yuzey_alanı === "") return true
        }
        if (checkbox_geometry_base && selector_geometry_option === "") {
            console.log("3")
            return true
        }
        console.log("4")
        return false
    }

    handleChange = (event) => {
        console.log(event)

        if (event.target.name.startsWith("checkbox")){
            if (event.target.name === "checkbox_geometry_base") {
                this.setState({ 
                    [event.target.name]: event.target.checked,
                    selector_geometry_option: ""
                }, () => this.setState({
                    calculate_button_disabled: this.isButtonDisabled()
                }))
            }
            else if (event.target.name === "checkbox_use_filter") {
                this.setState({
                    [event.target.name]: event.target.checked,
                    filter_sac_kalinligi: "",
                    filter_net_x: "",
                    filter_net_y: "",
                    filter_kontur: "",
                    filter_yuzey_alanı: ""
                }, () => this.setState({
                    calculate_button_disabled: this.isButtonDisabled()
                }))
            }
            else if (event.target.name === "checkbox_feature_base"){
                this.setState({ 
                    [event.target.name]: event.target.checked
                }, () => this.setState({
                    calculate_button_disabled: this.isButtonDisabled()
                }))
            }
        }
        else if (event.target.name.startsWith("selector"))
            this.setState({ [event.target.name]: event.target.value }, () => this.setState({
                calculate_button_disabled: this.isButtonDisabled()
            }))
        
        else {
            this.setState({ [event.target.name]: event.target.value }, () => this.setState({
                calculate_button_disabled: this.isButtonDisabled()
            }))
        }

    };

    render() {
        const columns = [
            { width: 50, type: 'number', field: 'id', headerName: 'ID' },
            { width: 130, type: 'number', field: 'price', headerName: 'Fiyat' },
            { width: 130, type: 'number', field: 'similarity_rate', headerName: 'Benzerlik Oranı' },
            { width: 130, type: 'number', field: 'sac_kalinligi', headerName: 'Sac Kalınlığı' },
            { width: 80, type: 'number', field: 'rmse', headerName: 'RMSE' },
            { width: 80, type: 'number', field: 'net_x', headerName: 'NetX' },
            { width: 80, type: 'number', field: 'net_y', headerName: 'NetY' },
            { width: 80, type: 'number', field: 'kontur', headerName: 'Kontur' },
            { width: 130, type: 'number', field: 'yuzey_alani', headerName: 'Yüzey Alanı' }
        ];
        
        const { selector_part_disabled, load_button_loading, calculate_button_loading, load_button_disabled, calculate_button_disabled, selector_part, selector_geometry_option, checkbox_use_filter, checkbox_feature_base, checkbox_geometry_base } = this.state;
        
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="3D Similarity" title="Similar Part Finder" />
                <Stack>

                    <Stack flexDirection={"row"} marginBottom={5}>
                        <Stack width={1000} height={350} marginRight={5} style={{ "backgroundColor": "#ededed", "borderRadius": 5 }}>
                            <Stack flexDirection={"row"}>
                                <Stack width={"60%"} margin={2}>
                                    <Selector
                                        id = {"selector_part"}
                                        header = {"Select Parts"}
                                        disabled = {selector_part_disabled}
                                        value = {selector_part}
                                        setValue = {this.handleChange}
                                        items = {Object.keys(this.props.teklif_ids).map(
                                            key => {
                                                return {
                                                    "key": key,
                                                    "value": this.props.teklif_ids[key],
                                                    "text": key
                                                }
                                            }
                                        )}
                                    />
                                </Stack>
                                <Stack marginRight={2}>
                                    <Button
                                        disabled={load_button_disabled}
                                        startIcon={load_button_loading ? <CircularProgress size={20} thickness={5} color={"inherit"} /> : <ViewInArIcon />}
                                        variant="contained"
                                        size="medium"
                                        style={{ "height": 56, "marginTop": 16 }}
                                        onClick={this.load_selected_part}
                                    >
                                        {"Load part"}
                                    </Button>
                                </Stack>
                                
                                <Stack marginRight={2}>
                                    <Button
                                        disabled={calculate_button_disabled}
                                        startIcon={calculate_button_loading ? <CircularProgress size={20} thickness={5} color={"inherit"} /> : <CalculateIcon />}
                                        variant="contained"
                                        size="medium"
                                        style={{ "height": 56, "marginTop": 16 }}
                                        onClick={this.calculate_similar_parts}
                                    >
                                        {"Calculate for similar parts"}
                                    </Button>
                                </Stack>
                                
                            </Stack>
                            <Stack>
                                <Stack flexDirection={"row"} spacing={1}>
                                    <Stack margin={2} marginTop={2}>
                                        <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel control={<Checkbox name="checkbox_use_filter" checked={checkbox_use_filter} onChange={this.handleChange} />} label="Use Filters" />
                                            <FormControlLabel control={<Checkbox name="checkbox_feature_base" checked={checkbox_feature_base} onChange={this.handleChange} />} label="Feature Base" />
                                            <FormControlLabel control={<Checkbox name="checkbox_geometry_base" checked={checkbox_geometry_base} onChange={this.handleChange} />} label="Geometry Base" />
                                        </FormGroup>
                                    </Stack>
                                    <Stack width={"26%"} margin={2} marginLeft={0}>
                                        <Selector
                                            id = {"selector_geometry_option"}
                                            disabled = {!checkbox_geometry_base}
                                            header = {"Geometry Option"}
                                            value = {selector_geometry_option}
                                            setValue = {this.handleChange}
                                            items = {this.geometry_options.map(
                                                key => {
                                                    return { "key": key, "value": key, "text": key }
                                                }
                                            )}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack marginLeft={2} marginTop={1} width={"97%"} style={{ "backgroundColor": "#d4d4d4", "borderRadius": 5 }}>   
                                    <Box
                                        component="form"
                                        sx={{ '& .MuiTextField-root': { m: 1, width: '19ch' } }}
                                        noValidate
                                        autoComplete="off"
                                        margin={1}
                                    >
                                        <div>
                                            {
                                                Object.keys(this.part_filter_values).map(key => {
                                                    return (
                                                        <TextField
                                                            id={key}
                                                            key={key}
                                                            name={key}
                                                            label={this.part_filter_values[key]}
                                                            type="number"
                                                            value={this.state[key]}
                                                            onChange={this.handleChange}
                                                            disabled={key.startsWith("part") || !checkbox_use_filter}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                        
                        <Stack id="part_container" width={350} height={350} marginRight={5} style={{ "borderRadius": 5 }}>
                            {/*<ThreeScene
                                partModelPreviewScene = {this.state.part_container}
                                width = {350} height = {350}
                            />*/}
                        </Stack>
                    </Stack>
                    
                    <Stack flexDirection={"row"} marginBottom={5}>
                        <Stack width={1000} height={350} marginRight={5}>
                            <DataGrid
                                rows={this.state.rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                selectionModel={this.state.selected_similar_part}
                                onSelectionModelChange={(selection) => {
                                    console.log("selection", selection)
                                    if (selection.length > 0) {
                                        this.setState({ selected_similar_part: selection[0] });
                                        this.change_similar_scene(selection[0])
                                    }
                                }}
                            />
                        </Stack>
                        
                        <Stack id="similar_part_container" width={350} height={350} marginRight={5} style={{ "borderRadius": 5 }}>
                            {/*<ThreeScene
                                partModelPreviewScene = {this.state.similar_part_container}
                                width = {350} height = {350}
                            />*/}
                        </Stack>
                    </Stack>
                    
                </Stack>
                
            </div>
        );
    }
};

const mstp = (state) => {
    return {
        partsGridLoading: state.part.partsGridLoading,
        teklif_ids: state.spf.teklif_ids,
        similar_parts: state.spf.similar_parts,
        fileSpecs: state.icp.fileSpecs,
    }
}

const mdtp = (dispatch) => {
    return {
        getParts: () => dispatch(getParts()),
        get_teklif_ids: () => dispatch(get_teklif_ids()),
        getFileSpecs: (payload) => dispatch(getFileSpecs(payload)),
        get_similar_parts: (payload) => dispatch(get_similar_parts(payload)),
    }
}

export default connect(mstp, mdtp)(SimilarPartFinder);
