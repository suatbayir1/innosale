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
import Autocomplete from '@mui/material/Autocomplete';

// Actions
import { setOverlay, addPart, setPartsGridLoading, updatePart, setPartOverlayLoading, getParts } from "../../store/index";

// Services
import { SceneService, GeneralService } from '../../shared/services'

// Scene Helpers
var camera, controls, scene, renderer;

class OfferOverlay extends Component {
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
        const { dialogData, getParts } = this.props;

        await getParts();

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
        }
    }

    render() {
        const {
            teklifId, teklifNo, teklifTalepRevNo, sacKalinlik, sacCinsi,
            netX, netY, konturBoyu, acinimYuzeyAlani, sacTsMax, sacUzama,
            sertlik, hazirlamaTarihi, previewLoading
        } = this.state;
        const { setOverlay, partOverlayLoading, dialogData, parts } = this.props;

        console.log(parts);

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="sm"
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
                                    <Grid item xs={6} md={6}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Company Name"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={sacCinsi}
                                                onChange={(e) => { this.setState({ sacCinsi: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} md={6}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        inputFormat="MM/DD/YYYY"
                                                        value={hazirlamaTarihi}
                                                        onChange={(e) => { this.setState({ hazirlamaTarihi: e }) }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={9} md={9}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <Autocomplete
                                                options={parts?.result || []}
                                                autoHighlight
                                                getOptionLabel={(option) => option.sac_cinsi}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Choose a part"
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            autoComplete: 'new-password',

                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                style={{ textTransform: 'none' }}
                                                onClick={this.addPart}
                                                color={"primary"}
                                                size="medium"
                                            >
                                                {"Add Offer"}
                                            </Button>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Description"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={sacCinsi}
                                                onChange={(e) => { this.setState({ sacCinsi: e.target.value }) }}
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
                                    {dialogData.mode === "add" ? "Add Offer" : "Update Offer"}
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
        parts: state.part.parts,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        addPart: (payload) => dispatch(addPart(payload)),
        getParts: () => dispatch(getParts()),
        updatePart: (payload, formData) => dispatch(updatePart(payload, formData)),
        setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload)),
        setPartOverlayLoading: (payload) => dispatch(setPartOverlayLoading(payload)),
    }
}

export default connect(mstp, mdtp)(OfferOverlay);
