// Libraries
import React, { Component } from 'react';

// Components
import { Header } from '../../components'

// Services
import { SceneService, ICPService } from '../../shared/services'
import Box from '@mui/material/Box';

import {connect, Provider} from "react-redux";

import {getCenter} from '../../store/index.js';

// Scene Helpers
class ModelThree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            camera: SceneService.createCamera(30, 2, 0.1, 20),
            controls: null,
            scene: SceneService.createScene(),
            renderer: SceneService.createRenderer(window.devicePixelRatio, 480, 160),
            fileId: props.fileId,
            center: {x:0, y:0, z:0}
        }
    }

    setCenter = (x, y, z) => {
        this.setState({center: {x:x, y:y, z:z}});
    }

    componentDidMount = async () => {
        const {fileId, renderer} = this.state;
        //const {url} = this.props;

        //await this.props.getURL(fileId);

        const url = "http://localhost:5002/static/convertedfiles2/" + fileId + ".ply";
        
        console.log(url);

        await this.addPlyFile(url, this.setCenter);
        await this.createScene();

        setTimeout(() => {
            var container = document.querySelector('#modelThreeDetailContainer' + fileId);
            var rect = container.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
        }, 1000);
    }

    createScene = async () => {        
        const {center} = this.state;
        const sceneManager = new SceneService(this.state.scene, this.state.camera, this.state.renderer);
        sceneManager.setGround();
        sceneManager.addLightToScene();
        sceneManager.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        sceneManager.addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

        document.getElementById("modelThreeDetailScene" + this.state.fileId).appendChild(this.state.renderer.domElement);
        this.setState({controls: sceneManager.createOrbitControlAroundTarget(this.state.camera, this.state.renderer.domElement, [0,0,0])}, 
            () => {
                this.state.controls.target.set(0,0,0);
                this.state.controls.addEventListener("change", () => {
                    this.state.renderer.render(this.state.scene, this.state.camera);
                });
            }
        );

        // window.addEventListener('resize', sceneManager.onWindowResize);

        this.state.renderer.render(this.state.scene, this.state.camera);
    }

    addPlyFile = async (url, setCenter) => {
        const {scene, camera, renderer} = this.state;


        //this.props.getCenter(this.state.fileId + ".ply");

        const sceneManager = new SceneService(scene, camera, renderer);
        await sceneManager.addPlyFileWithUrl2(url, setCenter);
    }

    render() {
        return (
          <div id={"modelThreeDetailContainer"+this.state.fileId} style={{ width: '480px', height: '160px' }}>
                    <div id={"modelThreeDetailScene" + this.state.fileId}>
                    </div>
                    </div>
        )
    }
}

const mstp = (state) => {
    return {
        center: state.icp.center,
    }
}
  
const mdtp = (dispatch) => {
    return {
        getCenter: (payload) => dispatch(getCenter(payload)),
    }
}

export default connect(mstp, mdtp)(ModelThree);