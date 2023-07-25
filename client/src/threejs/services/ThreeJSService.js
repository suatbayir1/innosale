import GUI from "lil-gui"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

class ThreeJSService {
    constructor(props) {
        console.log(props)
        this.this = props.this
        this.left = undefined
        this.url_teklif_id = props.url_teklif_id
        this.axios = props.axios
        this.set_operation_process_dialog = props.set_operation_process_dialog
        this.isProcessesSynced = false
        this.setProcessesSynced(false)
        this.load_stl_list()
        // GUI
        this.initGUI()

        // ENVIRONMENT
        this.createScene()
        this.createCamera(props.camera)
        this.createRenderer(props.renderer)
        this.createOrbitControls()
        this.animate()

        this.isMouseDown = false
        this.raycaster = new THREE.Raycaster()
        this.mouseDownPosition = new THREE.Vector2()
        this.currentMousePosition = new THREE.Vector2()

        this.bendIndexes = [-1]
        this.selectedBend = {}

        this.operationTypes = [
            "10 (Açınım) - Açınım Kesme",
            "10 (Açınım) - Ön Açınım Kesme",
            "20 (Çekme) - Çekme",
            "30 (Bükme) - Bükme",
            "30 (Bükme) - Form Verme",
            "40 (Kesme) - Çevre Kesme",
            "40 (Kesme) - Delme",
            "30 (Bükme) - Kenarlama",
            "30 (Bükme) - Kalibre",
            "50 (Prog) - Progresif",
            "40 (Kesme) - Kamlı Kesme",
            "40 (Kesme) - Kamlı Delme",
            "30 (Bükme) - Kamlı Bükme",
            "60 (Mastar) - KONTROL FİKSTÜRÜ (SUPPORT)",
            "60 (Mastar) - KONTROL FİKSTÜRÜ (GELENEKSEL)",
            "70 (Kaynak) - PROJEKSİYON KAYNAK FİKSTÜRÜ",
            "70 (Kaynak) - GUJON KAYNAK FİKSTÜRÜ"
        ]

        window.addEventListener('mousedown', this.event_onMouseDown, false);
        window.addEventListener('mousemove', this.event_onMouseMove, false);
        window.addEventListener('mouseup', this.event_onMouseUp, false);
    }

    load_stl_list = async () => {
        return new Promise (async (resolve, reject) => {
            await this.axios.functions.get_stl_dict()

            while (true) {
                if (this.axios.params.stl_dict === {}) {
                    await this.wait_for_seconds(0.5)
                }
                else {
                    this.file_list = this.axios.params.stl_dict ? Object.keys(this.axios.params.stl_dict).map(key => {return key}) : []
                    break
                }
            }
            resolve()
        })        
    }

    initGUI = async () => {
        await this.load_stl_list()
        this.gui = new GUI()
        this.guiSelectedElements = {
            'deneme': this.set_operation_load,
            'File List': "Select a file",
            'Save Process Changes': this.saveBendChanges,
            'Load Process Changes': this.loadBendChanges,
            'Delete All Processes': this.deleteAllBends,
            'Add Process': this.addBend,
            'guiOperations': {
                'Add Operation': this.addOperation,
            },
        }
        
        this.gui.title("Controls")
        this.gui.add(this.guiSelectedElements, 'deneme')
        const fileList = this.gui.add(this.guiSelectedElements, "File List", this.file_list)
        fileList.$widget.style.color = "black"
        this.gui.add(this.guiSelectedElements, "Save Process Changes")
        this.gui.add(this.guiSelectedElements, "Load Process Changes")
        
        this.gui.add(this.guiSelectedElements, "Delete All Processes")
        this.guiOperations = this.gui.addFolder("Operations")
        this.guiOperations.add(this.guiSelectedElements.guiOperations, 'Add Operation')

        this.guiBends = this.gui.addFolder("Processes")
        this.guiBends.add(this.guiSelectedElements, "Add Process")

        this.guiEnabled(false, ['File List'])
        fileList.onChange(async () => {
            this.guiOperations.foldersRecursive().forEach(folder => { folder.destroy() })
            this.guiBends.foldersRecursive().forEach(folder => { folder.destroy() })
            
            this.guiSelectedElements.guiOperations = { 'Add Operation': this.addOperation }

            this.guiEnabled(false)
            this.fileLoader()
            this.deleteAllBends()
            this.loadBendChanges()
            this.fixTwiceBends()
        })
        fileList.setValue(this.url_teklif_id)
    }

    set_operation_load = async (operations_preset) => {
        this.guiOperations.foldersRecursive().forEach(folder => {
            folder.openAnimated(false)
        })
        this.guiSelectedElements.guiOperations = {}

        while (this.left === undefined) {
            await this.wait_for_seconds (0.5)
        }



        operations_preset?.operations?.forEach(operation => {
            this.guiSelectedElements.guiOperations[operation['Title']] = {
                'Operation Type': operation['Operation Type'],
                'Edit Operation': () => this.editOperation(operation['Title']),
                'Delete Operation': () => this.deleteOperation(operation['Title']),
                'Processes': operation['Processes']
            }


            operation['Processes'].forEach(bend => {
                const index = this.left.indexOf(bend);
                if (index > -1) {
                    this.left.splice(index, 1)
                }
            })
            this.this.setState({ left: this.left })

            const operationFolder = this.guiOperations.addFolder(operation['Title'])
            const operationTypeSelect = operationFolder.add(this.guiSelectedElements.guiOperations[operation['Title']], 'Operation Type', this.operationTypes)
            operationTypeSelect.onChange(this.save_operations_to_database)
            operationTypeSelect.$widget.style.color = "black"

            operationFolder.add(this.guiSelectedElements.guiOperations[operation['Title']], 'Edit Operation')
            operationFolder.add(this.guiSelectedElements.guiOperations[operation['Title']], 'Delete Operation')
            const processesOfOperationFolder = operationFolder.addFolder("Processes")
            
            let functions = {}
            console.log(operation)
            operation.Processes.forEach(process => {
                functions[process] = () => {
                    processesOfOperationFolder.controllersRecursive().forEach(controller => {
                        if (controller.$name.innerHTML.toString() === process.toString()) {
                            const index = this.guiSelectedElements.guiOperations[operation['Title']].Processes.indexOf(process);
                            if (index > -1) {
                                this.this.setState({ left: [...this.this.state.left, process] })
                                this.guiSelectedElements.guiOperations[operation['Title']].Processes.splice(index, 1)
                                controller.destroy()
                            }
                        }
                    })
                }
                processesOfOperationFolder.add(functions, process)
            })

            processesOfOperationFolder.onOpenClose(() => {})

            operationFolder.onOpenClose(changedGUI => {
                if (!changedGUI._closed) {
                    this.guiOperations.folders.forEach(folder => {
                        if (changedGUI.$title.innerHTML.startsWith('Operation: ')) {
                            folder.folders.forEach(subFolder => subFolder.open(true))
                            if (changedGUI.$title.innerHTML !== folder.$title.innerHTML) {
                                folder.openAnimated(false)
                            }
                        }
                    })
                }
            })
            operationFolder.close(true)
        })
    }

    addOperation = () => {
        this.guiOperations.foldersRecursive().forEach(folder => {
            folder.openAnimated(false)
        })
        
        let latestOperationNumber = 0
        this.guiOperations.folders.forEach(folder => {
            if (folder.$title.innerHTML.startsWith('Operation: ')) {
                let operationNumber = parseInt(folder.$title.innerHTML.split(" ")[1])
                if (operationNumber > latestOperationNumber) latestOperationNumber = operationNumber
            }
        })
        let folderNumber = latestOperationNumber + 1
        
        const operationFolder = this.guiOperations.addFolder(`Operation: ${folderNumber}`)
        this.guiSelectedElements.guiOperations[`Operation: ${folderNumber}`] = {
            'Operation Type': 'Select a type',
            'Edit Operation': () => this.editOperation(`Operation: ${folderNumber}`),
            'Delete Operation': () => this.deleteOperation(`Operation: ${folderNumber}`),
            'Processes': []
        }

        const operationTypeSelect = operationFolder.add(this.guiSelectedElements.guiOperations[`Operation: ${folderNumber}`], 'Operation Type', this.operationTypes)
        operationTypeSelect.$widget.style.color = "black"
        
        operationFolder.add(this.guiSelectedElements.guiOperations[`Operation: ${folderNumber}`], 'Edit Operation')
        operationFolder.add(this.guiSelectedElements.guiOperations[`Operation: ${folderNumber}`], 'Delete Operation')
        const processesOfOperationFolder = operationFolder.addFolder("Processes")
        processesOfOperationFolder.onOpenClose(() => {})

        operationFolder.onOpenClose(changedGUI => {
            if (!changedGUI._closed) {
                this.guiOperations.folders.forEach(folder => {
                    if (changedGUI.$title.innerHTML.startsWith('Operation: ')) {
                        folder.folders.forEach(subFolder => subFolder.open(true))
                        if (changedGUI.$title.innerHTML !== folder.$title.innerHTML) {
                            folder.openAnimated(false)
                        }
                    }
                })
            }
        })
    }

    editOperation = (operationName) => {
        this.last_operation_edit = operationName;
        const left = this.this.state.left
        const right = this.guiSelectedElements.guiOperations[operationName].Processes
        let header = this.guiSelectedElements.guiOperations[operationName]['Operation Type']
        header = header === "Select a type" ? operationName : `${operationName}	|	${header}`

        this.this.setState({
            delete_approval: true,

            left: left,
            right: right,
            dialogHeader: header
        }, this.save_operations_to_database)
    }

    save_edit_result = (props) => {
        this.guiSelectedElements.guiOperations[this.last_operation_edit].Processes = props.right

        this.guiOperations.folders.forEach(folder => {
            console.log("Folder", folder.$title.innerHTML)
            
            folder.folders.forEach(subFolder => {
                if (subFolder.$title.innerHTML === "Processes") {
                    subFolder.controllersRecursive().forEach(controller => controller.destroy())
                    
                    let functions = {}
                    this.guiSelectedElements.guiOperations[folder.$title.innerHTML].Processes.forEach(process => {
                        functions[process] = () => {
                            subFolder.controllersRecursive().forEach(controller => {
                                if (controller.$name.innerHTML.toString() === process.toString()) {
                                    const index = this.guiSelectedElements.guiOperations[folder.$title.innerHTML].Processes.indexOf(process);
                                    console.log(process)
                                    console.log(index)
                                    if (index > -1) {
                                        this.this.setState({ left: [...this.this.state.left, process] })
                                        this.guiSelectedElements.guiOperations[folder.$title.innerHTML].Processes.splice(index, 1)
                                        controller.destroy()
                                    }
                                }
                            })
                        }
                        subFolder.add(functions, process)
                    })
                }
            })
        })
    }

    deleteOperation = (operationName) => {
        this.this.setState({
            delete_approval: false,
            left: [...this.this.state.left, ...this.guiSelectedElements.guiOperations[operationName].Processes],
            right: []
        }, () => {
            this.guiOperations.folders.forEach(folder => {
                if (folder.$title.innerHTML === operationName) {
                    folder.destroy()
                    return
                }
            })
        })
        
    }

    save_operations_to_database = () => {
        this.axios.functions.save_preset({
            filePath: "/root/innosale/client/src/data/stl/" + this.filePath,
            operations: Object.keys(this.guiSelectedElements.guiOperations).map(key => {
                if (typeof this.guiSelectedElements.guiOperations[key] === typeof {})
                    return {
                        "Title": key,
                        "Operation Type": this.guiSelectedElements.guiOperations[key]["Operation Type"],
                        "Processes": this.guiSelectedElements.guiOperations[key]["Processes"]
                    }
                else
                    return null
            }).filter(value => {return value !== null})
        })
    }

    fixTwiceBends = async () => {
        let uniqueFolders = []

        this.guiBends.foldersRecursive(folder => {
            if (uniqueFolders.includes(folder.$title.innerHTML))
                folder.destroy()
            else
                uniqueFolders.push(folder.$title.innerHTML)
        })
    }

    saveBendChanges = async () => {
        this.guiEnabled(false)
        const bends = this.guiBends.foldersRecursive().map(folder => {
            let element = {}
            
            if (folder.$title.innerHTML.startsWith('Process: ')) {
                folder.controllersRecursive().forEach(controller => {
                    element['Title'] = folder.$title.innerHTML
                    if (controller.$name.innerHTML === 'Name')
                        element['Name'] = controller.getValue()
                    if (controller.$name.innerHTML === 'Color')
                        element['Color'] = controller.getValue()
                })
                return element
            }
            else {
                return null
            }
        }).filter(element => { return element !== null })

        console.log(this.bendIndexes)
        console.log(bends)

        this.axios.functions.save_part_bends({
            'bendIndexes': this.bendIndexes,
            'bends': bends,
            'path': this.object_path
        })
        await this.wait_for_seconds(2.5)
        this.guiEnabled(true)
        this.setProcessesSynced(true)
    }

    convertToHex = (rgb) => {
        var r = Math.round(rgb.r * 255);
        var g = Math.round(rgb.g * 255);
        var b = Math.round(rgb.b * 255);
        
        var hexR = r.toString(16).padStart(2, '0');
        var hexG = g.toString(16).padStart(2, '0');
        var hexB = b.toString(16).padStart(2, '0');
        
        var hexCode = '#' + hexR + hexG + hexB;
        return hexCode;
      }

    loadBendChanges = () => {
        this.guiEnabled(false)
        this.deleteAllBends()
        var left = []
        this.axios.functions.load_part_bends({ 'path': this.object_path })
            .then(result => {
                this.bendIndexes = result.bend_indexes
                
                result?.bends?.forEach(bend => {
                    left.push(bend['Name'])
                    const bendFolder = this.guiBends.addFolder(bend['Title'])
                    bendFolder.open(false)
                    bendFolder.onOpenClose(changedGUI => {
                        if (!changedGUI._closed) {
                            this.guiBends.folders.forEach(folder => {
                                if (changedGUI.$title.innerHTML !== folder.$title.innerHTML) {
                                    folder.openAnimated(false)
                                }
                            })
                        }
                    })
                    this.guiSelectedElements[bend['Title']] = {
                        'Name': bend['Name'],
                        'Color': bend['Color'],
                        'Delete Process': () => { this.deleteBend(bendFolder) },
                        'Reselect Process': () => { this.reselectBend(bendFolder) }
                    }

                    const nameController = bendFolder.add(this.guiSelectedElements[bend['Title']], 'Name')
                    const colorController = bendFolder.addColor(this.guiSelectedElements[bend['Title']], 'Color')
                    bendFolder.add(this.guiSelectedElements[bend['Title']], 'Delete Process')
                    bendFolder.add(this.guiSelectedElements[bend['Title']], 'Reselect Process')
                    bendFolder.$title.style.color = this.convertToHex(bend['Color'])

                    nameController.onFinishChange(value => {this.setProcessesSynced(false)})

                    colorController.onChange(value => {
                        this.setProcessesSynced(false)
                        bendFolder.$title.style.color = this.convertToHex(value)
                        this.scene.traverse(object => {
                            if (object.uuid === 'main_object') {
                                const geometry = object.geometry
                                const colorAttribute = geometry.attributes.color
                                const positionAttribute = geometry.attributes.position
                                
                                for (let i = 0; i < positionAttribute.count; i += 3) {
                                    if (this.bendIndexes[i] === bend['Title']) {
                                        colorAttribute.setXYZ(i, value.r, value.g, value.b)
                                        colorAttribute.setXYZ(i + 1, value.r, value.g, value.b)
                                        colorAttribute.setXYZ(i + 2, value.r, value.g, value.b)
                                    }
                                }
                                colorAttribute.needsUpdate = true
                            }
                        })
                    })

                    this.scene.traverse(object => {
                        if (object.uuid === 'main_object') {
                            const geometry = object.geometry
                            const colorAttribute = geometry.attributes.color
                            const positionAttribute = geometry.attributes.position
                            
                            for (let i = 0; i < positionAttribute.count; i += 3) {
                                if (this.bendIndexes[i] === bend['Title']) {
                                    colorAttribute.setXYZ(i, bend['Color'].r, bend['Color'].g, bend['Color'].b)
                                    colorAttribute.setXYZ(i + 1, bend['Color'].r, bend['Color'].g, bend['Color'].b)
                                    colorAttribute.setXYZ(i + 2, bend['Color'].r, bend['Color'].g, bend['Color'].b)
                                }
                            }
                            colorAttribute.needsUpdate = true
                        }
                    })
                })
                this.guiEnabled(true)
            })
            .finally(() => {
                this.this.setState({ left: left })
                this.left = left

                
            })
        this.setProcessesSynced(true)
    }

    setProcessesSynced = async (value) => {
        this.isProcessesSynced = value
        await this.wait_for_seconds(1.5)

        this.guiOperations?.controllersRecursive().forEach(controller => {
            controller.disable(!value)
        })
    }

    addBend = async () => {
        this.guiBends.folders.forEach(folder => {
            folder.openAnimated(false)
        })
        this.selectedColor = this.generateRandomDarkColor()
        let latestBendNumber = 0
        this.guiBends.foldersRecursive().forEach(folder => {
            if (folder.$title.innerHTML.startsWith('Process: ')) {
                let bendNumber = parseInt(folder.$title.innerHTML.split(" ")[1])
                if (bendNumber > latestBendNumber) latestBendNumber = bendNumber
            }
        })
        let folderNumber = latestBendNumber + 1
        this.selectedBend = `Process: ${folderNumber}`

        const bendFolder = this.guiBends.addFolder(`Process: ${folderNumber}`)
        bendFolder.onOpenClose(changedGUI => {
            if (!changedGUI._closed) {
                this.guiBends.folders.forEach(folder => {
                    if (changedGUI.$title.innerHTML !== folder.$title.innerHTML) {
                        folder.openAnimated(false)
                    }
                })
            }
        })
        this.guiSelectedElements[`Process: ${folderNumber}`] = {
            'Name': `Process: ${folderNumber}`,
            'Color': this.selectedColor,
            'Delete Process': () => { this.deleteBend(bendFolder) },
            'Reselect Process': () => { this.reselectBend(bendFolder) }
        }

        bendFolder.add(this.guiSelectedElements[`Process: ${folderNumber}`], 'Name')
        const colorController = bendFolder.addColor(this.guiSelectedElements[`Process: ${folderNumber}`], 'Color')
        bendFolder.add(this.guiSelectedElements[`Process: ${folderNumber}`], 'Delete Process')
        bendFolder.add(this.guiSelectedElements[`Process: ${folderNumber}`], 'Reselect Process')
        bendFolder.$title.style.color = this.convertToHex(this.selectedColor)

        colorController.onChange(value => {
            bendFolder.$title.style.color = this.convertToHex(value)
            this.scene.traverse(object => {
                if (object.uuid === 'main_object') {
                    const geometry = object.geometry
                    const colorAttribute = geometry.attributes.color
                    const positionAttribute = geometry.attributes.position
                    
                    for (let i = 0; i < positionAttribute.count; i += 3) {
                        if (this.bendIndexes[i] === `Process: ${folderNumber}`) {
                            colorAttribute.setXYZ(i, value.r, value.g, value.b)
                            colorAttribute.setXYZ(i + 1, value.r, value.g, value.b)
                            colorAttribute.setXYZ(i + 2, value.r, value.g, value.b)
                        }
                    }
                    colorAttribute.needsUpdate = true
                }
            })
        })

        await this.guiEnabled(false)
        this.controllerMode = 'Selection'
    }

    deleteBend = async (bendFolder) => {
        this.setProcessesSynced(false)
        this.scene.traverse(object => {
            if (object.uuid === 'main_object') {
                const geometry = object.geometry
                const colorAttribute = geometry.attributes.color
                const positionAttribute = geometry.attributes.position
                
                for (let i = 0; i < positionAttribute.count; i += 3) {
                    if (this.bendIndexes[i] === bendFolder.$title.innerHTML) {
                        colorAttribute.setXYZ(i, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 1, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 2, 0.5, 0.5, 0.5)
                        this.bendIndexes[i] = -1
                    }
                }
                colorAttribute.needsUpdate = true
            }
        })
        bendFolder.destroy()
        await this.guiEnabled(true)
    }

    reselectBend = async (bendFolder) => {
        
        await this.guiEnabled(false)
        this.selectedBend = bendFolder.$title.innerHTML
        console.log(this.selectedBend)
        this.scene.traverse(object => {
            if (object.uuid === 'main_object') {
                const geometry = object.geometry
                const colorAttribute = geometry.attributes.color
                const positionAttribute = geometry.attributes.position
                console.log(colorAttribute)
                console.log(this.bendIndexes)
                
                for (let i = 0; i < positionAttribute.count; i += 3) {
                    if (this.bendIndexes[i] === bendFolder.$title.innerHTML) {
                        colorAttribute.setXYZ(i, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 1, 0.5, 0.5, 0.5)
                        colorAttribute.setXYZ(i + 2, 0.5, 0.5, 0.5)
                        this.bendIndexes[i] = -1
                    }
                }
                colorAttribute.needsUpdate = true
            }
        })

        bendFolder.controllersRecursive().forEach(controller => {
            if (controller._name === 'Color') {
                this.selectedColor = controller.getValue()
                this.controllerMode = "Selection"
            }
        })
        this.setProcessesSynced(false)
    }

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

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000));
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
                //console.log(geometry)
                //console.log(colorAttribute)
                //console.log(positionAttribute)
                
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
                        colorAttribute.setXYZ(i, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        colorAttribute.setXYZ(i + 1, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        colorAttribute.setXYZ(i + 2, this.selectedColor.r, this.selectedColor.g, this.selectedColor.b)
                        this.bendIndexes[i] = this.selectedBend
                    }
                }
                colorAttribute.needsUpdate = true
            }
        })
        this.selectionDiv.style.width = '0px'
        this.selectionDiv.style.height = '0px'
        this.controllerMode = "Move"
        await this.guiEnabled(true)
    }

    generateRandomDarkColor = () => {
        var r = Math.floor(Math.random() * 128);
        var g = Math.floor(Math.random() * 128);
        var b = Math.floor(Math.random() * 128);

        return { 'r': r / 255, 'g': g / 255, 'b': b / 255 }
    }

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

    deleteAllBends = () => {
        this.scene.traverse(object => {
            if (object.uuid === 'main_object') {
                const geometry = object.geometry
                const positionAttribute = geometry.attributes.position
                this.bendIndexes = new Array(positionAttribute.count).fill(-1)

                const colors = new Array(positionAttribute.count * 3).fill(0.5);
                const colorAttribute = new THREE.Float32BufferAttribute(colors, 3)

                geometry.setAttribute('color', colorAttribute)
                colorAttribute.needsUpdate = true
            }
        })
        this.guiBends.foldersRecursive().forEach(folder => {
            folder.destroy()
        })
        
        this.setProcessesSynced(false)
    }

    guiEnabled = (state, excludeList=[]) => {
        return new Promise (async (resolve, reject) => {
            this.gui.controllersRecursive().forEach(controller => {
                if (excludeList.length > 0) {
                    excludeList.forEach(exclude => {
                        if (controller.$name.innerHTML !== exclude)
                            controller.enable(state)
                    })
                } else controller.enable(state)
            })
            resolve()
        })

    }

    addStlFile = (path) => {
        this.object_path = path
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
            await loader.load(require(`../../data/stl/${path}`), function (geometry) {
                geometry.center()
                const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
                const boundingBoxSize = boundingBox.getSize(new THREE.Vector3())
                const maxAxisLength = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z)
                const scale = 5 / maxAxisLength;
                geometry.scale(scale, scale, scale)
                const positionAttribute = geometry.getAttribute('position')
                const colors = []

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
                const plyMesh = new THREE.Mesh(geometry, material)
                plyMesh.uuid = 'main_object'

                const group = new THREE.Group()
                group.uuid = 'main_group'
                group.add(plyMesh)
                group.add(wireframe)
                vm.scene.add(group)
                vm.animate()
                resolve(plyMesh)
            })
        })
    }

    fileLoader = async () => {
        this.filePath = this.axios.params.stl_dict[this.guiSelectedElements["File List"]]
        this.axios.functions.load_preset({ 'filePath': "/root/innosale/client/src/data/stl/" + this.filePath })
        
        await this.addStlFile(this.filePath).then(mesh => {
            const geometry = mesh.geometry
            const positionAttribute = geometry.attributes.position
            this.bendIndexes = new Array(positionAttribute.count).fill(-1)
            console.log(positionAttribute)
            console.log(this.bendIndexes)
        }).then(() => {
            this.set_operation_load(this.axios.params.operations_preset)
        })
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

}

export default ThreeJSService;