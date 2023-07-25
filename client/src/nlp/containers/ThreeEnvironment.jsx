import React, { Component } from "react";
import { connect } from "react-redux";
import { EnvironmentService } from "../../shared/services";

import GUI from "lil-gui";
import * as THREE from "three";
import { PLYExporter } from "../containers/PLYExporter";

import withRouter from "../../shared/hoc/withRouter";
import {
    getFileSpecs,
    getFileList,
    getTeklifId,
    editPartInMongoDb,
    getPartProcessList,
} from "../../store/index";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

class ThreeEnvironment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gui: new GUI(), ///* GUI komple düzenlenecek
            sceneList: EnvironmentService.createSceneList(),
            camera: EnvironmentService.createCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                2000
            ),
            renderer: EnvironmentService.createRenderer(
                window.devicePixelRatio || 1,
                window.innerWidth,
                window.innerHeight
            ),
        };

        this.objects = {};
        console.log(this);
        this.mainGUISelected = {
            "File Name": "Choose a file",
            "Scene Type": "Mesh",
            SelectedPointIndex: undefined,

            Visible: true,
            Scale: 1,
            Color: { r: 0, g: 0, b: 0 },
            "Position X": 0,
            "Position Y": 0,
            "Position Z": 0,
            "Rotation X": 0,
            "Rotation Y": 0,
            "Rotation Z": 0,

            "Teklif ID": this.props.params.teklif_id,
            "Import Button": this.onImportButtonClick,
            "Export Button": this.onExportButtonClick,
            "Save to Database": this.saveToDatabase,
        };
        this.Clusters = [];
    }

    //#region GUI

    initMainGUI = (clusterData) => {
        this.state.gui.destroy();

        this.setState({ gui: new GUI({ touchStyles: false }) }, () => {
            const { gui } = this.state;

            gui.title("Model Objects");
            const importFolder = gui.addFolder("Import / Export");
            console.log(this.props.teklifIdList);
            const folder1 = importFolder.addFolder("folder1");
            const folder2 = folder1.addFolder("folder2");
            const folder3 = folder2.addFolder("folder 3");

            importFolder.add(
                this.mainGUISelected,
                "Teklif ID",
                Object.keys(this.props.teklifIdList)
            ).$widget.style.color = "black";
            importFolder.add(this.mainGUISelected, "Import Button");
            importFolder.add(this.mainGUISelected, "Export Button").enable(false);

            gui.add(
                this.mainGUISelected,
                "Scene Type",
                Object.keys(this.state.sceneList)
            ).$widget.style.color = "black";

            gui.add(this.mainGUISelected, "Scale", 0.0005, 1.5);
            gui.add(this.mainGUISelected, "Visible");
            //gui.addColor(this.mainGUISelected, 'Color')
            const positionFolder = gui.addFolder("Position");
            positionFolder.add(this.mainGUISelected, "Position X", -1000, 1000);
            positionFolder.add(this.mainGUISelected, "Position Y", -1000, 1000);
            positionFolder.add(this.mainGUISelected, "Position Z", -1000, 1000);

            const rotationFolder = gui.addFolder("Rotation");
            rotationFolder.add(this.mainGUISelected, "Rotation X", -5, 5);
            rotationFolder.add(this.mainGUISelected, "Rotation Y", -5, 5);
            rotationFolder.add(this.mainGUISelected, "Rotation Z", -5, 5);

            gui.onChange((event) => {
                console.log(event);

                if (event.property.startsWith("Cluster")) {
                    if (event.property.endsWith("Color")) {
                        const { sceneList, camera, renderer } = this.state;
                        var clusterIndex = parseInt(event.property.charAt(8)) - 1;
                        EnvironmentService.editObjecInSceneList(
                            sceneList,
                            camera,
                            renderer,
                            event.property,
                            this.mainGUISelected,
                            this.props.fileSpecs.cluster_indexes,
                            clusterIndex,
                            event.value
                        );
                    }
                } else if (["Scene Type", "Teklif ID"].includes(event.property)) {
                    this.animate();
                } else {
                    const { sceneList, camera, renderer } = this.state;
                    EnvironmentService.editObjecInSceneList(
                        sceneList,
                        camera,
                        renderer,
                        event.property,
                        this.mainGUISelected
                    );
                }
            });
        });
    };

    onExportButtonClick = () => {
        let exporter = new PLYExporter();
        let exportObject = undefined;

        switch (this.mainGUISelected["Scene Type"]) {
            case "Point":
                exportObject = EnvironmentService.findObjectFromGroupInSceneByUuid(
                    this.state.sceneList.Point,
                    "PointGroup",
                    "PointCloud"
                );
                break;
            case "Mesh":
                exportObject = EnvironmentService.findObjectFromSceneByUuid(
                    this.state.sceneList.Mesh,
                    "MeshGroup"
                );
                break;
        }

        var result = exporter.parse(exportObject);
        const blob = new Blob([result], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "model.ply";
        link.click();
    };

    onImportButtonClick = async () => {
        const { environmentService } = this;
        const { getFileSpecs } = await this.props;
        const { sceneList, camera, renderer } = await this.state;
        this.__path = this.props.teklifIdList[this.mainGUISelected["Teklif ID"]];

        this.setGuiObjectsEnabled(["Import Button", "Export Button"], false);
        console.log(this.props.teklifIdList[this.mainGUISelected["Teklif ID"]]);
        await getFileSpecs({ path: this.__path });
        //console.log(this.__path)
        //await getFileSpecs({ 'path': "/root/innosale/client/src/nlp/containers/part1-Body.2Export-Surfaces.stl" })

        await EnvironmentService.removeAllObjectFromSceneList(
            sceneList,
            camera,
            renderer
        );

        let buttonCounter = 0;
        console.log(this.props.teklifIdList[this.mainGUISelected["Teklif ID"]]);
        while (true) {
            if (
                this.props.fileSpecs.name ===
                this.props.teklifIdList[this.mainGUISelected["Teklif ID"]]
            ) {
                await environmentService.addFileWithSpecs(this.props.fileSpecs);
                this.setGuiObjectsEnabled(["Import Button", "Export Button"], true);
                this.setGuiObjectButtonText("Import Button", "Import Button");
                this.resetGuiInterface();
                break;
            } else {
                let buttonString = "Import Button .";
                for (let i = 0; i < buttonCounter; i++) {
                    buttonString += " .";
                }
                this.setGuiObjectButtonText("Import Button", buttonString);
                buttonCounter = (buttonCounter + 1) % 3;
                await this.wait_for_seconds(0.5);
            }
        }
    };

    saveToDatabase = async () => {
        if (this.Clusters ? this.Clusters.length > 0 : false) {
            await this.guiClusterFolder
                ?.controllersRecursive()
                .forEach((controller) => {
                    if (controller.$name.innerHTML === "Save to Database")
                        controller.enable(false);
                });
            await this.guiClusterFolder
                ?.foldersRecursive()
                .forEach((folder) => folder.close());

            var names = [];
            var colors = [];
            var process = [];
            var comments = [];
            var mesh_object = await EnvironmentService.findObjectFromGroupInSceneByUuid(
                this.state.sceneList.Mesh,
                "MeshGroup",
                "MeshObject"
            );
            var cluster_color_list = await Array.from(
                mesh_object.geometry.attributes.color.array
            );

            for (let i = 0; i < this.Clusters.length; i++) {
                var cluster = await this.Clusters[i];
                await names.push(cluster[`Cluster ${i + 1} Name`]);
                await colors.push(cluster[`Cluster ${i + 1} Color`][0]);
                await colors.push(cluster[`Cluster ${i + 1} Color`][1]);
                await colors.push(cluster[`Cluster ${i + 1} Color`][2]);
                await process.push(cluster[`Cluster ${i + 1} Process`]);
                await comments.push(cluster[`Cluster ${i + 1} Comment`]);
            }
            console.log(this.props.fileSpecs.hash);
            console.log(names);
            console.log(colors);
            console.log(process);
            console.log(comments);

            await this.props.editPartInMongoDb({
                hash: this.props.fileSpecs.hash,
                path: this.__path,
                cluster_names: names,
                cluster_colors: colors,
                cluster_process: process,
                cluster_comments: comments,
                cluster_color_list: cluster_color_list,
            });

            await this.wait_for_seconds(2);
            await this.guiClusterFolder
                ?.controllersRecursive()
                .forEach((controller) => {
                    if (controller.$name.innerHTML === "Save to Database")
                        controller.enable(true);
                });
        }
    };

    setGuiObjectsEnabled = (controllerNames, active) => {
        this.state.gui.controllersRecursive().forEach((value) => {
            if (controllerNames.includes(value.property)) {
                value.enable(active);
            }
        });
    };

    setGuiObjectButtonText = (controllerName, newText) => {
        this.state.gui.controllersRecursive().forEach((value) => {
            if (value.property === controllerName) {
                value.$button.innerText = newText;
            }
        });
    };

    resetGuiInterface = () => {
        this.mainGUISelected["Scale"] = 1;
        this.mainGUISelected["Visible"] = true;
        this.mainGUISelected["SelectedPointIndex"] = undefined;
        this.mainGUISelected["Color"] = { r: 0, g: 0, b: 0 };
        this.mainGUISelected["Position X"] = 0;
        this.mainGUISelected["Position Y"] = 0;
        this.mainGUISelected["Position Z"] = 0;
        this.mainGUISelected["Rotation X"] = 0;
        this.mainGUISelected["Rotation Y"] = 0;
        this.mainGUISelected["Rotation Z"] = 0;

        this.Clusters = [];
        this.guiClusterFolder?.destroy();
        this.guiClusterFolder = this.state.gui.addFolder("Clusters");
        this.guiClusterFolder.add(this.mainGUISelected, "Save to Database");
        const { cluster_names, cluster_colors, cluster_process, cluster_comments } = this.props.fileSpecs;
        for (let i = 0; i < cluster_names.length; i++) {
            var name = `Cluster ${i + 1} Name`;
            var color = `Cluster ${i + 1} Color`;
            var process = `Cluster ${i + 1} Process`;
            var comment = `Cluster ${i + 1} Comment`;
            this.Clusters.push({
                [name]: cluster_names[i],
                [color]: cluster_colors[i],
                [process]: cluster_process[i],
                [comment]: cluster_comments[i],
            });
            var folder = this.guiClusterFolder.addFolder(`Cluster ${i + 1}`).close();
            folder.add(this.Clusters[i], name);
            folder.addColor(this.Clusters[i], color);
            folder.add(
                this.Clusters[i],
                process,
                this.props.partProcessList /*['Açınım kesme','Bükme','Çekme','Çevre kesme','Delik','Delme','Kamlı delme','Kamlı kesme']*/
            ).$widget.style.color = "black";
            folder.add(this.Clusters[i], comment);
        }

        this.state.gui.controllersRecursive().forEach((value) => {
            if (value.property.startsWith("Cluster ")) {
                // let clusterIndex = value.property.charAt(8) - 1
                // value.setValue(this.Clusters[clusterIndex][value.property])
            } else value.setValue(this.mainGUISelected[value.property]);
        });
    };

    //#endregion

    //#region componentDidMount

    async componentDidMount() {
        const { fileList, getFileList, getTeklifId, getPartProcessList } = await this.props;
        await getTeklifId();
        await getFileList();
        await getPartProcessList();

        await this.setRendererDiv();
        await this.initEnvironment();
        await this.initMainGUI(this.props.fileSpecs);

        await window.addEventListener("resize", this.onWindowResizeEvent, false);
        await document.addEventListener("dblclick", this.onMouseDblClick, false);

        await this.onImportButtonClick();
    }

    setRendererDiv = async () => {
        while (true) {
            if (document.getElementById("renderer")) {
                this.setState({ rendererDiv: document.getElementById("renderer") });
                break;
            } else {
                await this.wait_for_seconds(0.5);
                continue;
            }
        }
    };

    initEnvironment = async () => {
        await this.setRendererDiv();
        const { sceneList, camera, renderer } = await this.state;
        this.environmentService = await new EnvironmentService(
            sceneList,
            camera,
            renderer
        );
        this.environmentService.createOrbitControl(camera, renderer.domElement);

        await renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
        await document.getElementById("renderer").appendChild(renderer.domElement);
        await this.animate();
    };

    animate = () => {
        const { sceneList, camera, renderer } = this.state;
        requestAnimationFrame(this.animate);
        renderer.render(sceneList[this.mainGUISelected["Scene Type"]], camera);
    };

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000));
    };

    //#endregion

    //#region Events

    onWindowResizeEvent = (event) => {
        const width = event.target.innerWidth;
        const height = event.target.innerHeight;
        const { camera, renderer } = this.state;

        if (camera && renderer) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    };

    onMouseDblClick = async (event) => {
        const { camera } = this.state;

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        switch (this.mainGUISelected["Scene Type"]) {
            case "Mesh":
                this.onMeshDblClick(raycaster);
                break;
            case "Point":
                this.onPointDblClick(raycaster);
                break;
        }

        this.animate();
    };

    onPointDblClick = (raycaster) => {
        const pointCloud = EnvironmentService.findObjectFromGroupInSceneByUuid(
            this.state.sceneList.Point,
            "PointGroup",
            "PointCloud"
        );
        const pointMarker = EnvironmentService.findObjectFromGroupInSceneByUuid(
            this.state.sceneList.Point,
            "PointGroup",
            "PointMarker"
        );
        const intersects = raycaster.intersectObject(pointCloud);

        const closestIndex = intersects[0].index;
        this.mainGUISelected.SelectedPointIndex = intersects[0].index;

        const color = new THREE.Color(
            intersects[0].object.geometry.attributes.color.array[closestIndex * 3],
            intersects[0].object.geometry.attributes.color.array[
                closestIndex * 3 + 1
            ],
            intersects[0].object.geometry.attributes.color.array[closestIndex * 3 + 2]
        );

        pointMarker.visible = true;
        pointMarker.material.color.set(color);
        pointMarker.position.set(
            pointCloud.geometry.attributes.position.getX(closestIndex) + pointCloud.position.x,
            pointCloud.geometry.attributes.position.getY(closestIndex) + pointCloud.position.y,
            pointCloud.geometry.attributes.position.getZ(closestIndex) + pointCloud.position.z
        );

        this.mainGUISelected.Color = { r: color.r, g: color.g, b: color.b };
        this.state.gui.controllers.forEach((controller) => {
            if (controller.property === "Color")
                controller.setValue({ r: color.r, g: color.g, b: color.b });
        });
    };

    onMeshDblClick = (raycaster) => {
        const intersects = raycaster.intersectObject(
            EnvironmentService.findObjectFromSceneByUuid(
                this.state.sceneList.Mesh,
                "MeshGroup",
                "MeshObject"
            )
        );

        this.mainGUISelected.SelectedPointIndex =
            intersects[intersects.length - 1].faceIndex;
        const closestIndex = intersects[intersects.length - 1].faceIndex;
        const closestIntersect = intersects[intersects.length - 1];
        console.log(closestIntersect);

        this.guiClusterFolder.foldersRecursive().forEach((folder) => {
            var folderName = folder.$title.innerHTML;
            var clusterIndex =
                this.props.fileSpecs.cluster_indexes[closestIntersect.faceIndex];

            if (folderName === `Cluster ${clusterIndex + 1}`) folder.open();
            else folder.close();
        });

        const color = new THREE.Color(
            closestIntersect.object.geometry.attributes.color.array[closestIndex * 3],
            closestIntersect.object.geometry.attributes.color.array[closestIndex * 3 + 1],
            closestIntersect.object.geometry.attributes.color.array[closestIndex * 3 + 2]
        );

        this.mainGUISelected.Color = { r: color.r, g: color.g, b: color.b };
        this.state.gui.controllers.forEach((controller) => {
            if (controller.property === "Color")
                controller.setValue({ r: color.r, g: color.g, b: color.b });
        });
    };

    //#endregion

    render() {
        return (
            <div id="renderer">
                {/*<Button onClick={() => console.log(this)}>{"this.state.myParamValue"}</Button>*/}
            </div>
        );
    }
}

const mstp = (state) => {
    return {
        fileSpecs: state.icp.fileSpecs,
        fileList: state.icp.fileList,
        teklifIdList: state.icp.teklifIdList,
        partProcessList: state.icp.partProcessList,
    };
};

const mdtp = (dispatch) => {
    return {
        getFileList: () => dispatch(getFileList()),
        getFileSpecs: (payload) => dispatch(getFileSpecs(payload)),
        getTeklifId: () => dispatch(getTeklifId()),
        editPartInMongoDb: (payload) => dispatch(editPartInMongoDb(payload)),
        getPartProcessList: () => dispatch(getPartProcessList()),
    };
};

export default withRouter(connect(mstp, mdtp)(ThreeEnvironment));
