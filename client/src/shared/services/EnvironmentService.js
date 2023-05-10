import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

class EnvironmentService {
    constructor(sceneList, camera, renderer) {
        this.camera = camera
        this.renderer = renderer
        this.sceneList = sceneList
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
    }

    static createSceneList = () => {
        const sceneList = {
            'Mesh': new THREE.Scene(),
            'Point': new THREE.Scene(),
        }
        
        Object.keys(sceneList).forEach(async sceneName => {
            sceneList[sceneName].uuid = sceneName + 'Scene'
            sceneList[sceneName].background = new THREE.Color(0x72645b)

            const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff)
            hemisphereLight.uuid = 'HemisphereLight'
            sceneList[sceneName].add(hemisphereLight)
        })
        return sceneList;
    }
    
    static createScene = () => {
        const scene = new THREE.Scene();
        return scene;
    }
    
    static createCamera = (fov, aspect, near, far) => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.lookAt(EnvironmentService.createScene())
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

    static removeAllObjectFromSceneList = async (sceneList, camera, renderer) => {
        const exludeList = ["DirectionalLight", "HemisphereLight"]

        Object.keys(sceneList).forEach(
            async (sceneName) => {
                let scene = sceneList[sceneName]

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
        )
    }

    static editObjecInSceneList = async (sceneList, camera, renderer, changeKey, guiObject, clusterIndexes=undefined, clusterIndex=0, newColor=[0,0,0]) => {
        console.log(clusterIndexes)
        console.log(newColor)
        
        const groupList = Object.keys(sceneList).map((key) => { return key + 'Group' })

        Object.keys(sceneList).forEach(
            async (sceneName) => {
                let scene = sceneList[sceneName]

                if (scene !== undefined) {
                    for (let i = scene.children.length - 1; i >= 0; i--) {
                        if (groupList.includes(scene.children[i].uuid)) {
                            let object = scene.children[i]

                            switch (changeKey) {
                                case 'Scene Type':
                                    guiObject.SelectedPointIndex = undefined
                                    break
                                case 'Scale':
                                    object.scale.set(guiObject['Scale'], guiObject['Scale'], guiObject['Scale'])
                                    break
                                case 'Visible':
                                    object.visible = guiObject['Visible']
                                    break
                                case 'Position X':
                                    object.position.setX(guiObject['Position X'])
                                    break
                                case 'Position Y':
                                    object.position.setY(guiObject['Position Y'])
                                    break
                                case 'Position Z':
                                    object.position.setZ(guiObject['Position Z'])
                                    break
                                case 'Rotation X':
                                case 'Rotation Y':
                                case 'Rotation Z':
                                    object.rotation.set(
                                        guiObject['Rotation X'],
                                        guiObject['Rotation Y'],
                                        guiObject['Rotation Z']    
                                    )
                                    break
                                default:
                                    if (clusterIndexes !== undefined) {
                                        const color = new THREE.Color(guiObject['Color'].r, guiObject['Color'].g, guiObject['Color'].b)

                                        if (guiObject['Scene Type'] === 'Point' && sceneName === 'Point') {
                                            const pointCloud = EnvironmentService.findObjectFromGroupInSceneByUuid(scene, 'PointGroup', 'PointCloud')
                                            const markerMesh = EnvironmentService.findObjectFromGroupInSceneByUuid(scene, 'PointGroup', 'PointMarker')
                                            const oldColor = new THREE.Color(
                                                pointCloud.geometry.attributes.color.array[guiObject.SelectedPointIndex * 3],
                                                pointCloud.geometry.attributes.color.array[guiObject.SelectedPointIndex * 3 + 1],
                                                pointCloud.geometry.attributes.color.array[guiObject.SelectedPointIndex * 3 + 2]
                                            )
                                            markerMesh.material.color.set(color)

                                            for (let i = 0; i < pointCloud.geometry.attributes.color.array.length; i += 3) {
                                                if (pointCloud.geometry.attributes.color.array[i] === oldColor.r) {
                                                    if (pointCloud.geometry.attributes.color.array[i + 1] === oldColor.g) {
                                                        if (pointCloud.geometry.attributes.color.array[i + 2] === oldColor.b) {

                                                            pointCloud.geometry.attributes.color.array[i] = guiObject['Color'].r
                                                            pointCloud.geometry.attributes.color.array[i + 1] = guiObject['Color'].g
                                                            pointCloud.geometry.attributes.color.array[i + 2] = guiObject['Color'].b
                                                        }
                                                    }
                                                }
                                            }
                                            pointCloud.geometry.attributes.color.needsUpdate = true
                                        }
                                        else if (guiObject['Scene Type'] === 'Mesh' && sceneName === 'Mesh') {
                                            console.log(clusterIndexes)
                                            console.log(newColor)
                                            
                                                const meshObject = EnvironmentService.findObjectFromGroupInSceneByUuid(scene, 'MeshGroup', 'MeshObject')
                                                for (let i = 0; i < clusterIndexes.length; i++) {
                                                    if (clusterIndexes[i] === clusterIndex) {
                                                        meshObject.geometry.attributes.color.array[i * 3] = newColor[0]
                                                        meshObject.geometry.attributes.color.array[i * 3 + 1] = newColor[1]
                                                        meshObject.geometry.attributes.color.array[i * 3 + 2] = newColor[2]
                                                    }                                                    
                                                }
                                                meshObject.geometry.attributes.color.needsUpdate = true
                                            
                                        }
                                    }
                                    break
                            }
                        }
                    }
                    await renderer.render(scene, camera)
                }
            }
        )
    }

    static findObjectFromSceneByUuid = (scene, uuid) => {
        if (scene !== undefined) {
            for (let i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].uuid === uuid) {
                    return scene.children[i];
                }
            }
        }
        return null;
    }

    static findObjectFromGroupInSceneByUuid = (scene, groupUuid, objectUuid) => {
        if (scene !== undefined) {
            for (let i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].uuid === groupUuid) {
                    let object = scene.children[i]
                    return EnvironmentService.findObjectFromSceneByUuid(object, objectUuid)
                }
            }
        }
        return null;
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

    static getPointCloudFromSpecs = (specs) => {
        var pointCloudSpecs = {
            'vertexColors': [],
            'vertexPositions': []
        }

        for (let i = 0; i < specs.pointcloud_colors.length; i++) {
            for (let j = 0; j < 3; j++) {
                pointCloudSpecs.vertexColors.push(specs.pointcloud_colors[i][j])
            }
            pointCloudSpecs.vertexPositions.push(
                new THREE.Vector3(
                    specs.pointcloud_positions[i][0],
                    specs.pointcloud_positions[i][1],
                    specs.pointcloud_positions[i][2]
                )
            )
        }

        return pointCloudSpecs
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

    static getMeshFromSpecs = (specs) => {
        var meshSpecs = {
            'vertices': [],
            'triangles': [],
            'triangleNormals': [],
            'vertexColors': [],
            'vertexNormals': [],
            'uniqueColors': []
        }

        for (let i = 0; i < specs.mesh_vertices.length; i++) {
            for (let j = 0; j < 3; j++) {
                meshSpecs.vertices.push(specs.mesh_vertices[i][j])
                meshSpecs.vertexNormals.push(specs.mesh_vertex_normals[i][j])
                meshSpecs.vertexColors.push(specs.mesh_vertex_colors[i][j])
            }

            let subList = specs.mesh_vertex_colors[i].slice()
            if (!EnvironmentService.includesSubList(subList, meshSpecs.uniqueColors)) {
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

    addFileWithSpecs = async (specs) => {
        console.log(specs)
        const vm = this

        // PointCloud
        const pointCloudSpecs = EnvironmentService.getPointCloudFromSpecs(specs)
        const pointCloudMaterial = new THREE.PointsMaterial({ vertexColors: true, size: 3, sizeAttenuation: false })
        const pointCloudGeometry = new THREE.BufferGeometry().setFromPoints(pointCloudSpecs.vertexPositions)
        pointCloudGeometry.setAttribute('color',
            new THREE.BufferAttribute(
                new Float32Array(pointCloudSpecs.vertexColors), 3
            )
        )
        const pointCloud = new THREE.Points(pointCloudGeometry, pointCloudMaterial)
        pointCloud.scale.set(1, 1, 1)
        pointCloud.position.set(
            specs.zero_vector[0],
            specs.zero_vector[1],
            specs.zero_vector[2]
        )
        pointCloud.uuid = 'PointCloud'

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
        const pointGroup = new THREE.Group()
        pointGroup.position.set(0, 0, 0)
        pointGroup.scale.set(1, 1, 1)
        pointGroup.uuid = 'PointGroup'
        pointGroup.add(pointCloud)
        pointGroup.add(pointMarker)
        vm.sceneList.Point.add(pointGroup)

        const meshGroup = new THREE.Group()
        meshGroup.position.set(0, 0, 0)
        meshGroup.scale.set(1, 1, 1)
        meshGroup.uuid = 'MeshGroup'
        meshGroup.add(mesh)
        vm.sceneList.Mesh.add(meshGroup)
    }
}

export default EnvironmentService;