// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NorthEastIcon from '@mui/icons-material/NorthEast';

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, setDialogData } from "../../store/index";

const styles = theme => ({
    root: {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
        }
    }
});

class Offers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
        }
    }

    CustomToolbar = () => {
        const { selected } = this.state;

        return (
            <GridToolbarContainer>
                <div
                    style={{ padding: '4px 4px 0px' }}
                >
                    <Button
                        startIcon={<FileUploadIcon />}
                        onClick={this.add}
                        size="small"
                    >
                        ADD
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
                    <Link to={selected.length === 1 ? "/offer-detail/1" : "#"}>
                        <Button
                            startIcon={<NorthEastIcon />}
                            disabled={selected.length === 1 ? false : true}
                            size="small"
                        >
                            DETAIL
                        </Button>
                    </Link>
                </div>
                <GridToolbar />
            </GridToolbarContainer>
        );
    }

    render() {
        const { openConfirmationDialog, confirmationMessage, pageSize, selected } = this.state;
        const { parts, partsGridLoading, classes } = this.props;

        const columns = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70
            },
            {
                field: 'company',
                headerName: 'Company Name',
                width: 300
            },
            {
                field: 'description',
                headerName: 'Description',
                width: '700',
            },
            {
                field: 'date',
                headerName: 'Date',
                width: '300',
            },
        ];

        const data = [
            {
                id: 1,
                company: "Sales Case Company Name",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
                date: "10.12.2022"
            },
            {
                id: 2,
                company: "Sales Case Company Name",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
                date: "10.12.2022"
            },
            {
                id: 3,
                company: "Sales Case Company Name",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
                date: "10.12.2022"
            },
            {
                id: 4,
                company: "Sales Case Company Name",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
                date: "10.12.2022"
            },
            {
                id: 5,
                company: "Sales Case Company Name",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
                date: "10.12.2022"
            },
        ]

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Offers" title="Click to see offer details" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        className={classes.root}
                        rows={data}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: this.CustomToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => this.setState({ pageSize })}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        loading={partsGridLoading}
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
            </div >
        );
    }
};

const mstp = (state) => {
    return {
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
    }
}

export default withStyles(styles)(connect(mstp, mdtp)(Offers));