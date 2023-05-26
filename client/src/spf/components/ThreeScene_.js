import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class ThreeScene_ {
    constructor(props) {
        this.props = props
        this.scene = ThreeScene_.createScene()
        this.camera = ThreeScene_.createCamera(75, props.width / props.height, 0.1, 2000)
        this.renderer = ThreeScene_.createRenderer(1, props.width, props.height)
        this.createOrbitControl(this.camera, this.renderer.domElement)
        this.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        this.addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
        
        this.appendChildLoop(this.renderer);
    }
    
    static createScene = () => {
        const scene = new THREE.Scene();
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff)
        hemisphereLight.uuid = 'HemisphereLight'
        
        scene.background = new THREE.Color(0x72645b)
        scene.add(hemisphereLight)
        return scene;
    }
    
    static createCamera = (fov, aspect, near, far) => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.lookAt(ThreeScene_.createScene())
        camera.position.set(-30, 30, 30)
        return camera;
    }

    static createRenderer = (pixelRatio, width, height) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    static removeAllObjectFromSceneList = async (scene, camera, renderer) => {
        const exludeList = ["DirectionalLight", "HemisphereLight", "SpotLight"]

        if (scene !== undefined) {
            for (let i = scene.children.length - 1; i >= 0; i--) {
                let object = scene.children[i]

                if (!exludeList.includes(object.uuid)) {
                    object.material = undefined
                    object.geometry = undefined
                    await scene.remove(object)
                }
            }
            await renderer.render(scene, camera)
        }
    }

    addShadowedLight = (x, y, z, color, intensity) => {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        directionalLight.uuid = "DirectionalLight"
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

        const frontSpot = new THREE.SpotLight(0xeeeece);
        frontSpot.position.set(1000, 1000, 1000);
        frontSpot.uuid = "SpotLight"
        this.scene.add(frontSpot);
    }

    createOrbitControl = (camera, dom) => {
        let controls = new OrbitControls(camera, dom)
        controls.enableZoom = true
        controls.zoomSpeed = 0.5
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.screenSpacePanning = false
        controls.minDistance = 1
        controls.maxDistance = 1000
        controls.update()

        return controls;
    }

    addPlyFile = (path, visible=true) => {
        const vm_ = this
        return new Promise (async (resolve, reject) => {
            const loader = new PLYLoader()
            let vm = vm_
            console.log(path.split('/').pop())
            console.log(`../../parts/convertedfiles2/${path.split('/').pop()}.ply`)
            try {
                await loader.load(require(`../../parts/convertedfiles2/${path.split('/').pop()}.ply`), function (geometry) {
                    geometry.computeVertexNormals()
                    const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x111111, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.uuid = path.split('_').pop().split('.')[0]
                    
                    //if (clearScene) ThreeScene_.removeAllObjectFromSceneList(vm.scene, vm.camera, vm.renderer)
                    console.log(mesh)

                    const positions = geometry.attributes.position.array
                    const numPoints = positions.length / 3
                    let xSum = 0, ySum = 0, zSum = 0

                    for (let i = 0; i < numPoints; i++) {
                        const index = i * 3;
                        xSum += positions[index];
                        ySum += positions[index + 1];
                        zSum += positions[index + 2];
                    }
                    const xMean = xSum / numPoints;
                    const yMean = ySum / numPoints;
                    const zMean = zSum / numPoints;

                    mesh.position.x = -xMean
                    mesh.position.y = -yMean
                    mesh.position.z = -zMean
                    //mesh.scale.multiplyScalar(0.0006)
                    mesh.visible = visible
                    mesh.castShadow = true
                    mesh.receiveShadow = true

                    vm.scene.add(mesh)
                    vm.renderer.render(vm.scene, vm.camera)
                    vm.animate()
                })
            }
            catch {}
            resolve()
        })
    }

    appendChildLoop = async (renderer) => {
        if (this.props.partModelPreviewScene) {
            this.props.partModelPreviewScene.appendChild(renderer.domElement)
            console.log(this.props.partModelPreviewScene)
            return
        }
        else {
            await this.wait_for_seconds(0.2)
            this.appendChildLoop(renderer)            
        }
    }

    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    animate = () => {
        requestAnimationFrame(this.animate);              
        this.renderer.render(this.scene, this.camera);
    }
}

export default ThreeScene_;