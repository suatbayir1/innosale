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
        await this.responsiveConfiguration();
        await this.addPlyFile();
    }

    responsiveConfiguration = () => {
        renderer.setSize(
            document.querySelector("#visualPanel").clientWidth,
            document.querySelector("#visualPanel").clientHeight
        );
        renderer.render(scene, camera);

        window.addEventListener('resize', () => {
            if (document.querySelector("#visualPanel") !== null) {
                renderer.setSize(
                    document.querySelector("#visualPanel").clientWidth,
                    document.querySelector("#visualPanel").clientHeight
                );
            }
        });
    }

    createScene = async () => {
        scene = SceneService.createScene();
        camera = SceneService.createCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        renderer = SceneService.createRenderer(window.devicePixelRatio, window.innerWidth, window.innerHeight);

        const sceneManager = new SceneService(scene, camera, renderer);
        sceneManager.setGround();
        sceneManager.addLightToScene();
        sceneManager.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        sceneManager.addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);

        document.getElementById("visualScene").appendChild(renderer.domElement);

        controls = sceneManager.createOrbitControl(camera, renderer.domElement);
        controls.addEventListener("change", () => {
            renderer.render(scene, camera);
        });

        window.addEventListener('resize', sceneManager.onWindowResize);

        renderer.render(scene, camera);
    }

    addPlyFile = async () => {
        const sceneManager = new SceneService(scene, camera, renderer);
        await sceneManager.addPlyFile('dolphins.ply');
        await sceneManager.addPlyFile('Lucy100k.ply');
    }


    render() {
        return (
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
                <Header category={"App"} title={"Part Model"} />


                < div id="visualPanel" >
                    <div id="visualScene">
                    </div>
                </div>
            </div >
        )
    }
}

export default PartModel;