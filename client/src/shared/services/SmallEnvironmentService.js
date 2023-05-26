import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import EnvironmentService from './EnvironmentService';


class SmallEnvironmentService {
    constructor(props) {
        this.props = props
        this.scene = SmallEnvironmentService.createScene()
        this.camera = SmallEnvironmentService.createCamera(75, props.width / props.height, 0.1, 2000)
        this.renderer = SmallEnvironmentService.createRenderer(1, props.width, props.height)
        this.createOrbitControl(this.camera, this.renderer.domElement)
        this.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        this.addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
       
        this.appendChildLoop(this.renderer)
        this.createSelectionRectangle()


        this.mode = 'move'
        this.isMouseDown = false
        this.mouseDownPosition = new THREE.Vector2()
        this.currentMousePosition = new THREE.Vector2()


        window.addEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('mousedown', this.onMouseDown, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('mouseup', this.onMouseUp, false);
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
        camera.lookAt(SmallEnvironmentService.createScene())
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


    createSelectionRectangle = () => {
        this.selectionRectangleDiv = document.createElement('div')
        this.selectionRectangleDiv.id = 'selectionRectangle'
        this.selectionRectangleDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        this.selectionRectangleDiv.style.position = "absolute";
        document.body.appendChild(this.selectionRectangleDiv)
    }


    drawSelectionRectangle = (startPosition, endPosition) => {
        console.log(Math.min(startPosition.x, endPosition.x))
        console.log(Math.max(startPosition.x, endPosition.x))
       
        const minPosX = (Math.min(startPosition.x, endPosition.x) + 1) / 2 * window.innerWidth
        const maxPosX = (Math.max(startPosition.x, endPosition.x) + 1) / 2 * window.innerWidth
        const minPosY = (1 - Math.max(startPosition.y, endPosition.y)) / 2 * window.innerHeight
        const maxPosY = (1 - Math.min(startPosition.y, endPosition.y)) / 2 * window.innerHeight
     
        this.selectionRectangleDiv.style.left = `${minPosX}px`
        this.selectionRectangleDiv.style.top = `${minPosY}px`
        this.selectionRectangleDiv.style.width = `${maxPosX - minPosX}px`
        this.selectionRectangleDiv.style.height = `${maxPosY - minPosY}px`
    }


    getRandomDarkColor = () => {
        const min = 0;
        const max = 128


        const red = Math.floor(Math.random() * (max - min + 1)) + min;
        const green = Math.floor(Math.random() * (max - min + 1)) + min;
        const blue = Math.floor(Math.random() * (max - min + 1)) + min;


        return new THREE.Color(`rgb(${red}, ${green}, ${blue})`);
    }


    selectTrianglesWithinRectangle = (startPosition, endPosition) => {
        const vm = this
        const minPosX = Math.min(startPosition.x, endPosition.x);
        const maxPosX = Math.max(startPosition.x, endPosition.x);
        const minPosY = Math.min(startPosition.y, endPosition.y);
        const maxPosY = Math.max(startPosition.y, endPosition.y);
       
        this.scene.traverse(
            function (object) {
                if (object instanceof THREE.Mesh) {
                    const geometry = object.geometry
                    const colorAttribute = geometry.attributes.color.array
                    const positionAttribute = geometry.attributes.position.array
                    console.log(positionAttribute)
                    console.log(colorAttribute)
			
                    for (let i = 0; i < positionAttribute.length; i += 9) {
                        const vertices = [
                            new THREE.Vector3(positionAttribute[i], positionAttribute[i+1], positionAttribute[i+2]), // X
                            new THREE.Vector3(positionAttribute[i+3], positionAttribute[i+4], positionAttribute[i+5]), // Y
                            new THREE.Vector3(positionAttribute[i+6], positionAttribute[i+7], positionAttribute[i+8]), // Z
                        ]
                        const allVerticesInside = vertices.every(
                            v => {
                                v.project(vm.camera)
                                return v.x >= minPosX && v.x <= maxPosX && v.y >= minPosY && v.y <= maxPosY
                            }
                        )
                        if (allVerticesInside) {
                            const color = { 'r': 0, 'g': 0, 'b': 0 }

                            colorAttribute[i] = color['r']
                            colorAttribute[i+1] = color['g']
                            colorAttribute[i+2] = color['b']

                            colorAttribute[i+3] = color['r']
                            colorAttribute[i+4] = color['g']
                            colorAttribute[i+5] = color['b']


                            colorAttribute[i+6] = color['r']
                            colorAttribute[i+7] = color['g']
                            colorAttribute[i+8] = color['b']
                        }


                    }
                   
                    geometry.attributes.color.needsUpdate = true
                }
            }
        )
        this.selectionRectangleDiv.style.width = '0px'
        this.selectionRectangleDiv.style.height = '0px'
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
        this.controls = controls
        return controls;
    }


    addPlyFile = (path) => {
        const vm_ = this
        return new Promise (async (resolve, reject) => {
            const vm = vm_
            const loader = new PLYLoader()
            await loader.load(require(`../../parts/convertedfiles2/${path.split('/').pop()}.ply`), function (geometry) {
                geometry.center()
                const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
                const boundingBoxSize = boundingBox.getSize(new THREE.Vector3())
                const maxAxisLength = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z)
                const scale = 5 / maxAxisLength;
                geometry.scale(scale, scale, scale)
                const positionAttribute = geometry.getAttribute('position')
                const colors = []


                for (let i = 0; i < positionAttribute.count; i++) {
                    colors.push(1, 1, 1)
                }
                const colorAttribute = new THREE.Float32BufferAttribute(colors, 3)
                geometry.setAttribute('color', colorAttribute);
                const material = new THREE.MeshBasicMaterial({
                    vertexColors: true,
                    side: THREE.DoubleSide
                });
                const plyMesh = new THREE.Mesh(geometry, material);
                vm.scene.add(plyMesh)
                vm.renderer.render(vm.scene, vm.camera)
                vm.animate()
                console.log(geometry)
            })
            resolve()
        })
    }


    addFileWithSpecs = async (specs) => {
        console.log(specs)
        const vm = this
        // PointMarker
        const pointMarkerGeometry = new THREE.SphereGeometry(0.5);
        const pointMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pointMarker = new THREE.Mesh(pointMarkerGeometry, pointMarkerMaterial);
        pointMarker.visible = false
        pointMarker.uuid = 'PointMarker'


        // Mesh
        const meshSpecs = await EnvironmentService.getMeshFromSpecs(specs)
        const meshMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide })
        const meshGeometry = new THREE.BufferGeometry()
        meshGeometry.setAttribute('position',
            new THREE.BufferAttribute(
                new Float32Array(meshSpecs.vertices), 3
            )
        )
        meshGeometry.setAttribute('normal',
            new THREE.BufferAttribute(
                new Float32Array(meshSpecs.vertexNormals), 3
            )
        )
        meshGeometry.setAttribute('color',
            new THREE.BufferAttribute(
                new Float32Array(meshSpecs.vertexColors), 3
            )
        )
        meshGeometry.setAttribute('triNormal',
            new THREE.BufferAttribute(
                new Float32Array(meshSpecs.triangleNormals), 3
            )
        )
        meshGeometry.setIndex(
            new THREE.BufferAttribute(
                new Uint32Array(meshSpecs.triangles), 1
            )
        )
       
        const mesh = new THREE.Mesh(meshGeometry, meshMaterial)
        mesh.scale.set(1, 1, 1)
        mesh.position.set(
            specs.zero_vector[0],
            specs.zero_vector[1],
            specs.zero_vector[2]
        )
        mesh.uuid = 'MeshObject'


        // Groups
        const meshGroup = new THREE.Group()
        meshGroup.position.set(0, 0, 0)
        meshGroup.scale.set(1, 1, 1)
        meshGroup.uuid = 'MeshGroup'
        meshGroup.add(mesh)
        vm.scene.add(meshGroup)
    }


    addPlyFile_ = (path, visible=true) => {
        const vm_ = this
        return new Promise (async (resolve, reject) => {
            const loader = new PLYLoader()
            let vm = vm_
            console.log(path.split('/').pop())
            console.log(`../../parts/convertedfiles2/${path.split('/').pop()}.ply`)
            try {
                await loader.load(require(`../../parts/convertedfiles2/${path.split('/').pop()}.ply`), function (geometry) {
                    geometry.computeVertexNormals()
                    geometry.center()
                    const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x111111, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.uuid = path.split('_').pop().split('.')[0]
                   
                    //if (clearScene) SmallEnvironmentService.removeAllObjectFromSceneList(vm.scene, vm.camera, vm.renderer)
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
            console.log(this.props)
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


    onMouseDown = (event) => {
        if (this.mode === 'select' && event.button === 0) {
            this.isMouseDown = true
            this.mouseDownPosition.x = (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1
            this.mouseDownPosition.y = -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
        }
    }


    onMouseMove = (event) => {
        if (this.mode === 'select' && this.isMouseDown) {
            this.currentMousePosition.x = (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1
            this.currentMousePosition.y = -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
            this.drawSelectionRectangle(this.mouseDownPosition, this.currentMousePosition)
        }
    }


    onMouseUp = (event) => {
        if (this.mode === 'select' && this.isMouseDown) {
            this.isMouseDown = false
            this.selectTrianglesWithinRectangle(this.mouseDownPosition, this.currentMousePosition)
        }
    }


    onKeyDown = (event) => {
        if (event.key.toLowerCase() === 'l') {
            console.log(this)
        }
        else if (event.key.toLowerCase() === 't') {
            if (this.mode === 'move') {
                this.mode = 'select'
                this.controls.enabled = false
            }
            else {
                this.mode = 'move'
                this.controls.enabled = true
                this.selectionRectangleDiv.style.width = '0px'
                this.selectionRectangleDiv.style.height = '0px'
            }
        }
        else if (event.key.toLowerCase() === 'c') {
            this.scene.traverse(
                function (object) {
                    if (object instanceof THREE.Mesh) {
                        const geometry = object.geometry
                        const positionAttribute = geometry.attributes.position
                        const colors = []


                        for (let i = 0; i < positionAttribute.count; i++) {
                            colors.push(1, 1, 1)
                        }


                        const colorAttribute = new THREE.Float32BufferAttribute(colors, 3)
                        geometry.setAttribute('color', colorAttribute)
                        colorAttribute.needsUpdate = true
                    }
                }
            )
        }
       
    }


   
}


export default SmallEnvironmentService;

