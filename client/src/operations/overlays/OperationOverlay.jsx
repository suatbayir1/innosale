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
import Divider from '@mui/material/Divider';
import { InputGroup } from '../../components/index';

// Actions
import { setOverlay, addOffer, updateOffer, addOperation } from "../../store/index";

class OperationOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            writer: "",
            date: dayjs(new Date()),
            parcaNo: "",
            teklifNo: "",
            teklifId: "",
            teklifTalepRevNo: "",
            teklifParcaRevNo: "",
            operasyonNo: "",
            operasyonAdi: "",
            rl: "",
            presler: "",
            kalipBoyutX: "",
            kalipBoyutY: "",
            kalipBoyutZ: "",
            kalipAgirlik: "",
            euroKg: "",
            doluluk: "",
            malzemeMly: "",
            standartMly: "",
            kaplamaMly: "",
            isilIslemMly: "",
            isilIslemTip: "",
            modelMly: "",
            CAD: "",
            CAM: "",
            TwoD: "",
            BCNC: "",
            KCNC: "",
            GCNC: "",
            MONTAJ: "",
            DNM: "",
            OLCUM: "",
            iscilikMly: "",
            iscilikSaat: "",
            toplamMly: "",
        }
    }

    componentDidMount = async () => {
        const { dialogData } = this.props;

        if (dialogData.mode === "edit") {
            this.setState({
            })
        }

        this.setState({ teklifId: dialogData.data.teklifId });
    }

    addOperationFunc = () => {
        const {
            writer, date, parcaNo, teklifNo, teklifId, teklifTalepRevNo, teklifParcaRevNo, operasyonNo,
            operasyonAdi, presler, rl, kalipBoyutX, kalipBoyutY, kalipBoyutZ, kalipAgirlik, euroKg,
            doluluk, malzemeMly, standartMly, kaplamaMly, isilIslemMly, isilIslemTip, modelMly,
            CAD, CAM, TwoD, BCNC, KCNC, GCNC, MONTAJ, DNM, OLCUM, iscilikMly, iscilikSaat, toplamMly,
        } = this.state;
        const { addOperation } = this.props;

        const payload = {
            writer: writer,
            date: date,
            parca_no: parcaNo,
            teklif_no: teklifNo,
            teklif_id: teklifId,
            teklif_talep_rev_no: teklifTalepRevNo,
            teklif_parca_rev_no: teklifParcaRevNo,
            operasyon_no: operasyonNo,
            operasyon_adi: operasyonAdi,
            rl: rl,
            presler: presler,
            kalip_boyut_x: kalipBoyutX,
            kalip_boyut_y: kalipBoyutY,
            kalip_boyut_z: kalipBoyutZ,
            kalip_agirlik: kalipAgirlik,
            euro_kg: euroKg,
            doluluk: doluluk,
            malzeme_mly: malzemeMly,
            standart_mly: standartMly,
            kaplama_mly: kaplamaMly,
            isil_islem_mly: isilIslemMly,
            isil_islem_tip: isilIslemTip,
            model_mly: modelMly,
            CAD: CAD,
            CAM: CAM,
            TwoD: TwoD,
            BCNC: BCNC,
            KCNC: KCNC,
            GCNC: GCNC,
            MONTAJ: MONTAJ,
            DNM: DNM,
            OLCUM: OLCUM,
            iscilik_mly: iscilikMly,
            iscilik_saat: iscilikSaat,
            toplam_mly: toplamMly,
        }

        addOperation(payload);
        console.log("add", payload);
    }

    render() {
        const {
            writer, date, parcaNo, teklifNo, teklifId, teklifTalepRevNo, teklifParcaRevNo, operasyonNo,
            operasyonAdi, presler, rl, kalipBoyutX, kalipBoyutY, kalipBoyutZ, kalipAgirlik, euroKg,
            doluluk, malzemeMly, standartMly, kaplamaMly, isilIslemMly, isilIslemTip, modelMly,
            CAD, CAM, TwoD, BCNC, KCNC, GCNC, MONTAJ, DNM, OLCUM, iscilikMly, iscilikSaat, toplamMly,
        } = this.state;
        const { setOverlay, offerOverlayLoading, dialogData } = this.props;

        return (
            <Dialog
                open={true}
                aria-labelledby="customized-dialog-title"
                fullWidth
                disableScrollLock
                maxWidth="md"
            >
                <DialogTitle>
                    {dialogData.title || ""}
                    {
                        !offerOverlayLoading &&
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
                    offerOverlayLoading ? <Box sx={{
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
                                    <InputGroup firstTitle={"FORM SPECS"} secondTitle={"Please fill related inputs"} marginTop={0} />
                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Writer"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={writer}
                                                onChange={(e) => { this.setState({ writer: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        inputFormat="MM/DD/YYYY"
                                                        value={date}
                                                        onChange={(e) => { this.setState({ date: e }) }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                    <InputGroup firstTitle={"GENERAL INFORMATION"} secondTitle={"Please fill related inputs"} marginTop={40} />
                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Parça No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={parcaNo}
                                                onChange={(e) => { this.setState({ parcaNo: e.target.value }) }}
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
                                                label="Teklif Id"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={teklifId}
                                                disabled
                                                onChange={(e) => { this.setState({ teklifId: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Talep Rev No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={teklifTalepRevNo}
                                                onChange={(e) => { this.setState({ teklifTalepRevNo: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Teklif Parça Rev No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={teklifParcaRevNo}
                                                onChange={(e) => { this.setState({ teklifParcaRevNo: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Operasyon No"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={operasyonNo}
                                                onChange={(e) => { this.setState({ operasyonNo: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Operasyon Adı"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={operasyonAdi}
                                                onChange={(e) => { this.setState({ operasyonAdi: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} md={3}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Presler"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={presler}
                                                onChange={(e) => { this.setState({ presler: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <InputGroup firstTitle={"MANUFATURING PROCESS"} secondTitle={"Please fill related inputs"} marginTop={40} />
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="RL"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={rl}
                                                onChange={(e) => { this.setState({ rl: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kalıp Boyut X"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={kalipBoyutX}
                                                onChange={(e) => { this.setState({ kalipBoyutX: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kalıp Boyut Y"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={kalipBoyutY}
                                                onChange={(e) => { this.setState({ kalipBoyutY: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kalıp Boyut Z"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={kalipBoyutZ}
                                                onChange={(e) => { this.setState({ kalipBoyutZ: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kalıp Ağırlık"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={kalipAgirlik}
                                                onChange={(e) => { this.setState({ kalipAgirlik: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Euro Kg"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={euroKg}
                                                onChange={(e) => { this.setState({ euroKg: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Doluluk"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={doluluk}
                                                onChange={(e) => { this.setState({ doluluk: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Malzeme Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={malzemeMly}
                                                onChange={(e) => { this.setState({ malzemeMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Standart Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={standartMly}
                                                onChange={(e) => { this.setState({ standartMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Kaplama Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={kaplamaMly}
                                                onChange={(e) => { this.setState({ kaplamaMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Isıl İşlem Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={isilIslemMly}
                                                onChange={(e) => { this.setState({ isilIslemMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Isıl İşlem Tip"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={isilIslemTip}
                                                onChange={(e) => { this.setState({ isilIslemTip: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Model Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={modelMly}
                                                onChange={(e) => { this.setState({ modelMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="CAD"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={CAD}
                                                onChange={(e) => { this.setState({ CAD: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="CAM"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={CAM}
                                                onChange={(e) => { this.setState({ CAM: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="TwoD"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={TwoD}
                                                onChange={(e) => { this.setState({ TwoD: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="BCNC"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={BCNC}
                                                onChange={(e) => { this.setState({ BCNC: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="KCNC"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={KCNC}
                                                onChange={(e) => { this.setState({ KCNC: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="GCNC"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={GCNC}
                                                onChange={(e) => { this.setState({ GCNC: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="MONTAJ"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={MONTAJ}
                                                onChange={(e) => { this.setState({ MONTAJ: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="DNM"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={DNM}
                                                onChange={(e) => { this.setState({ DNM: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="OLCUM"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={OLCUM}
                                                onChange={(e) => { this.setState({ OLCUM: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="İşçilik Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={iscilikMly}
                                                onChange={(e) => { this.setState({ iscilikMly: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="İşçilik Saat"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={iscilikSaat}
                                                onChange={(e) => { this.setState({ iscilikSaat: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Toplam Mly"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={toplamMly}
                                                onChange={(e) => { this.setState({ toplamMly: e.target.value }) }}
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
                                    onClick={dialogData.mode === "add" ? this.addOperationFunc : this.updateOperation}
                                    color={dialogData.mode === "add" ? "primary" : "success"}
                                >
                                    {dialogData.mode === "add" ? "Add Operation" : "Update Operation"}
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
        offerOverlayLoading: state.offer.offerOverlayLoading,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        addOffer: (payload) => dispatch(addOffer(payload)),
        updateOffer: (payload) => dispatch(updateOffer(payload)),
        addOperation: (payload) => dispatch(addOperation(payload)),
    }
}

export default connect(mstp, mdtp)(OperationOverlay);