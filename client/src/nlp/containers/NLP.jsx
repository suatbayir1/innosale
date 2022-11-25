// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import NorthEastIcon from '@mui/icons-material/NorthEast';

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, getAllAudios, deleteAudioFile } from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";

class NLP extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openConfirmationDialog: false,
            confirmationMessage: "",
            selectedRow: {}
        }
    }

    componentDidMount() {
        const { getAllAudios } = this.props;
        getAllAudios();
    }

    render() {
        const { openConfirmationDialog, confirmationMessage, selectedRow } = this.state;
        const { setOverlay, audios, deleteAudioFile } = this.props;

        const columns = [
            {
                field: 'direction',
                headerName: '',
                width: 50,
                renderCell: (params) => {
                    return (
                        <Stack direction="row" spacing={2}>
                            <IconButton aria-label="edit" color="primary" onClick={() => { console.log(params) }}>
                                <NorthEastIcon />
                            </IconButton>
                        </Stack>
                    );
                }
            },
            {
                field: 'id',
                headerName: 'ID',
                width: 90
            },
            {
                field: 'filename',
                headerName: 'File Name',
                width: 200,
                editable: true,
            },
            {
                field: 'model',
                headerName: 'Model',
                width: 150,
                editable: true,
            },
            {
                field: 'createdAt',
                headerName: 'Created Time',
                width: 200,
                editable: true,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.createdAt) || ''}`,
            },
            {
                field: 'updatedAt',
                headerName: 'Updated Time',
                width: 200,
                editable: true,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.updatedAt) || 'No update'}`,
            },
            {
                field: 'path',
                headerName: 'Path',
                width: 400,
                editable: true,
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 100,
                renderCell: (params) => {
                    return (
                        <Stack direction="row" spacing={2}>
                            <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={() => { console.log(params.row) }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => {
                                    this.setState({
                                        openConfirmationDialog: true,
                                        confirmationMessage: `The audio file with ${params.row.id} IDs will be deleted from the system. Do you want to continue?`,
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
                <Header category="Apps" title="NLP" />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={{ textTransform: 'none' }}
                    onClick={() => { setOverlay("add-audio-file") }}
                >
                    Upload Audio File
                </Button>

                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        rows={audios}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>

                <DeleteConfirmationDialog
                    open={openConfirmationDialog}
                    text={confirmationMessage}
                    onClose={() => { this.setState({ openConfirmationDialog: false }) }}
                    onAccept={() => { deleteAudioFile(selectedRow.id) }}
                />
            </div >
        );
    }
};

const mstp = (state) => {
    return {
        audios: state.nlp.audios
    }
}

const mdtp = (dispatch) => {
    return {
        getAllAudios: () => dispatch(getAllAudios()),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        deleteAudioFile: (payload) => dispatch(deleteAudioFile(payload))
    }
}

export default connect(mstp, mdtp)(NLP);
