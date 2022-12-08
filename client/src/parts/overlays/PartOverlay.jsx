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

// Actions
import { setOverlay, addPart, setPartsGridLoading, updatePart } from "../../store/index";

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
            hazirlanmaTarihi: dayjs(new Date()),
        }
    }

    componentDidMount() {
        const { dialogData } = this.props;

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
                hazirlanmaTarihi: dayjs(dialogData.data.hazirlanma_tarihi),
            })
        }
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
            hazirlanmaTarihi,
        } = this.state;
        const { addPart, updatePart, setPartsGridLoading, dialogData } = this.props;

        if (teklifNo.trim() === "" || sertlik.trim() === "") {
            NotificationManager.error("Please fill in the form completely", "Missing Data", 3000);
            return;
        }



        const payload = {
            teklif_id: teklifId,
            teklif_no: teklifNo,
            teklif_talep_rev_no: teklifTalepRevNo,
            sac_kalinlik: sacKalinlik,
            sac_cinsi: sacCinsi,
            net_x: netX,
            net_y: netY,
            kontur_boyu: konturBoyu,
            acinim_yuzey_alani: acinimYuzeyAlani,
            sac_ts_max: sacTsMax,
            sac_uzama: sacUzama,
            sertlik: sertlik,
            hazirlanma_tarihi: new Date(hazirlanmaTarihi.toDate()).toISOString().split('T')[0]
        }

        setPartsGridLoading(true);

        console.log(payload);
        console.log(dialogData.data.id);

        dialogData.mode === "add" ? addPart(payload) : updatePart({ "attributes": payload, "where": { "id": dialogData.data.id } });
    }

    render() {
        const {
            teklifId, teklifNo, teklifTalepRevNo, sacKalinlik, sacCinsi,
            netX, netY, konturBoyu, acinimYuzeyAlani, sacTsMax, sacUzama,
            sertlik, hazirlanmaTarihi,
        } = this.state;
        const { setOverlay, uploadAudioLoading, dialogData } = this.props;

        console.log(dialogData);

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
                        !uploadAudioLoading &&
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
                    uploadAudioLoading ? <Box sx={{
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
                                                onChange={(e) => { this.setState({ teklifId: e.target.value }) }}
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
                                                value={sacCinsi}
                                                onChange={(e) => { this.setState({ sacCinsi: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
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

                                    <Grid item xs={3} md={3}>
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

                                    <Grid item xs={3} md={3}>
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
                                                        value={hazirlanmaTarihi}
                                                        onChange={(e) => { this.setState({ hazirlanmaTarihi: e }) }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions style={{ justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={dialogData.mode === "add" ? <AddIcon /> : <CheckIcon />}
                                    style={{ textTransform: 'none' }}
                                    onClick={this.add}
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
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        addPart: (payload) => dispatch(addPart(payload)),
        updatePart: (payload) => dispatch(updatePart(payload)),
        setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload))
    }
}

export default connect(mstp, mdtp)(PartOverlay);
