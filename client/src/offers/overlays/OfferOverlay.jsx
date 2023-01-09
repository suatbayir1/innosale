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
import { setOverlay, addOffer, updateOffer } from "../../store/index";

class OfferOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companyName: "",
            date: dayjs(new Date()),
            description: "",
        }
    }

    componentDidMount = async () => {
        const { dialogData } = this.props;

        if (dialogData.mode === "edit") {
            this.setState({
                companyName: dialogData.data.company_name,
                date: dayjs(dialogData.data.date),
                description: dialogData.data.description
            })
        }
    }

    addOffer = () => {
        const { companyName, date, description } = this.state;
        const { addOffer } = this.props;

        if (companyName.trim() === "" || description.trim() === "") {
            NotificationManager.error("Please fill in the form completely", "Missing Data", 3000);
            return;
        }

        const payload = {
            companyName,
            date: new Date(date.toDate()).toISOString().split('T')[0],
            description,
        }

        addOffer(payload);
    }

    updateOffer = () => {
        const { companyName, date, description } = this.state;
        const { dialogData, updateOffer } = this.props;

        if (companyName.trim() === "" || description.trim() === "") {
            NotificationManager.error("Please fill in the form completely", "Missing Data", 3000);
            return;
        }

        const payload = {
            attributes: {
                company_name: companyName,
                date: new Date(date.toDate()).toISOString().split('T')[0],
                description,
            },
            where: {
                id: dialogData.data.id
            }
        }

        updateOffer(payload);
    }

    render() {
        const {
            companyName, date, description
        } = this.state;
        const { setOverlay, offerOverlayLoading, dialogData, parts } = this.props;

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
                                    <Grid item xs={6} md={6}>
                                        <FormControl style={{ minWidth: "100%" }}>
                                            <TextField
                                                label="Company Name"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={companyName}
                                                onChange={(e) => { this.setState({ companyName: e.target.value }) }}
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
                                                        value={date}
                                                        onChange={(e) => { this.setState({ date: e }) }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
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
                                                value={description}
                                                onChange={(e) => { this.setState({ description: e.target.value }) }}
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
                                    onClick={dialogData.mode === "add" ? this.addOffer : this.updateOffer}
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
        offerOverlayLoading: state.offer.offerOverlayLoading,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        addOffer: (payload) => dispatch(addOffer(payload)),
        updateOffer: (payload) => dispatch(updateOffer(payload)),
    }
}

export default connect(mstp, mdtp)(OfferOverlay);
