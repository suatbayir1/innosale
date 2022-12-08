import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

// Libraries
// var THREE = require("three");import * as THREE from 'three';
import * as THREE from 'three';

class SceneService {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    static createScene = () => {
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0x72645b);
        scene.fog = new THREE.Fog(0x72645b, 2, 15);

        return scene;
    }

    static createCamera = (fov, aspect, near, far) => {
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(3, 0.15, 3);

        return camera;
    }

    static createRenderer = (pixelRatio, width, height) => {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    setGround = () => {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
        );
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = - 0.5;
        this.scene.add(plane);

        plane.receiveShadow = true;
    }

    createOrbitControl = (camera, dom) => {
        let controls = new OrbitControls(camera, dom);
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.update();

        return controls;
    }

    addLightToScene = () => {
        const light = new THREE.HemisphereLight(0x443333, 0x111122)
        this.scene.add(light);
    }

    addShadowedLight = (x, y, z, color, intensity) => {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        this.scene.add(directionalLight);
        directionalLight.castShadow = true;
        const d = 1;
        directionalLight.shadow.camera.left = - d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = - d;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 4;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = - 0.001;
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addPlyFile = async (path = "Lucy100k.ply") => {
        const loader = new PLYLoader();
        let vm = this;

        await loader.load(require(`../../data/models/${path}`), async function (geometry) {
            geometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = - 0.2;
            mesh.position.y = - 0.02;
            mesh.position.z = - 0.2;
            mesh.scale.multiplyScalar(0.0006);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            await vm.scene.add(mesh);
            await vm.renderer.render(vm.scene, vm.camera)
        });
    }

    renderGLTFModel = async () => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath("../../node_modules/three/examples/js/libs/draco/");
        loader.setDRACOLoader(dracoLoader);
        let vm = this;

        await loader.load(
            require('../../data/models/factory-glb.glb'),
            // '../../assets/models/factory-glb.glb',

            async function (gltf) {
                gltf.scene.scale.set(0.01, 0.01, 0.01);
                gltf.scene.position.set(0, 0, 0)
                vm.renderer.setClearColor(0xbfe3dd);
                await vm.scene.add(gltf.scene);
                await vm.renderer.render(vm.scene, vm.camera);
            },

            function (_) {
            },

            function (_) {
            }
        );
        await vm.renderer.render(vm.scene, vm.camera);
    }
}

export default SceneService;