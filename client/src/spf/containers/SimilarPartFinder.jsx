// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import withRouter from "../../shared/hoc/withRouter"

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

class SimilarPartFinder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            part_container: document.getElementById("part_container"),
            similar_part_container: document.getElementById("similar_part_container"),
            main_part_container: document.getElementById("main_part_container"),
            similar_part_1_container: document.getElementById("similar_part_1_container"),
            similar_part_2_container: document.getElementById("similar_part_2_container"),
            similar_part_3_container: document.getElementById("similar_part_3_container"),
            similar_part_4_container: document.getElementById("similar_part_4_container"),
            similar_part_5_container: document.getElementById("similar_part_5_container"),

            all_similar_part_dialog_open: false,

            checkbox_disabled: false,

            overlay_button_disabled: true,
            part_loaded: false,

            load_button_disabled: false,
            load_button_loading: false,
            
            calculate_button_disabled: true,
            calculate_button_loading: false,

            selected_similar_part: [],
            selector_part_disabled: false,
            selector_part: "",
            selector_geometry_option: "",
            checkbox_use_filter: false,
            checkbox_feature_base: false,
            checkbox_geometry_base: false,

            part_sac_kalinligi: "",
            part_net_x: "",
            part_net_y: "",
            part_kontur: "",
            part_yuzey_alani: "",
            filter_sac_kalinligi: "",
            filter_net_x: "",
            filter_net_y: "",
            filter_kontur: "",
            filter_yuzey_alani: "",
            similarPartPath: [],
            rows: [
                //{id: 1, price: 1000, similarity_rate: <LinearProgress variant="determinate" value={10} />, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 2, price: 1500, similarity_rate: <LinearProgress variant="determinate" value={80} />, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 3, price: 1250, similarity_rate: <LinearProgress variant="determinate" value={85} />, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 4, price: 2250, similarity_rate: <LinearProgress variant="determinate" value={60} />, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},
                //{id: 9, price: 1750, similarity_rate: <LinearProgress variant="determinate" value={40} />, sac_kalinligi: 1, rmse: 1, net_x: 1, net_y: 1, kontur: 1, yuzey_alani: 1},        
            ]
        }
        this.part_filter_values = {
            "part_sac_kalinligi": "Sac Kalınlığı",
            "part_net_x": "Net X",
            "part_net_y": "Net Y",
            "part_kontur": "Kontur",
            "part_yuzey_alani": "Yüzey Alanı",
            "filter_sac_kalinligi": "Sac Kalınlığı",
            "filter_net_x": "Net X",
            "filter_net_y": "Net Y",
            "filter_kontur": "Kontur",
            "filter_yuzey_alani": "Yüzey Alanı"
        }
        this.geometry_options = ["RMSE", "NORM", "BOTH"]
    }

    async componentDidMount() {
        const { get_teklif_ids } = await this.props

        await get_teklif_ids()
        await this.wait_for_seconds(1)
        await this.setState({
            part_container: document.getElementById("part_container"),
            similar_part_container: document.getElementById("similar_part_container"),
            main_part_container: document.getElementById("main_part_container"),
            similar_part_1_container: document.getElementById("similar_part_1_container"),
            similar_part_2_container: document.getElementById("similar_part_2_container"),
            similar_part_3_container: document.getElementById("similar_part_3_container"),
            similar_part_4_container: document.getElementById("similar_part_4_container"),
            similar_part_5_container: document.getElementById("similar_part_5_container"),
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
        this.similar_part_scene.animate()
        this.part_scene.animate()
        while (true) {
            if (this.props.teklif_ids) {
                Object.keys(this.props.teklif_ids).forEach(key => {
                    if (key === this.props.params.teklif_id) {
                        this.setState({
                            selector_part: this.props.teklif_ids[key]
                        }, this.load_selected_part)
                        return
                    }
                })
                break
            }
            else {
                await this.wait_for_seconds(0.5)
            }
        }
    }

    calculate_similar_parts = async () => {
        const { get_similar_parts } = await this.props
        let part_id = ""
        ThreeScene_.removeAllObjectFromSceneList(this.similar_part_scene.scene, this.similar_part_scene.camera, this.similar_part_scene.renderer)
        Object.keys(this.props.teklif_ids).map((key) => {
            if (this.props.teklif_ids[key] === this.state.selector_part) {
                part_id = key
                return
            }
        })
        await get_similar_parts({ 
            'selected_file': part_id,
            'selection': this.state.checkbox_geometry_base ? this.state.selector_geometry_option : "",
            'features': this.state.checkbox_feature_base,
            'filters': this.state.checkbox_use_filter ? {
                'sac_kalinligi': this.state.filter_sac_kalinligi,
                'net_x': this.state.filter_net_x,
                'net_y': this.state.filter_net_y,
                'kontur': this.state.filter_kontur,
                'yuzey_alani': this.state.filter_yuzey_alani
            } : {},
            'n': 5,
            'path': this.state.selector_part
        })
        const startState = { rows: [], similarPartPath: [], overlay_button_disabled: true, selector_part_disabled: true, checkbox_disabled: true, load_button_disabled: true, load_button_loading: false, calculate_button_disabled: true, calculate_button_loading: true }
        const endState = { selector_part_disabled: false, checkbox_disabled: false, overlay_button_disabled:false, load_button_disabled: false, load_button_loading: false, calculate_button_disabled: false, calculate_button_loading: false }
        await this.setState(startState)
        while (true) {
            console.log(this.props.similar_parts.path)
            console.log(this.state.selector_part)
            
            if (this.state.selector_part.includes(this.props.similar_parts.path)) {
                for (var i = 0; i < this.props.similar_parts.parts.length; i++) {
                    try {
                        const part = this.props.similar_parts.parts[i]
                        console.log(part.path)
                        let vm = this
                        await this.similar_part_scene.addPlyFile(part.path.split('.')[0].split('/').pop(), i==0 ? true : false)
                            .then(() => vm.setState({ rows: [...vm.state.rows, part], similarPartPath: [...vm.state.similarPartPath, part.path.split('.')[0].split('/').pop()]}))
                            .catch()
                        //await this.similar_part_scene.scene.children.forEach(child => child.visible = `MeshGroup_${this.state.selected_similar_part}` === child.uuid ? true : false)
                    } catch (error) {
                        console.log(error)
                    }
                }
                break
            }
            else {
                await this.wait_for_seconds(0.5)
            }
        }
        await this.setState(endState)
        
    }

    load_selected_part = async () => {
        const { get_selected_part } = this.props
        let part_id = ""
        Object.keys(this.props.teklif_ids).map((key) => {
            if (this.props.teklif_ids[key] === this.state.selector_part) {
                part_id = key
                return
            }
        })

        await get_selected_part({ 'selected_file': part_id })
        const startState = { rows: [], selector_part_disabled: true, part_loaded: false, overlay_button_disabled: true, load_button_disabled: true, load_button_loading: true, calculate_button_disabled: true, calculate_button_loading: false }
        const endState = { selector_part_disabled: false, load_button_disabled: false, part_loaded: true, load_button_loading: false, calculate_button_disabled: false,
            part_sac_kalinligi: this.props.selected_part ? this.props.selected_part.sac_kalinligi ? this.props.selected_part.sac_kalinligi : "" : "",
            part_net_x: this.props.selected_part ? this.props.selected_part.net_x ? this.props.selected_part.net_x : "" : "",
            part_net_y: this.props.selected_part ? this.props.selected_part.net_y ? this.props.selected_part.net_y : "" : "",
            part_kontur: this.props.selected_part ? this.props.selected_part.kontur ? this.props.selected_part.kontur : "" : "",
            part_yuzey_alani: this.props.selected_part ? this.props.selected_part.yuzey_alani ? this.props.selected_part.yuzey_alani : "" : ""
        }

        ThreeScene_.removeAllObjectFromSceneList(this.part_scene.scene, this.part_scene.camera, this.part_scene.renderer)
        //ThreeScene_.removeAllObjectFromSceneList(this.main_part_scene.scene, this.main_part_scene.camera, this.main_part_scene.renderer)
        ThreeScene_.removeAllObjectFromSceneList(this.similar_part_scene.scene, this.similar_part_scene.camera, this.similar_part_scene.renderer)
        
        this.setState(startState)
        
        while (true) {
            if (this.props.selected_part.id.toString() === part_id.toString()) {
                await this.part_scene.addPlyFile(this.state.selector_part.split('.')[0]).then(() => this.setState(endState))
                //await this.main_part_scene.addPlyFile(this.state.selector_part.split('.')[0]).then(() => this.setState(endState))
                console.log(this.props.selected_part)
                break
            }
            else {
                await this.wait_for_seconds(0.5)
            }
        }
        
    }

    change_similar_scene = (selected_similar_part) => {
        console.log(this.similar_part_scene.scene)
        this.state.rows.forEach(row => {
            if (row.id.toString() === selected_similar_part.toString()) {
                this.similar_part_scene.scene.children.forEach(child => {
                    const exludeList = ["DirectionalLight", "HemisphereLight", "SpotLight"]

                    if (!exludeList.includes(child.uuid.toString())) {
                        if (child.uuid.toString())
                        if (child.uuid.toString() === row.id.toString())
                            child.visible = true
                        else
                            child.visible = false
                    }

                    
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
            filter_yuzey_alani
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
            if (filter_yuzey_alani === "") return true
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
                    filter_yuzey_alani: ""
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
        else if (event.target.name.startsWith("selector")) {
            this.setState({ [event.target.name]: event.target.value },
                () => this.setState({ calculate_button_disabled: this.isButtonDisabled()},
                    () => { if (event.target.name !== "selector_geometry_option") this.load_selected_part() }
                )
            )
        }
        
        else {
            this.setState({ [event.target.name]: event.target.value }, () => this.setState({
                calculate_button_disabled: this.isButtonDisabled()
            }))
        }

    };

    openOverlay = () => {
        this.setState({ all_similar_part_dialog_open: true }, async () => {
            await this.wait_for_seconds(1)
            await this.setState ({
                main_part_container: document.getElementById("main_part_container"),
                similar_part_1_container: document.getElementById("similar_part_1_container"),
                similar_part_2_container: document.getElementById("similar_part_2_container"),
                similar_part_3_container: document.getElementById("similar_part_3_container"),
                similar_part_4_container: document.getElementById("similar_part_4_container"),
                similar_part_5_container: document.getElementById("similar_part_5_container") 
            })
            this.main_part_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.main_part_container,
                "width": 350,
                "height": 350
            })
            this.similar_part_1_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.similar_part_1_container,
                "width": 350,
                "height": 350
            })
            this.similar_part_2_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.similar_part_2_container,
                "width": 350,
                "height": 350
            })
            this.similar_part_3_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.similar_part_3_container,
                "width": 350,
                "height": 350
            })
            this.similar_part_4_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.similar_part_4_container,
                "width": 350,
                "height": 350
            })
            this.similar_part_5_scene = await new ThreeScene_({
                "partModelPreviewScene": this.state.similar_part_5_container,
                "width": 350,
                "height": 350
            })
            try {
                await this.main_part_scene.addPlyFile(this.state.selector_part.split('.')[0])
                await this.similar_part_1_scene.addPlyFile(this.state.similarPartPath[0])
                await this.similar_part_2_scene.addPlyFile(this.state.similarPartPath[1])
                await this.similar_part_3_scene.addPlyFile(this.state.similarPartPath[2])
                await this.similar_part_4_scene.addPlyFile(this.state.similarPartPath[3])
                await this.similar_part_5_scene.addPlyFile(this.state.similarPartPath[4])
            }
            catch (e) {console.log(e)}
        })
    }

    render() {
        const columns = [
            { headerAlign: 'center', align: 'center', width: 100, type: 'number', field: 'id', headerName: 'ID', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 130, type: 'number', field: 'price', headerName: 'Fiyat', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 130, type: 'number', field: 'progress', headerName: 'Benzerlik Oranı', renderCell: params => {return <Box sx={{ width: '100%' }}> <LinearProgress variant="determinate" value={params.value} />%{params.value}</Box>} },
            { headerAlign: 'center', align: 'center', width: 130, type: 'number', field: 'sac_kalinligi', headerName: 'Sac Kalınlığı', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 80, type: 'number', field: 'rmse', headerName: 'RMSE', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 80, type: 'number', field: 'net_x', headerName: 'NetX', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 80, type: 'number', field: 'net_y', headerName: 'NetY', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 80, type: 'number', field: 'kontur', headerName: 'Kontur', valueFormatter: params => {return params.value} },
            { headerAlign: 'center', align: 'center', width: 130, type: 'number', field: 'yuzey_alani', headerName: 'Yüzey Alanı', valueFormatter: params => {return params.value} }
        ];
        
        const { selector_part_disabled, load_button_loading, calculate_button_loading, load_button_disabled, calculate_button_disabled, selector_part, checkbox_disabled, selector_geometry_option, checkbox_use_filter, checkbox_feature_base, checkbox_geometry_base } = this.state;
        
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                {/*
                    <AllSimilarPartsDialog
                        vm = {this}
                        open = {this.state.all_similar_part_dialog_open}
                        header = {"All Similart Parts"}
                        containers = {this.similar_overlay_containers}
                    />
                */}
                <div>
                    <Dialog open={this.state.all_similar_part_dialog_open} onClose={() => this.setState({ all_similar_part_dialog_open: false }) } maxWidth='lg'>
                        <DialogTitle>
                            {"All Similart Parts"}
                        </DialogTitle>
                        <DialogContent>
                            <Stack spacing={1}>
                                <Stack spacing={1} direction={"row"}>
                                    <Stack id="main_part_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Current Part: " + (this.props.similar_parts ? this.props.similar_parts.path ? this.props.similar_parts.path : "" : "")}
                                    </Stack>
                                    <Stack id="similar_part_1_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Part No: " + (this.props.similar_parts ? this.props.similar_parts.parts ? this.props.similar_parts.parts[0] ? this.props.similar_parts.parts[0].id : "" : "" : "")}
                                    </Stack>
                                    <Stack id="similar_part_2_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Part No: " + (this.props.similar_parts ? this.props.similar_parts.parts ? this.props.similar_parts.parts[1] ? this.props.similar_parts.parts[1].id : "" : "" : "")}
                                    </Stack>
                                </Stack>
                                <Stack spacing={1} direction={"row"}>{"\n"}</Stack>
                                <Stack spacing={1} direction={"row"}>{"\n"}</Stack>
                                <Stack spacing={1} direction={"row"}>{"\n"}</Stack>
                                <Stack spacing={1} direction={"row"}>
                                    <Stack id="similar_part_3_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Part No: " + (this.props.similar_parts ? this.props.similar_parts.parts ? this.props.similar_parts.parts[2] ? this.props.similar_parts.parts[2].id : "" : "" : "")}
                                    </Stack>
                                    <Stack id="similar_part_4_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Part No: " + (this.props.similar_parts ? this.props.similar_parts.parts ? this.props.similar_parts.parts[3] ? this.props.similar_parts.parts[3].id : "" : "" : "")}
                                    </Stack>
                                    <Stack id="similar_part_5_container" width={350} height={350} style={{ "borderRadius": 5 }}>
                                        {"Part No: " + (this.props.similar_parts ? this.props.similar_parts.parts ? this.props.similar_parts.parts[4] ? this.props.similar_parts.parts[4].id : "" : "" : "")}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({ all_similar_part_dialog_open: false }) }>Cancel</Button>
                            <Button
                                color="error"
                                onClick={() => this.setState({ all_similar_part_dialog_open: false }) }
                            >OK</Button>   
                        </DialogActions>
                    </Dialog>
                </div>
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
                                        items = {this.props.teklif_ids ? Object.keys(this.props.teklif_ids).map(
                                            key => {
                                                return {
                                                    "key": key,
                                                    "value": this.props.teklif_ids[key],
                                                    "text": key
                                                }
                                            }
                                        ) : []}
                                    />
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
                                <Stack marginRight={2}>
                                    <Button
                                            disabled={this.state.overlay_button_disabled}
                                            startIcon={<ViewInArIcon />}
                                            variant="contained"
                                            size="medium"
                                            style={{ "height": 56, "marginTop": 16 }}
                                            onClick={this.openOverlay}
                                        >
                                            {"See all similar parts"}
                                    </Button>
                                </Stack>
                                
                            </Stack>
                            <Stack>
                                <Stack flexDirection={"row"} spacing={1}>
                                    <Stack margin={2} marginTop={2}>
                                        <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel disabled={checkbox_disabled} control={<Checkbox name="checkbox_use_filter" checked={checkbox_use_filter} onChange={this.handleChange} />} label="Use Filters" />
                                            <FormControlLabel disabled={checkbox_disabled} control={<Checkbox name="checkbox_feature_base" checked={checkbox_feature_base} onChange={this.handleChange} />} label="Feature Base" />
                                            <FormControlLabel disabled={checkbox_disabled} control={<Checkbox name="checkbox_geometry_base" checked={checkbox_geometry_base} onChange={this.handleChange} />} label="Geometry Base" />
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
                                                            value={this.state.part_loaded ? key.startsWith("filter") ? this.state[key] : this.props.selected_part[key.slice(5)] : ""}
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
        selected_part: state.spf.selected_part,
        fileSpecs: state.icp.fileSpecs,
    }
}

const mdtp = (dispatch) => {
    return {
        getParts: () => dispatch(getParts()),
        get_teklif_ids: () => dispatch(get_teklif_ids()),
        getFileSpecs: (payload) => dispatch(getFileSpecs(payload)),
        get_similar_parts: (payload) => dispatch(get_similar_parts(payload)),
        get_selected_part: (payload) => dispatch(get_selected_part(payload)),
        
    }
}

export default withRouter(connect(mstp, mdtp)(SimilarPartFinder));
