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
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { withStyles } from '@material-ui/core/styles';
import SummarizeIcon from '@mui/icons-material/Summarize';

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, setDialogData, getAllAudios, deleteAudioFile, getAudiosByOfferId } from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";
import { downloadFile } from "../../shared/helpers/export";

// HOC
import withRouter from '../../shared/hoc/withRouter';

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";

const styles = theme => ({
    root: {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
        }
    }
});

class AudioFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openConfirmationDialog: false,
            confirmationMessage: "",
            selectedRow: {},
            pageSize: 5,
            selected: [],
        }
    }

    componentDidMount() {
        const { getAllAudios, getAudiosByOfferId, params } = this.props;

        if (params.id) {
            getAudiosByOfferId(params.id);
        } else {
            getAllAudios();
        }
    }

    onAcceptDelete = () => {
        const { selectedRow } = this.state;
        const { deleteAudioFile } = this.props;
        deleteAudioFile(selectedRow.id);
        this.setState({ openConfirmationDialog: false });
    }

    CustomToolbar = () => {
        const { selected } = this.state;
        const { audios } = this.props;
        let selectedAudio;

        if (selected.length > 0) {
            selectedAudio = audios.find(audio => audio.id === selected[0]);
        }

        return (
            <GridToolbarContainer>
                <div
                    style={{ padding: '4px 4px 0px' }}
                >
                    <Button
                        startIcon={<FileUploadIcon />}
                        onClick={this.upload}
                        size="small"
                    >
                        UPLOAD
                    </Button>
                    <Button
                        startIcon={<EditIcon />}
                        onClick={this.edit}
                        disabled={selected.length === 1 ? false : true}
                        size="small"
                    >
                        EDIT
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={this.delete}
                        disabled={selected.length === 1 ? false : true}
                        size="small"
                    >
                        DELETE
                    </Button>
                    <Link to={selected.length === 1 ? `/audio-player/${selectedAudio.id}` : "#"}>
                        <Button
                            startIcon={<NorthEastIcon />}
                            disabled={selected.length === 1 ? false : true}
                            size="small"
                        >
                            Audio Player
                        </Button>
                    </Link>
                    <Button
                        startIcon={<SummarizeIcon />}
                        onClick={this.openSummarize}
                        disabled={selected.length === 1 ? false : true}
                        size="small"
                    >
                        Summarize
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => { downloadFile(selectedAudio) }}
                        disabled={selected.length === 1 ? false : true}
                        size="small"
                    >
                        DOWNLOAD
                    </Button>
                </div>
                <GridToolbar />
            </GridToolbarContainer>
        );
    }

    openSummarize = () => {
        const { selected } = this.state;
        const { setOverlay, setDialogData } = this.props;

        setOverlay("summarize-overlay");
        setDialogData({ "mode": "view", "title": "Summarize", "data": {} });
    }

    edit = () => {
        const { selected } = this.state;
        const { setOverlay, setDialogData, audios } = this.props;

        const selectedAudio = audios.find(audio => audio.id === selected[0]);

        setOverlay("add-audio-file");
        setDialogData({ "mode": "edit", "title": "Edit Audio File", "data": selectedAudio });
    }

    delete = () => {
        console.log("delete");
        const { selected } = this.state;
        const { audios } = this.props;

        const selectedAudio = audios.find(audio => audio.id === selected[0]);

        this.setState({
            selected: [],
            openConfirmationDialog: true,
            confirmationMessage: `The audio file with ${selectedAudio.id} IDs will be deleted from the system. Do you want to continue?`,
            selectedRow: selectedAudio
        })
    }

    upload = () => {
        const { setOverlay, setDialogData, params } = this.props;

        setOverlay("add-audio-file")
        setDialogData({
            "mode": "upload", "title": "Upload Audio File", "data": {
                teklifId: params.id || ""
            }
        });
    }

    render() {
        const { openConfirmationDialog, confirmationMessage, pageSize, selected } = this.state;
        const { audios, classes } = this.props;

        const columns = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70
            },
            {
                field: 'teklifId',
                headerName: 'Teklif ID',
                width: 100
            },
            {
                field: 'filename',
                headerName: 'File Name',
                width: 200,
            },
            {
                field: 'model',
                headerName: 'Model',
                width: 150,
            },
            {
                field: 'createdAt',
                headerName: 'Created Time',
                width: 200,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.createdAt) || ''}`,
            },
            {
                field: 'updatedAt',
                headerName: 'Updated Time',
                width: 200,
                valueGetter: (params) =>
                    `${dateToTableFormat(params.row.updatedAt) || 'No update'}`,
            },
            {
                field: 'path',
                headerName: 'Path',
                width: 450,
            },
        ];

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="NLP" title="Audio Files" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        className={classes.root}
                        rows={audios}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: this.CustomToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => this.setState({ pageSize })}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        loading={false}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selected}
                        onSelectionModelChange={(selection) => {
                            if (selection.length > 1) {
                                const selectionSet = new Set(selected);
                                const result = selection.filter((s) => !selectionSet.has(s));

                                this.setState({ selected: result });;
                            } else {
                                this.setState({ selected: selection });;
                            }
                        }}
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
        audios: state.nlp.audios
    }
}

const mdtp = (dispatch) => {
    return {
        getAllAudios: () => dispatch(getAllAudios()),
        getAudiosByOfferId: (payload) => dispatch(getAudiosByOfferId(payload)),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        deleteAudioFile: (payload) => dispatch(deleteAudioFile(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload))
    }
}

export default withRouter(withStyles(styles)(connect(mstp, mdtp)(AudioFiles)));