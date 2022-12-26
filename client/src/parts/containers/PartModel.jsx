// Libraries
import React, { Component } from 'react';

// Components
import { Header } from '../../components'

// Services
import { SceneService } from '../../shared/services'

// Scene Helpers
var camera, controls, scene, renderer;


class PartModel extends Component {
    componentDidMount = async () => {
        await this.createScene();
        // await this.responsiveConfiguration();
        await this.addPlyFile();

        setTimeout(() => {
            var container = document.querySelector('#partModelDetailContainer');
            var rect = container.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
        }, 1000);
    }

    responsiveConfiguration = () => {
        var container = document.querySelector('#partModelDetailContainer');
        var rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        renderer.render(scene, camera);

        window.addEventListener('resize', () => {
            if (document.querySelector("#partModelDetailContainer") !== null) {
                var container = document.querySelector('#partModelDetailContainer');
                var rect = container.getBoundingClientRect();
                renderer.setSize(rect.width, rect.height);
                renderer.render(scene, camera);
            }
        });
    }

    createScene = async () => {
        scene = SceneService.createScene();
        camera = SceneService.createCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        renderer = SceneService.createRenderer(window.devicePixelRatio, 1000, 600);

        const sceneManager = new SceneService(scene, camera, renderer);
        sceneManager.setGround();
        sceneManager.addLightToScene();
        sceneManager.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        sceneManager.addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);

        document.getElementById("partModelDetailScene").appendChild(renderer.domElement);

        controls = sceneManager.createOrbitControl(camera, renderer.domElement);
        controls.addEventListener("change", () => {
            renderer.render(scene, camera);
        });

        // window.addEventListener('resize', sceneManager.onWindowResize);

        renderer.render(scene, camera);
    }

    addPlyFile = async () => {
        const sceneManager = new SceneService(scene, camera, renderer);
        await sceneManager.addPlyFile('dolphins.ply');
        await sceneManager.addPlyFile('Lucy100k.ply');
    }


    render() {
        var selection = document.querySelector('#part-model-container');
        if (selection !== null) {
            console.log(selection.clientWidth);
        } else {
            console.log(0);
        }

        return (
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl' id={'part-model-container'}>
                <Header category={"App"} title={"Part Model"} />

                <div id="partModelDetailContainer" style={{ width: '100%', height: '500px' }}>
                    <div id="partModelDetailScene">
                    </div>
                </div>
            </div >
        )
    }
}

export default PartModel;