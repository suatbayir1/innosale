import GUI from "lil-gui"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { stlLoader } from "three/examples/jsm/loaders/PLYLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

class ThreeJSService {
    constructor(props) {
        // ENVIRONMENT
        this.createScene()
        this.createCamera(props.camera)
        this.createRenderer(props.renderer)
        this.createOrbitControls()
        this.animate()

        this.isMouseDown = false
        this.controllerMode = "Move"
        this.raycaster = new THREE.Raycaster()
        this.mouseDownPosition = new THREE.Vector2()
        this.currentMousePosition = new THREE.Vector2()
        this.selectedColor = { 'r': 0, 'g': 0, 'b': 0 }
        this.processes_list = []

        window.addEventListener('mousedown', this.event_onMouseDown, false)
        window.addEventListener('mousemove', this.event_onMouseMove, false)
        window.addEventListener('mouseup', this.event_onMouseUp, false)
    }

    //#region ENVIRONMENT
    createScene = () => {
        const scene = new THREE.Scene()
        scene.uuid = 'scene'
        scene.background = new THREE.Color(0x72645b)

        this.scene = scene
    }

    createCamera = (props) => {
        const { fov, aspect, near, far } = props
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.uuid = 'camera'
        camera.lookAt(this.scene)
        camera.position.set(-30, 30, 30)

        this.camera = camera
    }

    createRenderer = (props) => {
        const { pixelRatio, width, height } = props
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.uuid = 'renderer'
        renderer.setPixelRatio(pixelRatio)
        renderer.setSize(width, height)
        renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.shadowMap.enabled = true

        this.renderer = renderer
    }

    createOrbitControls = () => {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.uuid = 'orbitControls'
        orbitControls.enableZoom = true
        orbitControls.zoomSpeed = 0.5
        orbitControls.enableDamping = true
        orbitControls.dampingFactor = 0.05
        orbitControls.screenSpacePanning = false
        orbitControls.minDistance = 1
        orbitControls.maxDistance = 1000
        orbitControls.update()

        this.orbitControls = orbitControls
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera)
    }
    //#endregion

    //#region Events
    drawSelectionRectangle = () => {
        const { mouseDownPosition, currentMousePosition } = this
        
        const minPosX = (Math.min(mouseDownPosition.x, currentMousePosition.x) + 1) / 2 * window.innerWidth;
        const maxPosX = (Math.max(mouseDownPosition.x, currentMousePosition.x) + 1) / 2 * window.innerWidth;
        const minPosY = (1 - Math.max(mouseDownPosition.y, currentMousePosition.y)) / 2 * window.innerHeight;
        const maxPosY = (1 - Math.min(mouseDownPosition.y, currentMousePosition.y)) / 2 * window.innerHeight;
      
        this.selectionDiv.style.left = `${minPosX}px`;
        this.selectionDiv.style.top = `${minPosY}px`;
        this.selectionDiv.style.width = `${maxPosX - minPosX}px`;
        this.selectionDiv.style.height = `${maxPosY - minPosY}px`;
    }

    delete_process = (processName) => {
        this.scene.traverse(object => {
            if (object.uuid === 'main_object') {
                const geometry = object.geometry
                const colorAttribute = geometry.attributes.color
                const positionAttribute = geometry.attributes.position
                
                for (let i = 0; i < positionAttribute.count; i += 3) {
                    if (this.processes_list[i] === processName) {
                        this.processes_list[i] = -1
                        colorAttribute.setXYZ(i, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 1, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 2, 0.5, 0.5, 0.5)
                    }
                }
                colorAttribute.needsUpdate = true
            }
        })
    }

    selectTrianglesWithinRectangle = async () => {
        const { mouseDownPosition, currentMousePosition } = this

        const minPosX = Math.min(mouseDownPosition.x, currentMousePosition.x);
        const maxPosX = Math.max(mouseDownPosition.x, currentMousePosition.x);
        const minPosY = Math.min(mouseDownPosition.y, currentMousePosition.y);
        const maxPosY = Math.max(mouseDownPosition.y, currentMousePosition.y);
        
        this.scene.traverse(object => {
            if (object.uuid === 'main_object') {
                const geometry = object.geometry
                const colorAttribute = geometry.attributes.color
                const positionAttribute = geometry.attributes.position
                
                for (let i = 0; i < positionAttribute.count; i += 3) {
                    const vertices = [
                        new THREE.Vector3().fromBufferAttribute(positionAttribute, i),
                        new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 1),
                        new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 2),
                    ]
        
                    const allVerticesInside = vertices.every(v => {
                        v.project(this.camera)
                        return v.x >= minPosX && v.x <= maxPosX && v.y >= minPosY && v.y <= maxPosY
                    })
                    
                    if (allVerticesInside) {
                        this.processes_list[i] = this.selected_process
                        colorAttribute.setXYZ(i, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        colorAttribute.setXYZ(i + 1, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        colorAttribute.setXYZ(i + 2, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        //this.bendIndexes[i] = this.selectedBend
                    }
                }
                colorAttribute.needsUpdate = true
            }
        })
        this.selectionDiv.style.width = '0px'
        this.selectionDiv.style.height = '0px'
        this.controllerMode = "Move"
        //await this.guiEnabled(true)
        console.log(this.processes)
    }

    event_onMouseDown = (event) => {
        if (this.controllerMode === 'Selection' && event.button === 0) {
            this.isMouseDown = true
            this.orbitControls.enabled = false
            this.mouseDownPosition.x = (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1
            this.mouseDownPosition.y = -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
        }
    }
    
    event_onMouseMove = (event) => {
        if (this.controllerMode === 'Selection' && this.isMouseDown) {
            this.currentMousePosition.x = (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1
            this.currentMousePosition.y = -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
            this.drawSelectionRectangle()
        }
    }
    
    event_onMouseUp = (event) => {
        if (this.controllerMode === 'Selection' && this.isMouseDown) {
            this.isMouseDown = false
            this.orbitControls.enabled = true
            this.selectTrianglesWithinRectangle()
        }
    }
    //#endregion

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000));
    }

    load_stl_file = (file_name) => {
        this.scene.children.forEach(object => {
            if (object.uuid === 'main_group') {
                this.scene.remove(object)
                this.animate()
            }
        })
        
        const vm_ = this
        return new Promise (async (resolve, reject) => {
            const vm = vm_
            const loader = new STLLoader()
            await loader.load(require(`../../data/stl/${file_name}`), function (geometry) {
                geometry.center()
                const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
                const boundingBoxSize = boundingBox.getSize(new THREE.Vector3())
                const maxAxisLength = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z)
                const scale = 10 / maxAxisLength;
                geometry.scale(scale, scale, scale)
                const positionAttribute = geometry.getAttribute('position')
                const colors = []

                vm.processes_list = Array(positionAttribute.count).fill(-1);
                for (let i = 0; i < positionAttribute.count; i++) {
                    colors.push(0.5, 0.5, 0.5)
                }
                
                const colorAttribute = new THREE.Float32BufferAttribute(colors, 3)
                geometry.setAttribute('color', colorAttribute);
                
                //const material = new THREE.MeshNormalMaterial({
                const material = new THREE.MeshBasicMaterial({
                    vertexColors: true,
                    side: THREE.DoubleSide
                })
                const wireframeMaterial = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })

                const wireframe = new THREE.Mesh(geometry, wireframeMaterial)
                const stlMesh = new THREE.Mesh(geometry, material)
                stlMesh.uuid = 'main_object'

                const group = new THREE.Group()
                group.uuid = 'main_group'
                group.add(stlMesh)
                group.add(wireframe)
                vm.scene.add(group)
                vm.animate()
                console.log(stlMesh)
                resolve(stlMesh)
            })
        })
    }
}

export default ThreeJSService;