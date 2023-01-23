// Libraries
import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import TranslateIcon from '@mui/icons-material/Translate';
import { GoPackage } from 'react-icons/go';
import { TbShovel } from 'react-icons/tb';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Helpers
import { dateToTableFormat } from '../../shared/helpers/convert';

// Components
import DeleteConfirmationDialog from '../../shared/overlays/DeleteConfirmationDialog';

class OfferDetailTableRowOperationDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openConfirmationDialog: false,
            confirmationMessage: ``,
            selectedRow: {},
            allowedKeys: [
                "BCNC", "CAD", "CAM", "DNM", "GCNC", "KCNC", "MONTAJ", "OLCUM", "TwoD", "createdAt", "updatedAt", "doluluk",
                "euro_kg", "iscilik_mly", "iscilik_saat", "isil_islem_mly", "isil_islem_tip", "kalip_agirlik", "kalip_boyut_x",
                "kalip_boyut_y", "kalip_boyut_z", "kaplama_mly", "malzeme_mly", "model_mly", "operasyon_no", "parca_no", "presler",
                "rl", "standart_mly", "teklif_id", "teklif_no", "teklif_parca_rev_no", "teklif_talep_rev_no", "toplam_mly"
            ],
            titles: {
                BCNC: "BCNC",
                CAD: "CAD",
                CAM: "CAM",
                DNM: "DNM",
                GCNC: "GCNC",
                KCNC: "KCNC",
                MONTAJ: "MONTAJ",
                OLCUM: "OLCUM",
                TwoD: "2D",
                createdAt: "Oluşturulma Tarihi",
                updatedAt: "Güncelleme Tarihi",
                doluluk: "Doluluk",
                euro_kg: "Euro Kg",
                iscilik_mly: "İşçilik Maliyet",
                iscilik_saat: "İşçilik Saat",
                isil_islem_mly: "Isıl İşlem Maliyet",
                isil_islem_tip: "Isıl İşlem Tip",
                kalip_agirlik: "Kalıp Ağırlık",
                kalip_boyut_x: "Kalıp Boyut X",
                kalip_boyut_y: "Kalıp Boyut Y",
                kalip_boyut_z: "Kalıp Boyut Z",
                kaplama_mly: "Kaplama Maliyet",
                malzeme_mly: "Malzeme Maliyet",
                model_mly: "Model Maliyet",
                operasyon_no: "Operasyon No",
                parca_no: "Parça No",
                presler: "Presler",
                rl: "RL",
                standart_mly: "Standart Maliyet",
                teklif_id: "Teklif Id",
                teklif_no: "Teklif No",
                teklif_parca_rev_no: "Teklif Parça Rev No",
                teklif_talep_rev_no: "Teklif Talep Rev No",
                toplam_mly: "Toplam Maliyet"
            }
        }
    }

    getValue = (row, key) => {
        switch (key) {
            case "createdAt":
            case "updatedAt":
                return dateToTableFormat(row[key])
            default: return row[key]
        }
    }

    getIcon = (name) => {
        if (name.includes("FORM")) {
            return <MailOutlineIcon className='text-2xl' color='primary' />
        } else if (name.includes("KESME")) {
            return <TranslateIcon className='text-2xl' color='secondary' />
        } else if (name.includes("DELME")) {
            return <TranslateIcon className='text-2xl' color='error' />
        } else if (name.includes("BÜKME")) {
            return <TranslateIcon className='text-2xl' color='info' />
        } else if (name.includes("PROGRESİF")) {
            return <TranslateIcon className='text-2xl' color='warning' />
        } else {
            return <ForwardToInboxIcon className='text-2xl' color='inherit' />;
        }
    }

    delete = (row) => {
        console.log("row", row);
        this.setState({
            openConfirmationDialog: true,
            confirmationMessage: `The operation record with ${row.id} IDs will be deleted from the system. Do you want to continue?`,
            selectedRow: row
        })
    }

    render() {
        const { allowedKeys, titles, openConfirmationDialog, confirmationMessage } = this.state;
        const { operationsByOfferId } = this.props;

        return (
            <Grid container spacing={2}>
                <DeleteConfirmationDialog
                    open={openConfirmationDialog}
                    text={confirmationMessage}
                    onClose={() => { this.setState({ openConfirmationDialog: false }) }}
                    onAccept={this.onAcceptDelete}
                />
                {
                    operationsByOfferId.map(operation => {
                        return (
                            <Grid key={operation.id} item xs={12} md={12}>
                                <Accordion>
                                    <AccordionSummary
                                        // expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                            <Grid item xs={4} md={4}>
                                                <div className="flex gap-4">
                                                    {this.getIcon(operation.operasyon_adi)}
                                                    <p className="text-lg text-gray-700">{operation.operasyon_adi}</p>
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        style={{ background: "#FB9678" }}
                                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                    >
                                                        {<TbShovel />}
                                                    </button>
                                                    <div>
                                                        <p className="text-md font-semibold">K value</p>
                                                        <p className="text-sm text-gray-400">{operation.k_value || "undefined"}</p>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        style={{ background: "#FB9678" }}
                                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                    >
                                                        {<GoPackage />}
                                                    </button>
                                                    <div>
                                                        <p className="text-md font-semibold">Packaging</p>
                                                        <p className="text-sm text-gray-400">{operation.packaging || "undefined"}</p>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={3} md={3}>
                                            </Grid>
                                            <Grid item xs={1} md={1}>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => { this.delete(operation) }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="expand row"
                                                    onClick={() => { console.log("test") }}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            {
                                                Object.keys(operation).map((key, idx) => {
                                                    if (allowedKeys.includes(key))
                                                        return <Grid key={idx} item xs={2} md={2}>
                                                            <div>
                                                                <p className="text-md font-semibold">{titles[key]}</p>
                                                                <p className="text-sm text-gray-400">{this.getValue(operation, key)}</p>
                                                            </div>
                                                        </Grid>
                                                })
                                            }
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )
                    })

                }
            </Grid>
        );
    }
};

export default OfferDetailTableRowOperationDetail;