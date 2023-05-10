// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { withStyles } from '@material-ui/core/styles';

// Components
import { Header } from '../../components';

// Actions
import { setOverlay, setDialogData,  getParts, setPartsGridLoading } from "../../store/index";




const styles = theme => ({
    root: {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
        }
    }
});

class Parts extends Component {
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
        this.props.setPartsGridLoading(true);
        this.props.getParts();
    }

    add = () => {
        const { setOverlay, setDialogData } = this.props;

        setOverlay("add-part")
        setDialogData({ "mode": "add", "title": "Add Part", "data": {} });
    }

    CustomToolbar = () => {
        const { selected } = this.state;
        const { parts } = this.props;

        const selectedPart = parts?.result.find(part => part.id === selected[0]);

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


                    <Link to={selected.length === 1 ? `/part/${selectedPart.id} ` : "#"}>

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
                field: 'teklif_id',
                headerName: 'Teklif Id',
                width: '100',
            },
            {
                field: 'teklif_no',
                headerName: 'Teklif No',
                width: '100',
            },

          
        ];

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Parts List" />
                <Box sx={{ height: 400, width: '100%' }} mt={2}>
                    <DataGrid
                        className={classes.root}
                        rows={parts?.result || []}
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
                            console.log("selection", selection)
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
        partsGridLoading: state.part.partsGridLoading,
        parts: state.part.parts,
    }
}

const mdtp = (dispatch) => {
    return {
        getParts: () => dispatch(getParts()),
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload))
    }
}

export default withStyles(styles)(connect(mstp, mdtp)(Parts));
