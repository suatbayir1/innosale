import * as THREE from "three"
import ReactDOM from 'react-dom';

import { connect } from "react-redux"
import React, { Component, useRef } from "react"
import withRouter from "../../shared/hoc/withRouter"
import ThreeJSService from "../services/ThreeJSService"

import { save_part_bends, load_part_bends, get_stl_dict, save_preset, load_preset } from "../../store/index";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material"
import TransferList from "../components/TransferList"

class ThreeJSScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delete_approval: false,
            left: [],
            right: [],
            dialogHeader: props.dialogHeader
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
            this: this,
            url_teklif_id: props.params.teklif_id,
            axios: {
                'functions': {
                    'save_part_bends': props.save_part_bends,
                    'load_part_bends': this.load_part_bends,
                    'get_stl_dict': props.get_stl_dict,
                    'save_preset': props.save_preset,
                    'load_preset': props.load_preset,
                },
                'params': {
                    'part_bends': props.part_bends,
                    'stl_dict': props.stl_dict,
                    'operations_preset': props.operations_preset
                }
            }
        })
        this.setRendererDiv()
        this.setSelectionDiv()
    }

    set_left = (props) => {
        this.setState({
            left: props
        }, () => {
            this.service.save_edit_result({'left': this.state.left, 'right': this.state.right})
            this.service.save_operations_to_database()
        })
    }

    set_right = (props) => {
        this.setState({
            right: props
        }, () => {
            this.service.save_edit_result({'left': this.state.left, 'right': this.state.right})
            this.service.save_operations_to_database()
        })
    }

    load_part_bends = async (props) => {
        this.props.load_part_bends(props)
        let total_count = 0

        while (Object.keys(this.props.part_bends).length === 0) {
            if (total_count == 5) {
                return { bend_indexes: [], bends: [] }
            }
            else {
                await this.wait_for_seconds(1)
                total_count += 1
            }
        }

        return this.props.part_bends
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

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000))
    }

    render() {
        return (
            <div id='rendererDiv'>
                <Dialog open={this.state.delete_approval} maxWidth='lg'>
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
                        <Button onClick={() => this.setState({delete_approval: false})}>OK</Button> 
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
        part_bends: state.threejs.part_bends,
        stl_dict: state.threejs.stl_dict,
        operations_preset: state.threejs.operations_preset
    }
}

const mdtp = (dispatch) => {
    return {
        save_part_bends: (payload) => dispatch(save_part_bends(payload)),
        load_part_bends: (payload) => dispatch(load_part_bends(payload)),
        get_stl_dict: () => dispatch(get_stl_dict()),
        save_preset: (payload) => dispatch(save_preset(payload)),
        load_preset: (payload) => dispatch(load_preset(payload)),
    }
}

export default withRouter(connect(mstp, mdtp)(ThreeJSScene))
