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

    static removeAllObjectFromScene = async (scene, camera, renderer) => {
        console.log(scene);
        if (scene !== undefined) {
            let obj;
            for (var i = scene.children.length - 1; i >= 0; i--) {
                if (["GridHelper", "HemisphereLight", "DirectionalLight"].includes(scene.children[i]?.type)) {
                    continue;
                }
                obj = scene.children[i];
                obj.material = undefined;
                obj.geometry = undefined;
                await scene.remove(obj);
            }
            await renderer.render(scene, camera);
            return true;
        }
        return false;
    }

    static removeObjectFromSceneByUuid = async (scene, camera, renderer, uuid) => {
        console.log(scene);
        if (scene !== undefined) {
            let obj;
            for (var i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].uuid === uuid) {
                    obj = scene.children[i];
                    obj.material = undefined;
                    obj.geometry = undefined;
                    await scene.remove(obj);
                }
            }
            await renderer.render(scene, camera);
            return true;
        }
        return false;
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

    createOrbitControlAroundTarget = (camera, dom, center) => {
        let controls = new OrbitControls(camera, dom);
        controls.target.set( center[0], center[1], center[2]);
		controls.update();
		controls.enablePan = false;
		controls.enableDamping = true;
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

    addPlyFileWithUrl = async (url) => {
        const loader = new PLYLoader();
        let vm = this;

        // 'http://localhost:5002/static/convertedfiles/001_2020_Teklifid_10.ply'

        const geometry = await loader.load(url);
        console.log("geometry 1", geometry);

        return new Promise((resolve, reject) => {
            loader.load(url, async function (geometry) {
                console.log("geometry 2", geometry);
                geometry.computeVertexNormals();
                console.log(geometry);
                const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.x = - 0.2;
                mesh.position.y = - 0.02;
                mesh.position.z = - 0.2;
                // console.log(mesh.scale);
                mesh.scale.multiplyScalar(0.0006);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                console.log(mesh);

                await vm.scene.add(mesh);
                await vm.renderer.render(vm.scene, vm.camera)
                resolve(mesh.uuid);
            });
        })
    }

    addPlyFileWithUrl2 = async (url, setCenter) => {
        const loader = new PLYLoader();
        let vm = this;

        const geometry = await loader.load(url);
        console.log("geometry 1", geometry);

        return new Promise((resolve, reject) => {
            loader.load(url, async function (geometry) {
                
                geometry.computeBoundingBox();
                geometry.center();

                console.log("geometry 2", geometry);
                geometry.computeVertexNormals();
                console.log(geometry);
                const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
                const mesh = new THREE.Mesh(geometry, material);

                // console.log(mesh.scale);
                mesh.scale.multiplyScalar(0.0048);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                console.log(mesh);

                var middle = new THREE.Vector3(0,0,0);
                /*
                middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
                middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
                middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
                console.log(middle);
                setCenter(middle.x, middle.y, middle.z);
                */
                mesh.position.copy(middle);
                console.log(mesh.position)
                await vm.scene.add(mesh);
                await vm.renderer.render(vm.scene, vm.camera)
                resolve(mesh.uuid);
            });
        })
    }

    addPlyFile = async (path = "Lucy100k.ply") => {
        const loader = new PLYLoader();
        let vm = this;

        await loader.load(require(`../../data/models/${path}`), async function (geometry) {
            console.log(geometry);
            geometry.computeVertexNormals();
            console.log(geometry);
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

    addPlyFileWithParsing = async (url) => {
        const loader = new PLYLoader();
        const geometry = await loader.parse(url);

        console.log(geometry);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = - 0.2;
        mesh.position.y = - 0.02;
        mesh.position.z = - 0.2;
        mesh.scale.multiplyScalar(0.0006);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        await this.scene.add(mesh);
        await this.renderer.render(this.scene, this.camera)

        return mesh.uuid;
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