// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, setDialogData, deletePart } from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";

// Actions
import { getOperations, setOperationsGridLoading } from '../../store/index';

class OperationContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openConfirmationDialog: false,
            confirmationMessage: "",
            selectedRow: {},
            pageSize: 5,
        }
    }

    componentDidMount() {
        this.props.setOperationsGridLoading(true);
        this.props.getOperations();
    }

    addPart = () => {
        const { setOverlay, setDialogData } = this.props;

        setOverlay("add-part")
        setDialogData({ "mode": "add", "title": "Add Part", "data": {} });
    }

    CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <div
                    style={{ padding: '4px 4px 0px' }}
                >
                    <Button
                        startIcon={<FileUploadIcon />}
                        onClick={this.addPart}
                        size="small"
                    >
                        ADD
                    </Button>
                </div>
                <GridToolbar />
            </GridToolbarContainer>
        );
    }

    edit = (row) => {
        const { setOverlay, setDialogData } = this.props;

        setOverlay("add-part");
        setDialogData({ "mode": "edit", "title": "Edit Part", "data": row });
    }

    onAcceptDelete = () => {
        const { selectedRow } = this.state;
        const { deletePart, setPartsGridLoading } = this.props;
        setPartsGridLoading(true);
        deletePart(selectedRow.id);
        this.setState({ openConfirmationDialog: false });
    }

    render() {
        const { openConfirmationDialog, confirmationMessage, pageSize } = this.state;
        const { operations, operationsGridLoading } = this.props;

        console.log(operations);
        const columns = [
            {
                field: 'parca_no',
                headerName: 'Parça No',
                width: 70
            },
            {
                field: 'teklif_no',
                headerName: 'Teklif NO',
                width: '100',
            },
            {
                field: 'teklif_id',
                headerName: 'Teklif Id',
                width: '100',
            },
            {
                field: 'teklif_talep_rev_no',
                headerName: 'Teklif Talep Rev No',
                width: '150',
            },
            {
                field: 'teklif_parca_rev_no',
                headerName: 'Teklif Parça Rev No',
                width: '100',
            },
            {
                field: 'operasyon_no',
                headerName: 'Operasyon No',
                width: '100',
            },
            {
                field: 'operasyon_adi',
                headerName: 'Operasyon Adı',
                width: '70',
            },
            {
                field: 'rl',
                headerName: 'RL',
                width: '70',
            },
            {
                field: 'presler',
                headerName: 'Presler',
                width: '120',
            },
            {
                field: 'kalip_boyut_x',
                headerName: 'Kalıp Boyut X',
                width: '120',
            },
            {
                field: 'kalip_boyut_y',
                headerName: 'Kalıp Boyut Y',
                width: '150',
            },
            {
                field: 'kalip_boyut_z',
                headerName: 'Kalıp Boyut Z',
                width: '100',
            },
            {
                field: 'kalip_agirlik',
                headerName: 'Kalıp Ağırlık',
                width: '100',
            },
            {
                field: 'euro_kg',
                headerName: 'Euro Kg',
                width: '100',
            },
            {
                field: 'doluluk',
                headerName: 'Doluluk',
                width: '100',
            },
            {
                field: 'malzeme_mly',
                headerName: 'Malzeme Maliyet',
                width: '100',
            },
            {
                field: 'standart_mly',
                headerName: 'Standart Maliyet',
                width: '100',
            },
            {
                field: 'kaplama_mly',
                headerName: 'Kaplama Maliyet',
                width: '100',
            },
            {
                field: 'isil_islem_mly',
                headerName: 'Isıl İşlem Maliyet',
                width: '100',
            },
            {
                field: 'isil_islem_tip',
                headerName: 'Isıl İşlem Tip',
                width: '100',
            },
            {
                field: 'model_mly',
                headerName: 'Model Maliyet',
                width: '100',
            },
            {
                field: 'malzeme_mly',
                headerName: 'Malzeme Maliyet',
                width: '100',
            },
            {
                field: 'CAD',
                headerName: 'CAD',
                width: '100',
            },
            {
                field: 'CAM',
                headerName: 'CAM',
                width: '100',
            },
            {
                field: 'TwoD',
                headerName: '2D',
                width: '100',
            },
            {
                field: 'BCNC',
                headerName: 'BCNC',
                width: '100',
            },
            {
                field: 'KCNC',
                headerName: 'KCNC',
                width: '100',
            },
            {
                field: 'GCNC',
                headerName: 'GCNC',
                width: '100',
            },
            {
                field: 'MONTAJ',
                headerName: 'MONTAJ',
                width: '100',
            },
            {
                field: 'DNM',
                headerName: 'DNM',
                width: '100',
            },
            {
                field: 'OLCUM',
                headerName: 'OLCUM',
                width: '100',
            },
            {
                field: 'iscilik_mly',
                headerName: 'İşçilik Maliyet',
                width: '100',
            },
            {
                field: 'iscilik_saat',
                headerName: 'İşçilik Saat',
                width: '100',
            },
            {
                field: 'toplam_mly',
                headerName: 'Toplam Maliyet',
                width: '100',
            },
            {
                field: 'createdAt',
                headerName: 'Created Time',
                width: 150,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.createdAt) || ''}`,
            },
            {
                field: 'updatedAt',
                headerName: 'Updated Time',
                width: 150,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.updatedAt) || 'No update'}`,
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 120,
                renderCell: (params) => {
                    return (
                        <Stack direction="row" spacing={2}>
                            <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={() => { this.edit(params.row) }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => {
                                    this.setState({
                                        openConfirmationDialog: true,
                                        confirmationMessage: `The part record with ${params.row.id} IDs will be deleted from the system. Do you want to continue?`,
                                        selectedRow: params.row
                                    })
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    );
                }
            }
        ];

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Operations List" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        rows={operations?.result || []}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: this.CustomToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => this.setState({ pageSize })}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        loading={operationsGridLoading}
                    />
                </Box>

                <DeleteConfirmationDialog
                    open={openConfirmationDialog}
                    text={confirmationMessage}
                    onClose={() => { this.setState({ openConfirmationDialog: false }) }}
                    onAccept={this.onAcceptDelete}
                />
            </div >
        );
    }
};

const mstp = (state) => {
    return {
        operationsGridLoading: state.operation.operationsGridLoading,
        operations: state.operation.operations,
    }
}

const mdtp = (dispatch) => {
    return {
        getOperations: () => dispatch(getOperations()),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        deletePart: (payload) => dispatch(deletePart(payload)),
        setOperationsGridLoading: (payload) => dispatch(setOperationsGridLoading(payload))
    }
}

export default connect(mstp, mdtp)(OperationContainer);
