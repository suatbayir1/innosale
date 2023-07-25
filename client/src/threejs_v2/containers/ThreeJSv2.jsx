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

class ThreeJSv2 extends Component {
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

        // Backend
        this.gui_processes = {}
        this.gui_operations = {}
        
        this.process_colors = {}
        this.processes = []
        this.process_indexes = []
        
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

        // Backend
        this.props.get_files_list()

        this.init_pane()
        this.setRendererDiv()
        this.setSelectionDiv()
    }

    clear_pane = () => {
        try {
            this.tab.pages.forEach(page => {
                page.children[1].children.forEach(child => {
                    child.dispose()
                })
            })
        } catch (error) { console.error(error) }
    }

    init_pane = async () => {
        this.pane = new Pane({ title: 'Controller' });
        this.pane.registerPlugin(EssentialsPlugin);

        //#region File
        while (this.props.files_list === "LOADING")
            await this.wait_for_seconds(0.1)
        
        const files_list = this.pane.addBlade({
            view: 'list',
            label: 'File',
            options: this.props.files_list,
            value: this.props.files_list.find(item => { return item['text'] === this.props.params.teklif_id })['value']
        })
        files_list.on('change', event => {
            this.load_file(event.value)
            this.file_path = event.value
            this.clear_pane()
        })
        this.load_file(files_list.value)
        this.file_path = files_list.value
        //#endregion
        
        this.pane.addSeparator()
        
        //#region TAB
        this.tab = this.pane.addTab({
            pages: [
                { title: 'Processes' },
                { title: 'Operations' },
            ]
        })
        //#endregion

        //#region TAB-Processes
        this.tab.pages[0].addBlade({
            view: 'buttongrid',
            size: [2, 2],
            label: 'Processes Actions',
            cells: (x, y) => ({
                title: [
                    ['Save', 'Load'],
                    ['Add', 'Clear All']
                ][y][x],
            }),
        }).on('click', (event) => {
            switch (event.cell.title) {
                case 'Save': {
                    this.save_file()
                    break
                }
                case 'Load': {
                    this.processesFolder.children.forEach(child => { child.dispose() })
                    this.operationsFolder.children.forEach(child => { child.dispose() })
                    this.load_file(files_list.value)
                    break
                }
                case 'Add': {
                    this.gui_add_process()
                    break
                }
                case 'Clear All': {
                    this.tab.pages.forEach(page => {
                        if (page.title === "Processes") {
                            page.children[1].children.forEach(child => {
                                this.service.delete_process(child.title)
                                delete this.process_colors[child.title]
                                child.dispose()
                            })
                        }
                    })
                    break
                }
                default: console.log("Not contain")
            }
            console.log("Processes Button: ", event.cell.title);
        })
        this.processesFolder = this.tab.pages[0].addFolder({ title: 'Processes' })
        //#endregion
        //#region TAB-Operations
        this.tab.pages[1].addBlade({
            view: 'buttongrid',
            size: [2, 2],
            label: 'Operations Actions',
            cells: (x, y) => ({
                title: [
                    ['Save', 'Load'],
                    ['Add', 'Clear All']
                ][y][x],
            }),
        }).on('click', (event) => {
            switch (event.cell.title) {
                case 'Save': {
                    this.save_file()
                    break
                }
                case 'Load': {
                    this.processesFolder.children.forEach(child => { child.dispose() })
                    this.operationsFolder.children.forEach(child => { child.dispose() })
                    this.load_file(files_list.value)
                    break
                }
                case 'Add': {
                    this.gui_add_operation()
                    break
                }
                case 'Clear All': {
                    this.tab.pages.forEach(page => {
                        if (page.title === "Operations") {
                            page.children[1].children.forEach(child => {
                                ///*
                                child.dispose()
                            })
                        }
                    })
                    break
                }
                default: console.log("Not contain")
            }
            console.log("Operations", event.cell.title);
        })
        this.operationsFolder = this.tab.pages[1].addFolder({ title: 'Operations' })
        //#endregion

        this.pane.addSeparator()

        //#region Deneme
        const denemeButton = this.pane.addButton({
            title: 'title',
            label: 'label',
        })
        denemeButton.on('click', () => {
            //this.service.controllerMode = "Selection"
            console.log(this.state)
            console.log(this.gui_operations)
            console.log(this.gui_processes)
            console.log(this.service.processes_list)
            
        })
        //#endregion
    }

    load_file = async (path) => {
        this.props.load_part_preset({ "file_path": path })
        await this.wait_for_seconds(0.1)
        while (true) {
            if (this.props.part_preset === "LOADING") {
                await this.wait_for_seconds(0.1)
            }
            else {
                console.log(this.props.part_preset)
                this.service.processes_list = this.props.part_preset.processes_list
                this.gui_operations = this.props.part_preset.operations ? this.props.part_preset.operations : {}
                this.gui_processes = this.props.part_preset.processes ? this.props.part_preset.processes : {}
                this.service.load_stl_file(path).then(() => {
                    console.log(this.service.processes_list)
                    this.service.scene.traverse(object => {
                        if (object.uuid === 'main_object') {
                            const geometry = object.geometry
                            const colorAttribute = geometry.attributes.color
                            const positionAttribute = geometry.attributes.position
                            for (let i = 0; i < positionAttribute.count; i+=3) {
                                const process_name = this.props.part_preset.processes_list[i]
                                
                                if (process_name !== -1) {
                                    const color = this.gui_processes[process_name].Color
                                    colorAttribute.setXYZ(i, color.r, color.g, color.b)
                                    colorAttribute.setXYZ(i + 1, color.r, color.g, color.b)
                                    colorAttribute.setXYZ(i + 2, color.r, color.g, color.b)
                                }
                                
                            }
                            colorAttribute.needsUpdate = true
                        }
                    })
                })

                Object.keys(this.props.part_preset.processes).forEach(key => {
                    const process = this.props.part_preset.processes[key]
                    const process_folder = this.processesFolder.addFolder({ 'title': key })
                    this.gui_processes[key] = { 'Name': process.Name, 'Color': process.Color }
                    process_folder.on('fold', event => {
                        if (event.expanded) {
                            this.processesFolder.children.forEach(folder => {
                                if (event.target.title !== folder.title) {
                                    folder.expanded = false
                                }
                            })
                        }
                    })
                    process_folder.addInput(
                        this.gui_processes[key],
                        'Name'
                    )
                    
                    
                    this.process_colors[key] = process.Color
                    process_folder.addInput(
                        this.gui_processes[key],
                        'Color',
                        { color: {type: 'float'} }
                    ).on('change', event => {
                        console.log(event)
                        console.log(event.target.controller_.parent)
                        this.process_colors[key] = event.value

                        this.service.scene.traverse(object => {
                            if (object.uuid === 'main_object') {
                                const geometry = object.geometry
                                const colorAttribute = geometry.attributes.color
                                const positionAttribute = geometry.attributes.position
                                for (let i = 0; i < positionAttribute.count; i += 3) {
                                    if (this.service.processes_list[i] === key) {
                                        colorAttribute.setXYZ(i, event.value.r, event.value.g, event.value.b)
                                        colorAttribute.setXYZ(i + 1, event.value.r, event.value.g, event.value.b)
                                        colorAttribute.setXYZ(i + 2, event.value.r, event.value.g, event.value.b)
                                    }
                                }
                                colorAttribute.needsUpdate = true
                            }
                        })
                    })
                    process_folder.addBlade({
                        view: 'buttongrid',
                        size: [2, 1],
                        label: 'Process Actions',
                        cells: (x, y) => ({
                            title: [
                                ['Select More', 'Delete']
                            ][y][x],
                        }),
                    }).on('click', event => {
                        console.log(event.cell.title);
                        switch (event.cell.title) {
                            case 'Select More': {
                                console.log(this.gui_processes[key])
                                this.service.selectedColor = this.gui_processes[key].Color
                                this.service.selected_process = key
                                this.service.controllerMode = "Selection"
                                break
                            }
                            case 'Delete': {
                                this.service.delete_process(key)
                                Object.keys(this.gui_operations).forEach(key_ => {
                                    for (let i = 0; i < this.gui_operations[key_].Processes.length; i++) {
                                        console.log(this.gui_operations[key_].Processes[i])
                                        if (this.gui_operations[key_].Processes[i] === key) {
                                            this.gui_operations[key_].Processes.splice(i, 1)
                                            break
                                        }
                                    }
                                })

                                
                                console.log(process_folder)
                                process_folder.dispose()
                                delete this.process_colors[key]
                                delete this.gui_processes[key]
                                
                                break
                            }
                        }
                    })
                })

                Object.keys(this.props.part_preset.operations).forEach(key => {
                    const operation = this.props.part_preset.operations[key]
                    const operation_folder = this.operationsFolder.addFolder({ title: key })
                    this.gui_operations[key] = { 'Processes': operation.Processes, 'Type': operation.Type }
                    operation_folder.on('fold', event => {
                        if (event.expanded) {
                            this.operationsFolder.children.forEach(folder => {
                                if (event.target.title !== folder.title) {
                                    folder.expanded = false
                                }
                            })
                        }
                    })

                    operation_folder.addBlade({
                        view: 'buttongrid',
                        size: [2, 1],
                        label: 'Operation Actions',
                        cells: (x, y) => ({
                            title: [
                                ['Edit', 'Delete']
                            ][y][x],
                        }),
                    }).on('click', event => {
                        console.log(event.cell.title);
                        switch (event.cell.title) {
                            case 'Edit': {
                                this.create_overlay(key)
                                break
                            }
                            case 'Delete': {
                                console.log(operation_folder)
                                operation_folder.dispose()
                                delete this.gui_operations[key]
                                break
                            }
                        }
                    })
                    operation_folder.addInput(
                        this.gui_operations[key],
                        'Type',
                        { options: this.operation_types }
                    )
                })
                
                break
            }
        }
    }

    save_file = async () => {
        this.props.save_part_preset({
            'file_path': this.file_path,
            'processes_list': this.service.processes_list,
            'operations': this.gui_operations,
            'processes': this.gui_processes
        })
    }

    gui_add_operation = () => {
        let latest_operation_number = 0

        this.operationsFolder.children.forEach(folder => {
            if (folder.title.startsWith('Operation: ')) {
                let operation_number = parseInt(folder.title.split(" ")[1])
                if (operation_number > latest_operation_number) latest_operation_number = operation_number
            }
        })

        let folder_number = latest_operation_number + 1
        const operation_folder = this.operationsFolder.addFolder({ title: `Operation: ${folder_number}` })
        this.gui_operations[`Operation: ${folder_number}`] = { 'Processes': [], 'Type': 'Unassigned' }
        operation_folder.on('fold', event => {
            if (event.expanded) {
                this.operationsFolder.children.forEach(folder => {
                    if (event.target.title !== folder.title) {
                        folder.expanded = false
                    }
                })
            }
        })

        operation_folder.addBlade({
            view: 'buttongrid',
            size: [2, 1],
            label: 'Operation Actions',
            cells: (x, y) => ({
                title: [
                    ['Edit', 'Delete']
                ][y][x],
            }),
        }).on('click', event => {
            console.log(event.cell.title);
            switch (event.cell.title) {
                case 'Edit': {
                    this.create_overlay(`Operation: ${folder_number}`)
                    break
                }
                case 'Delete': {
                    console.log(operation_folder)
                    operation_folder.dispose()
                    delete this.gui_operations[`Operation: ${folder_number}`]
                    break
                }
            }
        })
        operation_folder.addInput(
            this.gui_operations[`Operation: ${folder_number}`],
            'Type',
            { options: this.operation_types }
        )
    }

    create_overlay = (operationName) => {
        this.setState({
            right: this.gui_operations[operationName].Processes,
            left: Object.keys(this.gui_processes).filter(item => !this.gui_operations[operationName].Processes.includes(item)),
            dialogHeader: operationName,
            dialogOpen: true
        })
    }

    gui_add_process = () => {
        let latest_process_number = 0
        console.log(this.processesFolder.children)

        this.processesFolder.children.forEach(folder => {
            if (folder.title.startsWith('Process: ')) {
                let proces_number = parseInt(folder.title.split(" ")[1])
                if (proces_number > latest_process_number) latest_process_number = proces_number
            }
        })
        let folder_number = latest_process_number + 1
        this.selected_process = `Process: ${folder_number}`
        this.service.selected_process = `Process: ${folder_number}`
        this.selectedColor = this.generateRandomDarkColor()
        const process_folder = this.processesFolder.addFolder({ title: `Process: ${folder_number}`})
        this.gui_processes[`Process: ${folder_number}`] = { 'Name': `Process: ${folder_number}`, 'Color': this.selectedColor }
        process_folder.on('fold', event => {
            if (event.expanded) {
                this.processesFolder.children.forEach(folder => {
                    if (event.target.title !== folder.title) {
                        folder.expanded = false
                    }
                })
            }
        })
        process_folder.addInput(
            this.gui_processes[`Process: ${folder_number}`],
            'Name'
        )
        
        
        this.process_colors[`Process: ${folder_number}`] = this.selectedColor
        process_folder.addInput(
            this.gui_processes[`Process: ${folder_number}`],
            'Color',
            { color: {type: 'float'} }
        ).on('change', event => {
            console.log(event)
            console.log(event.target.controller_.parent)
            this.process_colors[`Process: ${folder_number}`] = event.value

            this.service.scene.traverse(object => {
                if (object.uuid === 'main_object') {
                    const geometry = object.geometry
                    const colorAttribute = geometry.attributes.color
                    const positionAttribute = geometry.attributes.position
                    
                    for (let i = 0; i < positionAttribute.count; i += 3) {
                        if (this.service.processes_list[i] === `Process: ${folder_number}`) {
                            colorAttribute.setXYZ(i, event.value.r, event.value.g, event.value.b)
                            colorAttribute.setXYZ(i + 1, event.value.r, event.value.g, event.value.b)
                            colorAttribute.setXYZ(i + 2, event.value.r, event.value.g, event.value.b)
                        }
                    }
                    colorAttribute.needsUpdate = true
                }
            })
        })
        process_folder.addBlade({
            view: 'buttongrid',
            size: [2, 1],
            label: 'Process Actions',
            cells: (x, y) => ({
                title: [
                    ['Select More', 'Delete']
                ][y][x],
            }),
        }).on('click', event => {
            console.log(event.cell.title);
            switch (event.cell.title) {
                case 'Select More': {
                    console.log(this.gui_processes[`Process: ${folder_number}`])
                    this.service.selectedColor = this.gui_processes[`Process: ${folder_number}`].Color
                    this.service.selected_process = `Process: ${folder_number}`
                    this.service.controllerMode = "Selection"
                    break
                }
                case 'Delete': {
                    this.service.delete_process(`Process: ${folder_number}`)
                    Object.keys(this.gui_operations).forEach(key => {
                        for (let i = 0; i < this.gui_operations[key].Processes.length; i++) {
                            console.log(this.gui_operations[key].Processes[i])
                            if (this.gui_operations[key].Processes[i] === `Process: ${folder_number}`) {
                                this.gui_operations[key].Processes.splice(i, 1)
                                break
                            }
                        }
                    })

                    
                    console.log(process_folder)
                    process_folder.dispose()
                    delete this.process_colors[`Process: ${folder_number}`]
                    delete this.gui_processes[`Process: ${folder_number}`]
                    
                    break
                }
            }
        })
        this.service.selectedColor = this.selectedColor
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
        files_list: state.threejs_v2.files_list,
        part_preset: state.threejs_v2.part_preset
    }
}

const mdtp = (dispatch) => {
    return {
        get_files_list: () => dispatch(get_files_list()),
        load_part_preset: (payload) => dispatch(load_part_preset(payload)),
        save_part_preset: (payload) => dispatch(save_part_preset(payload)),
    }
}

export default withRouter(connect(mstp, mdtp)(ThreeJSv2))
