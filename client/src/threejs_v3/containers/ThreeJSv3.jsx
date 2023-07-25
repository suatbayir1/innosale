import * as THREE from "three"
import ReactDOM from 'react-dom';
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';


import { connect } from "react-redux"
import React, { Component, useRef } from "react"
import withRouter from "../../shared/hoc/withRouter"
import { get_files_list, save_part_preset, load_part_preset } from "../../store/index";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material"
import TransferList from "../components/TransferList"
import ThreeJSService from "../services/ThreeJSService";

class ThreeJSv3 extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogHeader: "Dialog",
        }
        this.service = new ThreeJSService({
            camera: {
                fov: 75,
                aspect: window.innerWidth / window.innerHeight,
                near: 0.1,
                far: 2000
            },
            renderer: {
                pixelRatio: window.devicePixelRatio || 1,
                width: window.innerWidth,
                height: window.innerHeight
            },
        })
        this.props.get_files_list()

        // Backend
        this.operation_colors = {
            "Undefined": {'r': 0, 'g': 0, 'b': 0},
            "10 (Açınım) - Açınım Kesme": {'r': 0, 'g': 0, 'b': 1},                             // Mavi
            "10 (Açınım) - Ön Açınım Kesme": {'r': 0, 'g': 1, 'b': 0},                          // Yeşil
            "20 (Çekme) - Çekme": {'r': 0, 'g': 1, 'b': 1},                                     // Turkuaz
            "30 (Bükme) - Bükme": {'r': 1, 'g': 0, 'b': 0},                                     // Kırmızı
            "30 (Bükme) - Form Verme": {'r': 1, 'g': 0, 'b': 1},                                // Eflatun
            "40 (Kesme) - Çevre Kesme": {'r': 1, 'g': 1, 'b': 0},                               // Sarı
            "40 (Kesme) - Delme": {'r': 1, 'g': 0.5, 'b': 0},                                   // Turuncu
            "30 (Bükme) - Kenarlama": {'r': 0, 'g': 0.6, 'b': 1},                               // Açık Mavi
            "30 (Bükme) - Kalibre": {'r': 0.2, 'g': 0.2, 'b': 0.6},                             // Koyu Mor
            "50 (Prog) - Progresif": {'r': 0.07, 'g': 0.43, 'b': 0},                            // Koyu Yeşil
            "40 (Kesme) - Kamlı Kesme": {'r': 0.32, 'g': 0.18, 'b': 0},                         // Kahverengi
            "40 (Kesme) - Kamlı Delme": {'r': 0.235, 'g': 0.306, 'b': 0.416 },                  // Füme
            "30 (Bükme) - Kamlı Bükme": {'r': 0.81, 'g': 0.815, 'b': 0.41 },                    // Açık Yeşil
            "60 (Mastar) - KONTROL FİKSTÜRÜ (SUPPORT)":  {'r': 0.71, 'g': 0.1, 'b': 0.1 },      // Kızıl
            "60 (Mastar) - KONTROL FİKSTÜRÜ (GELENEKSEL)":  {'r': 0.59, 'g': 0.2, 'b': 0.4 },   // Vişne
            "70 (Kaynak) - PROJEKSİYON KAYNAK FİKSTÜRÜ": {'r': 0.5, 'g': 0.5, 'b': 0},          // Zeytin
            "70 (Kaynak) - GUJON KAYNAK FİKSTÜRÜ": {'r': 0.7, 'g': 0.4, 'b': 0.2},              // :=)
        }
        this.operation_types = {
            "Undefined": "Undefined",
            "10 (Açınım) - Açınım Kesme": "10 (Açınım) - Açınım Kesme",
            "10 (Açınım) - Ön Açınım Kesme": "10 (Açınım) - Ön Açınım Kesme",
            "20 (Çekme) - Çekme": "20 (Çekme) - Çekme",
            "30 (Bükme) - Bükme": "30 (Bükme) - Bükme",
            "30 (Bükme) - Form Verme": "30 (Bükme) - Form Verme",
            "40 (Kesme) - Çevre Kesme": "40 (Kesme) - Çevre Kesme",
            "40 (Kesme) - Delme": "40 (Kesme) - Delme",
            "30 (Bükme) - Kenarlama": "30 (Bükme) - Kenarlama",
            "30 (Bükme) - Kalibre": "30 (Bükme) - Kalibre",
            "50 (Prog) - Progresif": "50 (Prog) - Progresif",
            "40 (Kesme) - Kamlı Kesme": "40 (Kesme) - Kamlı Kesme",
            "40 (Kesme) - Kamlı Delme": "40 (Kesme) - Kamlı Delme",
            "30 (Bükme) - Kamlı Bükme": "30 (Bükme) - Kamlı Bükme",
            "60 (Mastar) - KONTROL FİKSTÜRÜ (SUPPORT)": "60 (Mastar) - KONTROL FİKSTÜRÜ (SUPPORT)",
            "60 (Mastar) - KONTROL FİKSTÜRÜ (GELENEKSEL)": "60 (Mastar) - KONTROL FİKSTÜRÜ (GELENEKSEL)",
            "70 (Kaynak) - PROJEKSİYON KAYNAK FİKSTÜRÜ": "70 (Kaynak) - PROJEKSİYON KAYNAK FİKSTÜRÜ",
            "70 (Kaynak) - GUJON KAYNAK FİKSTÜRÜ": "70 (Kaynak) - GUJON KAYNAK FİKSTÜRÜ"
        }
        this.setRendererDiv()
        this.setSelectionDiv()
        this.wait_for_data()
    }

    get_color = (key) => {
        const color = this.operation_colors[key]
        const r = (color.r + 0.5) > 1 ? 1 : color.r + 0.5
        const g = (color.g + 0.5) > 1 ? 1 : color.g + 0.5
        const b = (color.b + 0.5) > 1 ? 1 : color.b + 0.5
        const highlight_color = { 'r': r, 'g': g, 'b': b }
        return {
            'Normal Color': color,
            'Highlight Color': highlight_color
        }
    }

    wait_for_data = async () => {
        while (true) {
            if (this.props.files_list !== "LOADING") {
                this.pane_data = {
                    'File': this.props.files_list.find(item => { return item['text'] === this.props.params.teklif_id })['value'],
                    'Operations': {}
                }
                this.operation_folders = {}
                this.features_folders = {}
                this.init_pane()
                this.service.load_stl_file(this.pane_data["File"])
                break
            }
            else {
                await this.wait_for_seconds(0.5)
            }
        }
    }

    clear_pane = () => {
        try {
            this.pane_operations_folder.children.forEach(child => {
                if (child.title?.startsWith("Operation: ")) {
                    child.dispose()
                }
            })
        } catch (error) { console.error(error) }
    }

    init_pane = () => {
        this.pane = new Pane({ title: 'Controller' })
        this.pane.registerPlugin(EssentialsPlugin)
        this.pane.addButton({
            title: '11',
            label: '12'
        }).on('click', event => console.log(this.service.operationDetails))
        this.pane.addInput(
            this.pane_data,
            'File',
            { options: this.props.files_list }
        ).on('change', event => {
            this.service.load_stl_file(event.value)
            this.clear_pane()
        })
        this.pane_operations_folder = this.pane.addFolder({ title: 'Operations' })
        this.pane_operations_folder.addBlade({
            view: 'buttongrid',
            size: [2, 1],
            cells: (x, y) => ({
                title: [
                    ['Add New', 'Clear All'],
                ][y][x],
            }),
            label: 'Operations Actions',
        }).on('click', event => {
            switch (event.cell.title) {
                case 'Add New': {
                    this.pane_add_operation()

                    break
                }
                case 'Clear All': {
                    this.service.load_stl_file(this.pane_data.File)
                    this.clear_pane()
                    this.service.operationDetails = {}
                    break
                }
            }
            this.service.onGuiChange()
        })
        this.pane_operations_folder.addSeparator()
    }

    pane_add_operation = () => {
        let latest_operation_number = 0
        this.pane_operations_folder.children.forEach(folder => {
            if (folder.title?.startsWith('Operation: ')) {
                folder.expanded = false
                let operation_number = parseInt(folder.title.split(" ")[1])
                if (operation_number > latest_operation_number) latest_operation_number = operation_number
            }
        })

        const folder_number = latest_operation_number + 1
        const folder_name = `Operation: ${folder_number}`
        this.service.expandedOperation = folder_name

        this.service.operationDetails[folder_name] = {
            'Normal Color': { 'r': 0, 'g': 0, 'b': 0 },
            'Highlight Color': { 'r': 0, 'g': 0, 'b': 0 },
        }
        this.pane_data.Operations[folder_name] = {
            'Name': folder_name,
            'Type': 'Undefined',
            'Normal Color': { 'r': 0, 'g': 0, 'b': 0 },
            'Highlight Color': { 'r': 0, 'g': 0, 'b': 0 },   
        }

        const folder = this.pane_operations_folder.addFolder({ title: folder_name })
        folder.on('fold', event => {
            if (event.expanded === true) {
                this.pane_operations_folder.children.forEach(child => {
                    if (!child.title?.endsWith(event.target.title)) {
                        child.expanded = false
                    }
                    else {
                        this.service.expandedOperation = event.target.title
                    }
                })
            }
            this.service.onGuiChange()
        })
        folder.addButton({
            title: 'Delete',
            label: folder_name
        }).on('click', event => {
            this.pane_operations_folder.children.forEach(child => {
                if (child.title?.endsWith(event.target.label)) {
                    child.dispose()
                }
            })
        })
        folder.addSeparator()
        folder.addInput(
            this.pane_data.Operations[folder_name],
            'Name'
        )
        folder.addInput(
            this.pane_data.Operations[folder_name],
            'Type',
            { options: this.operation_types }
        ).on('change', event => {
            const color = this.get_color(event.value)
            this.pane_data.Operations[folder_name]['Normal Color'] = color['Normal Color']
            this.pane_data.Operations[folder_name]['Highlight Color'] = color['Highlight Color']
            this.pane_data.Operations[folder_name].n_color.refresh()
            this.pane_data.Operations[folder_name].h_color.refresh()
            this.service.operationDetails[folder_name]['Normal Color'] = color['Normal Color']
            this.service.operationDetails[folder_name]['Highlight Color'] = color['Highlight Color']
            this.service.onGuiChange()
        })
        this.pane_data.Operations[folder_name].n_color = folder.addInput(
            this.pane_data.Operations[folder_name],
            'Normal Color',
            { color: { type: 'float' } }
        ).on('change', event => {
            this.pane_data.Operations[folder_name]['Normal Color'] = event.value
            this.pane_data.Operations[folder_name].n_color.refresh()
            this.service.operationDetails[folder_name]['Normal Color'] = event.value
            this.service.onGuiChange()
        })
        this.pane_data.Operations[folder_name].h_color = folder.addInput(
            this.pane_data.Operations[folder_name],
            'Highlight Color',
            { color: { type: 'float' } }
        ).on('change', event => {
            this.pane_data.Operations[folder_name]['Highlight Color'] = event.value
            this.pane_data.Operations[folder_name].h_color.refresh()
            this.service.operationDetails[folder_name]['Highlight Color'] = event.value
            this.service.onGuiChange()
        })
        folder.addSeparator()
        
        const features_folder = folder.addFolder({ title: 'Features' })
        features_folder.addBlade({
            view: 'buttongrid',
            size: [1, 4],
            cells: (x, y) => ({
                title: [
                    ['Add New'],
                    ['Delete All'],
                    ['Clear Highlights'],
                    ['Clear Bounding Box'],
                    
                ][y][x],
            }),
            label: 'Features',
        }).on('click', event => {
            switch (event.cell.title) {
                case 'Add New': {
                    this.operation_add_feature(folder_name)
                    break
                }
                case 'Delete All': {
                    for (let j = features_folder.children.length - 1; j >= 0; j--) {
                        if (j > 1)
                            features_folder.children[j].dispose()
                    }
                    this.service.operationDetails[folder_name] = {
                        'Highlight Color': this.service.operationDetails[folder_name]['Highlight Color'],
                        'Normal Color': this.service.operationDetails[folder_name]['Normal Color'],
                    }
                    break
                }
                case 'Clear Highlights': {
                    this.service.operationDetails[folder_name].highlighted = ""
                    break
                }
                case 'Clear Bounding Box': {
                    this.service.bounding_box("", "")
                    break
                }
                
            }
            this.service.onGuiChange()
        })
        features_folder.addSeparator()
        this.operation_folders[folder_name] = folder
        this.features_folders[folder_name] = features_folder
    }

    operation_add_feature = (folder_name) => {
        const features_folder = this.features_folders[folder_name]
        let latest_feature_number = 0
        features_folder.children.forEach(controller => {
            if (controller.controller_?.props?.valMap_?.label?.value_?.startsWith('Feature: ')) {
                let feature_number = parseInt(controller.controller_.props.valMap_.label.value_.split(" ")[1])
                if (feature_number > latest_feature_number) latest_feature_number = feature_number
            }
        })

        const feature_number = latest_feature_number + 1
        const feature_name = `Feature: ${feature_number}`
        this.service.operationDetails[folder_name][feature_name] = []

        features_folder.addBlade({
            title: feature_name,
            view: 'buttongrid',
            size: [2, 2],
            cells: (x, y) => ({
                title: [
                    ['Delete', 'Reselect'],
                    ['Highlight', 'Area'],
                    
                ][y][x],
            }),
            label: feature_name,
        }).on('click', event => {
            switch (event.cell.title) {
                case 'Delete': {
                    features_folder.children.forEach(child => {
                        console.log(child)
                    })

                    for (let j = features_folder.children.length - 1; j >= 0; j--) {
                        if (features_folder.children[j].controller_?.props?.valMap_?.label?.value_?.endsWith(feature_name)) {
                            features_folder.children[j].dispose()
                            break
                        }
                    }
                    delete this.service.operationDetails[folder_name][feature_name]
                    this.service.onGuiChange()
                    break
                }
                case 'Reselect': {
                    this.service.selectingOperation = folder_name
                    this.service.selectingFeature = feature_name
                    this.service.controllerMode = "Selection"
                    break
                }
                case 'Highlight': {
                    this.service.operationDetails[folder_name].highlighted = feature_name
                    this.service.onGuiChange()
                    break
                }
                case 'Area': {
                    this.service.bounding_box(folder_name, feature_name)
                }
            }
        })
        
        //features_folder.addSeparator()
        this.service.selectingFeatue = `- ${folder_name} - ${feature_name} -`
        this.service.selectingOperation = folder_name
        this.service.selectingFeature = feature_name
        this.service.controllerMode = "Selection"
    }

    set_left = (props) => {
        this.setState({
            left: props
        })
    }

    set_right = (props) => {
        this.setState({
            right: props
        })
    }

    setRendererDiv = async () => {
        while (true) {
            if (document.getElementById('rendererDiv')) {
                document.getElementById('rendererDiv').appendChild(this.service.renderer.domElement)
                break
            } else {
                await this.wait_for_seconds(0.5)
                continue
            }
        }
        this.service.animate()
    }

    setSelectionDiv = async () => {
        while (true) {
            if (document.getElementById('selectionDiv')) {
                this.service.selectionDiv = document.getElementById('selectionDiv')
                break
            } else {
                await this.wait_for_seconds(0.5)
                continue
            }
        }
    }

    generateRandomDarkColor = () => {
        var r = Math.floor(Math.random() * 128);
        var g = Math.floor(Math.random() * 128);
        var b = Math.floor(Math.random() * 128);

        return { 'r': r / 255, 'g': g / 255, 'b': b / 255 }
    }

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000))
    }

    render() {
        return (
            <div id='rendererDiv'>
                <Dialog open={this.state.dialogOpen} maxWidth='lg'>
                    <DialogTitle>
                        {this.state.dialogHeader}
                    </DialogTitle>
                    <DialogContent>

                        
                        <TransferList
                            left = {this.state.left}
                            right = {this.state.right}
                            setLeft = {this.set_left}
                            setRight = {this.set_right}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button
                                onClick={() => {
                                    this.setState({ dialogOpen: false },
                                        () => {this.gui_operations[this.state.dialogHeader].Processes = this.state.right}
                                    )
                                }}
                            >
                            OK
                        </Button> 
                    </DialogActions>
                </Dialog>
                <div
                    id='selectionDiv'
                    style={{
                        border: '1px',
                        borderColor: 'red',
                        position: 'absolute',
                        pointerEvents: 'none',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)'
                    }}
                />
            </div>
        )
    }
}

const mstp = (state) => {
    return {
        files_list: state.threejs_v3.files_list,
        part_preset: state.threejs_v3.part_preset
    }
}

const mdtp = (dispatch) => {
    return {
        get_files_list: () => dispatch(get_files_list()),
        load_part_preset: (payload) => dispatch(load_part_preset(payload)),
        save_part_preset: (payload) => dispatch(save_part_preset(payload)),
    }
}

export default withRouter(connect(mstp, mdtp)(ThreeJSv3))
