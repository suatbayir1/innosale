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
import { getParts, setPartsGridLoading } from '../../store/index';

class Parts extends Component {
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
        this.props.setPartsGridLoading(true);
        this.props.getParts();
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
        const { parts, partsGridLoading } = this.props;

        console.log(partsGridLoading);
        const columns = [
            {
                field: 'direction',
                headerName: '',
                width: 50,
                renderCell: (params) => {
                    return (
                        <Link to={`/audio-player/${params.row.id}`}>
                            <IconButton aria-label="edit" color="primary">
                                <NorthEastIcon />
                            </IconButton>
                        </Link>
                    );
                }
            },
            {
                field: 'id',
                headerName: 'ID',
                width: 70
            },
            {
                field: 'teklif_id',
                headerName: 'Teklif Id',
                width: '100',
            },
            {
                field: 'teklif_no',
                headerName: 'Teklif No',
                width: '100',
            },
            {
                field: 'teklif_talep_rev_no',
                headerName: 'Teklif Talep Rev No',
                width: '150',
            },
            {
                field: 'sac_kalinlik',
                headerName: 'Sac Kalınlık',
                width: '100',
            },
            {
                field: 'sac_cinsi',
                headerName: 'Sac Cinsi',
                width: '100',
            },
            {
                field: 'net_x',
                headerName: 'Net X',
                width: '70',
            },
            {
                field: 'net_y',
                headerName: 'Net Y',
                width: '70',
            },
            {
                field: 'net_xy_division',
                headerName: 'Net XY Division',
                width: '120',
            },
            {
                field: 'kontur_boyu',
                headerName: 'Kontur Boyu',
                width: '120',
            },
            {
                field: 'acinim_yuzey_alani',
                headerName: 'Açınım Yüzey Alanı',
                width: '150',
            },
            {
                field: 'sac_ts_max',
                headerName: 'Sac Ts Max',
                width: '100',
            },
            {
                field: 'sac_uzama',
                headerName: 'Sac Uzama',
                width: '100',
            },
            {
                field: 'sertlik',
                headerName: 'Sertlik',
                width: '100',
            },
            {
                field: 'hazirlanma_tarihi',
                headerName: 'Hazırlanma Tarihi',
                width: '150',
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.hazirlanma_tarihi) || ''}`,
            },
            {
                field: 'tonaj',
                headerName: 'Tonaj',
                width: '100',
            },
            {
                field: 'model_path',
                headerName: 'Model Path',
                width: '400',
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
                <Header category="Page" title="Parts List" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        rows={parts?.result || []}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: this.CustomToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => this.setState({ pageSize })}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        loading={partsGridLoading}
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
        partsGridLoading: state.part.partsGridLoading,
        parts: state.part.parts,
    }
}

const mdtp = (dispatch) => {
    return {
        getParts: () => dispatch(getParts()),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        deletePart: (payload) => dispatch(deletePart(payload)),
        setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload))
    }
}

export default connect(mstp, mdtp)(Parts);
