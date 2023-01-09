// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NorthEastIcon from '@mui/icons-material/NorthEast';

// Components
import { Header } from '../../components';

// Helpers
import { dateToTableFormatWithDot } from "../../shared/helpers/convert";

// Actions
import { setOverlay, setDialogData, getOffers } from "../../store/index";

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
            pageSize: 5,
            selected: [],
        }
    }

    componentDidMount() {
        const { getOffers } = this.props;

        getOffers();
    }

    add = () => {
        const { setOverlay, setDialogData } = this.props;

        setOverlay("add-offer")
        setDialogData({ "mode": "add", "title": "Add Offer", "data": {} });
    }

    edit = () => {
        const { selected } = this.state;
        const { setOverlay, setDialogData, offers } = this.props;

        const selectedOffer = offers?.result.find(offer => offer.id === selected[0]);

        setOverlay("add-offer");
        setDialogData({ "mode": "edit", "title": "Edit Offer", "data": selectedOffer });
    }


    CustomToolbar = () => {
        const { selected } = this.state;
        const { offers } = this.props;

        const selectedOffer = offers?.result.find(offer => offer.id === selected[0]);

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
                    <Link to={selected.length === 1 ? `/offer-detail/${selectedOffer.id}` : "#"}>
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
        const { pageSize, selected } = this.state;
        const { offersGridLoading, classes, offers } = this.props;

        const columns = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70
            },
            {
                field: 'company_name',
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
                valueGetter: (params) =>
                    `${dateToTableFormatWithDot(params.row.date) || ''}`,
            },
        ];

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Offers" title="Click to see offer details" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        className={classes.root}
                        rows={offers?.result || []}
                        columns={columns}
                        disableSelectionOnClick
                        components={{ Toolbar: this.CustomToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => this.setState({ pageSize })}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        loading={offersGridLoading}
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
        offers: state.offer.offers,
        offersGridLoading: state.offer.offersGridLoading,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        getOffers: () => dispatch(getOffers())
    }
}

export default withStyles(styles)(connect(mstp, mdtp)(Offers));