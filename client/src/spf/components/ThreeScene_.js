import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class ThreeScene_ {
    static createScene = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x72645b);
        
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
        hemisphereLight.uuid = "HemisphereLight"
        scene.add(hemisphereLight);
        return scene;
    }
    
    static createCamera = (fov, aspect, near, far) => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        //camera.lookAt(ThreeScene_.createScene())
        //camera.position.set(-30, 30, 30)
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

    static getMeshFromSpecs = (specs) => {
        var meshSpecs = {
            'vertices': [],
            'triangles': [],
            'triangleNormals': [],
            'vertexColors': [],
            'vertexNormals': [],
            'uniqueColors': []
        }
        console.log(specs)
        for (let i = 0; i < specs.mesh_vertices.length; i++) {
            for (let j = 0; j < 3; j++) {
                meshSpecs.vertices.push(specs.mesh_vertices[i][j])
                meshSpecs.vertexNormals.push(specs.mesh_vertex_normals[i][j])
                meshSpecs.vertexColors.push(specs.mesh_vertex_colors[i][j])
            }

            let subList = specs.mesh_vertex_colors[i].slice()
            if (!ThreeScene_.includesSubList(subList, meshSpecs.uniqueColors)) {
                meshSpecs.uniqueColors.push(subList);
            }
        }
        for (let i = 0; i < specs.mesh_triangles.length; i++) {
            for (let j = 0; j < 3; j++) {
                meshSpecs.triangles.push(specs.mesh_triangles[i][j])
                meshSpecs.triangleNormals.push(specs.mesh_triangle_normals[i][j])
            }
        }

        return meshSpecs
    }

    static includesSubList = (subList, subSubList) => {
        for (let i = 0; i < subSubList.length; i++) {
            let equal = true
            let otherSubList = subSubList[i]

            if (subList.length !== otherSubList.length) {
                equal = false
            }
            else {
                for (let j = 0; j < subList.length; j++) {
                    if (subList[j] !== otherSubList[j]) {
                        equal = false
                        break
                    }
                }
            }
            if (equal) return true
        }
        return false
    }

    static removeAllObjectFromSceneList = async (scene, camera, renderer) => {
        const exludeList = ["DirectionalLight", "HemisphereLight"]

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

    constructor(props) {
        this.props = props
        this.scene = ThreeScene_.createScene()
        this.camera = ThreeScene_.createCamera(75, props.width / props.height, 0.1, 2000)
        this.renderer = ThreeScene_.createRenderer(1, props.width, props.height)
        this.createOrbitControl(this.camera, this.renderer.domElement)
        console.log(this.props)
        this.appendChildLoop(this.renderer);
        
    }

    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    appendChildLoop = async (renderer) => {
        if (this.props.partModelPreviewScene) {
            this.props.partModelPreviewScene.appendChild(renderer.domElement)
            return
        }
        else {
            await this.wait_for_seconds(0.2)
            this.appendChildLoop(renderer)            
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);              
        this.renderer.render(this.scene, this.camera);
    }

    createOrbitControl = (camera, dom) => {
        let controls = new OrbitControls(camera, dom)
        controls.enableZoom = true
        controls.zoomSpeed = 2.5
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.screenSpacePanning = false
        controls.minDistance = 1
        controls.maxDistance = 1000
        controls.update()

        return controls;
    }

    setDisplayPart = async (specs, clear_scene=true, uuid="mesh") => {
        if (clear_scene) ThreeScene_.removeAllObjectFromSceneList(this.scene, this.camera, this.renderer)
        const meshSpecs = await ThreeScene_.getMeshFromSpecs(specs)
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
        mesh.uuid = `MeshObject_${uuid}`
        const meshGroup = new THREE.Group()
        meshGroup.position.set(0, 0, 0)
        meshGroup.scale.set(1, 1, 1)
        meshGroup.uuid = `MeshGroup_${uuid}`
        meshGroup.add(mesh)
        this.scene.add(meshGroup)
        this.animate()
    }
}

export default ThreeScene_;