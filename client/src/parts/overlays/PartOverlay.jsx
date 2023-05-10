// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { NotificationManager } from 'react-notifications';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { DropzoneArea } from "mui-file-dropzone";
import LinearProgress from '@mui/material/LinearProgress';

// Actions
import { setOverlay, addPart, setPartsGridLoading, updatePart, setPartOverlayLoading } from "../../store/index";

// Services
import { SceneService, GeneralService } from '../../shared/services'

// Scene Helpers
var camera, controls, scene, renderer;

class PartOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teklifId: 0,
            teklifNo: "",
            teklifTalepRevNo: 0,
            sacKalinlik: 0,
            sacCinsi: "",
            netX: 0,
            netY: 0,
            konturBoyu: 0,
            acinimYuzeyAlani: 0,
            sacTsMax: 0,
            sacUzama: 0,
            sertlik: "",
            hazirlamaTarihi: dayjs(new Date()),
            file: {},
            uuid: "",
            previewLoading: false,
        }
    }

    componentDidMount = async () => {
        const { dialogData, setPartOverlayLoading } = this.props;

        await this.createScene();

        if (dialogData.mode === "edit") {
            this.setState({
                teklifId: dialogData.data.teklif_id,
                teklifNo: dialogData.data.teklif_no,
                teklifTalepRevNo: dialogData.data.teklif_talep_rev_no,
                sacKalinlik: dialogData.data.sac_kalinlik,
                sacCinsi: dialogData.data.sac_cinsi,
                netX: dialogData.data.net_x,
                netY: dialogData.data.net_y,
                konturBoyu: dialogData.data.kontur_boyu,
                acinimYuzeyAlani: dialogData.data.acinim_yuzey_alani,
                sacTsMax: dialogData.data.sac_ts_max,
                sacUzama: dialogData.data.sac_uzama,
                sertlik: dialogData.data.sertlik,
                hazirlamaTarihi: dayjs(dialogData.data.hazirlama_tarihi),
            })
        } else {
            this.setState({
                teklifId: dialogData.data.teklif_id,
            })
        }

        setTimeout(() => {
            var container = document.querySelector('#partModelPreviewContainer');
            var rect = container.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
        }, 1000);
    }

    createScene = async () => {
        scene = await SceneService.createScene();
        camera = await SceneService.createCamera(35, window.innerWidth / window.innerHeight, 1, 15);
        renderer = await SceneService.createRenderer(window.devicePixelRatio, 200, 200);

        const sceneManager = new SceneService(scene, camera, renderer);
        sceneManager.setGround();
        sceneManager.addLightToScene();
        sceneManager.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
        sceneManager.addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);

        document.getElementById("partModelPreviewScene").appendChild(renderer.domElement);

        controls = sceneManager.createOrbitControl(camera, renderer.domElement);
        controls.addEventListener("change", () => {
            renderer.render(scene, camera);
        });

        renderer.render(scene, camera);
    }

    addPlyFile = async () => {
        const sceneManager = new SceneService(scene, camera, renderer);
        await sceneManager.addPlyFileWithUrl();
        await sceneManager.addPlyFile('Lucy100k.ply');
    }

    add = () => {
        const {
            teklifId,
            teklifNo,
            teklifTalepRevNo,
            sacKalinlik,
            sacCinsi,
            netX,
            netY,
            konturBoyu,
            acinimYuzeyAlani,
            sacTsMax,
            sacUzama,
            sertlik,
            hazirlamaTarihi,
            file
        } = this.state;
        const { addPart, setPartsGridLoading, setPartOverlayLoading } = this.props;

        if (teklifNo.trim() === "" || sertlik.trim() === "" || sacCinsi.trim() === "") {
            NotificationManager.error("Please fill in the form completely", "Missing Data", 3000);
            return;
        }

        if (file === undefined) {
            NotificationManager.error("You have not selected any files", "Missing Data", 3000);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file["name"]);
        formData.append('teklif_id', teklifId);
        formData.append('teklif_no', teklifNo);
        formData.append('teklif_talep_rev_no', teklifTalepRevNo);
        formData.append('sac_kalinlik', sacKalinlik);
        formData.append('sac_cinsi', sacCinsi);
        formData.append('net_x', netX);
        formData.append('net_y', netY);
        formData.append('kontur_boyu', konturBoyu);
        formData.append('acinim_yuzey_alani', acinimYuzeyAlani);
        formData.append('sac_ts_max', sacTsMax);
        formData.append('sac_uzama', sacUzama);
        formData.append('sertlik', sertlik);
        formData.append('hazirlama_tarihi', new Date(hazirlamaTarihi.toDate()).toISOString().split('T')[0]);

        setPartsGridLoading(true);
        setPartOverlayLoading(true);
        addPart(formData);
    }

    update = () => {
        const {
            teklifId,
            teklifNo,
            teklifTalepRevNo,
            sacKalinlik,
            sacCinsi,
            netX,
            netY,
            konturBoyu,
            acinimYuzeyAlani,
            sacTsMax,
            sacUzama,
            sertlik,
            hazirlamaTarihi,
            file
        } = this.state;
        const { updatePart, setPartsGridLoading, dialogData, setPartOverlayLoading } = this.props;

        if (teklifNo.trim() === "" || sertlik.trim() === "" || sacCinsi.trim() === "") {
            NotificationManager.error("Please fill in the form completely", "Missing Data", 3000);
            return;
        }

        if (file === undefined) {
            NotificationManager.error("You have not selected any files", "Missing Data", 3000);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', dialogData.data.id);

        const payload = {
            'teklif_id': teklifId,
            'teklif_no': teklifNo,
            'teklif_talep_rev_no': teklifTalepRevNo,
            'sac_kalinlik': sacKalinlik,
            'sac_cinsi': sacCinsi,
            'net_x': netX,
            'net_y': netY,
            'kontur_boyu': konturBoyu,
            'acinim_yuzey_alani': acinimYuzeyAlani,
            'sac_ts_max': sacTsMax,
            'sac_uzama': sacUzama,
            'sertlik': sertlik,
            'hazirlama_tarihi': new Date(hazirlamaTarihi.toDate()).toISOString().split('T')[0],
        }

        setPartsGridLoading(true);
        setPartOverlayLoading(true);

        updatePart({ "attributes": payload, "where": { "id": dialogData.data.id } }, formData);
    }

    changeFileDropzone = async (files) => {
        const { uuid } = this.state;

        if (files.length === 0) {
            if (scene && camera && renderer && uuid !== "") {
                await SceneService.removeObjectFromSceneByUuid(scene, camera, renderer, uuid);
            }
            return
        };

        if (uuid !== "") {
            await SceneService.removeObjectFromSceneByUuid(scene, camera, renderer, uuid);
        }

        this.setState({
            file: files[0]
        }, () => { this.readFileAndShowInPreview() });
    }

    readFileAndShowInPreview = async () => {
        const { file } = this.state;
        const extension = file.name.split('.').pop();
        this.setState({ previewLoading: true });

        switch (extension) {
            case "ply":
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(file)

                reader.onloadend = async () => {
                    const sceneManager = new SceneService(scene, camera, renderer);
                    const file_uuid = await sceneManager.addPlyFileWithParsing(reader.result);
                    this.setState({ uuid: file_uuid });
                }
                break;
            case "igs":
                console.log("igs", file);
                const formData = new FormData();
                formData.append('file', file);
                const url = await GeneralService.convertPartModelFile(formData);
                const sceneManager = new SceneService(scene, camera, renderer);
                const file_uuid = await sceneManager.addPlyFileWithUrl(url);
                console.log(file_uuid);
                this.setState({ uuid: file_uuid });
                break;
            default: break;
        }

        this.setState({ previewLoading: false });
    }

    render() {
        const {
            teklifId, teklifNo, teklifTalepRevNo, sacKalinlik, sacCinsi,
            netX, netY, konturBoyu, acinimYuzeyAlani, sacTsMax, sacUzama,
            sertlik, hazirlamaTarihi, previewLoading
        } = this.state;
        const { setOverlay, partOverlayLoading, dialogData } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    {dialogData.title || ""}
                    {
                        !partOverlayLoading &&
                        <IconButton
                            aria-label="close"
                            onClick={() => { setOverlay("none") }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                </DialogTitle>

                {
                    partOverlayLoading ? <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: '300px'
                    }}>
                        <CircularProgress size={200} thickness={1} />
                    </Box>
                        :
                        <>
                            <DialogContent dividers>
                                <Grid container spacing={2}>
                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Id"
                                                variant="outlined"
                                                value={teklifId}
                                                type={"number"}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled
                                            // onChange={(e) => { this.setState({ teklifId: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={teklifNo}
                                                onChange={(e) => { this.setState({ teklifNo: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Talep Rev No"
                                                type={"number"}
                                                variant="outlined"
                                                value={teklifTalepRevNo}
                                                onChange={(e) => { this.setState({ teklifTalepRevNo: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Açınım Yüzey Alanı"
                                                type={"number"}
                                                variant="outlined"
                                                value={acinimYuzeyAlani}
                                                onChange={(e) => { this.setState({ acinimYuzeyAlani: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Sac Kalınlık"
                                                type={"number"}
                                                variant="outlined"
                                                value={sacKalinlik}
                                                onChange={(e) => { this.setState({ sacKalinlik: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Sac Cinsi"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={sacCinsi}
                                                onChange={(e) => { this.setState({ sacCinsi: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Sac Ts Max"
                                                type={"number"}
                                                variant="outlined"
                                                value={sacTsMax}
                                                onChange={(e) => { this.setState({ sacTsMax: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Sac Uzama"
                                                type={"number"}
                                                variant="outlined"
                                                value={sacUzama}
                                                onChange={(e) => { this.setState({ sacUzama: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Net X"
                                                type={"number"}
                                                variant="outlined"
                                                value={netX}
                                                onChange={(e) => { this.setState({ netX: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Net Y"
                                                type={"number"}
                                                variant="outlined"
                                                value={netY}
                                                onChange={(e) => { this.setState({ netY: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kontur Boyu"
                                                type={"number"}
                                                variant="outlined"
                                                value={konturBoyu}
                                                onChange={(e) => { this.setState({ konturBoyu: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Sertlik"
                                                variant="outlined"
                                                value={sertlik}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e) => { this.setState({ sertlik: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date desktop"
                                                        inputFormat="MM/DD/YYYY"
                                                        value={hazirlamaTarihi}
                                                        onChange={(e) => { this.setState({ hazirlamaTarihi: e }) }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>

                                    {
                                        previewLoading &&
                                        <Grid item xs={12} md={12}>
                                            <Box sx={{ width: '100%' }}>
                                                <LinearProgress />
                                            </Box>
                                        </Grid>
                                    }

                                    <Grid item xs={6} md={6}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <div id="partModelPreviewContainer" style={{ width: '100%', height: '250px' }}>
                                                <div id="partModelPreviewScene">
                                                </div>
                                            </div>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} md={6}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            < DropzoneArea
                                                style={{ maxHeight: '100px' }}
                                                onChange={(files) => { this.changeFileDropzone(files) }}
                                                filesLimit={1}
                                                showPreviews={false}
                                                maxFileSize={50000000}
                                                // acceptedFiles={['audio/*', 'video/*']}
                                                showPreviewsInDropzone={true}
                                                showFileNames={true}
                                                showFileNamesInPreview={true}
                                                dropzoneText={"Drag and drop an file here or click"}

                                                // FIXME: The following line crashes the whole front-end when there is no model_path in dialogData
                                                initialFiles={dialogData.mode === "add" ? [] : [`${process.env.REACT_APP_BASE_SERVER_URL}${dialogData.data.model_path.split("/server")[1]}`]}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions style={{ justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={dialogData.mode === "add" ? <AddIcon /> : <CheckIcon />}
                                    style={{ textTransform: 'none' }}
                                    onClick={dialogData.mode === "add" ? this.add : this.update}
                                    color={dialogData.mode === "add" ? "primary" : "success"}
                                >
                                    {dialogData.mode === "add" ? "Add Part" : "Update Part"}
                                </Button>
                            </DialogActions>
                        </>
                }
            </Dialog>
        )
    }
}

const mstp = (state) => {
    return {
        overlay: state.shared.overlay,
        dialogData: state.shared.dialogData,
        partOverlayLoading: state.part.partOverlayLoading,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        addPart: (payload) => dispatch(addPart(payload)),
        updatePart: (payload, formData) => dispatch(updatePart(payload, formData)),
        setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload)),
        setPartOverlayLoading: (payload) => dispatch(setPartOverlayLoading(payload)),
    }
}

export default connect(mstp, mdtp)(PartOverlay);
