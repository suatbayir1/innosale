// Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

import Button from "@mui/material/Button";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { withStyles } from "@material-ui/core/styles";
import { Navigate } from "react-router-dom";

// Components
import { Header } from "../../components";

// Actions
import {
  setOverlay,
  setDialogData,
  deletePart,
  getParts,
  setPartsGridLoading,
} from "../../store/index";

// Helpers
import { dateToTableFormat } from "../../shared/helpers/convert";

// Overlays
import DeleteConfirmationDialog from "../../shared/overlays/DeleteConfirmationDialog";

const styles = (theme) => ({
  root: {
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
      {
        display: "none",
      },
  },
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
    };
  }

  componentDidMount() {
    this.props.setPartsGridLoading(true);
    this.props.getParts();
  }

  add = () => {
    const { setOverlay, setDialogData } = this.props;

    setOverlay("add-part");
    setDialogData({ mode: "add", title: "Add Part", data: {} });
  };

  viewFile = (id) => {
    const { parts } = this.props;

    parts.result.forEach((part) => {
      if (part.id === id) {
        const url = `/threejs_v2_scene/${part.teklif_id}`;
        window.open(url, "_blank");
        return <Navigate to={url} target="_blank" />;
      }
    });
  };
  
  viewFileV2 = (id) => {
    const { parts } = this.props;

    parts.result.forEach((part) => {
      if (part.id === id) {
        const url = `/threejs_scene/${part.teklif_id}`;
        window.open(url, "_blank");
        return <Navigate to={url} target="_blank" />;
      }
    });
  };
  
  similarFinder = (id) => {
    const { parts } = this.props;

    parts.result.forEach((part) => {
      if (part.id === id) {
        const url = `/similar_part_finder/${part.teklif_id}`;
        window.open(url, "_blank");
        return <Navigate to={url} target="_blank" />;
      }
    });
  };
  

  CustomToolbar = () => {
    const { selected } = this.state;
    const { parts } = this.props;

    const selectedPart = parts?.result.find((part) => part.id === selected[0]);

    return (
      <GridToolbarContainer>
        <div style={{ padding: "4px 4px 0px" }}>
          <Button
            startIcon={<FileUploadIcon />}
            onClick={this.add}
            size="small"
          >
            ADD
          </Button>
          <Button
            startIcon={<ViewInArIcon />}
            onClick={() => this.viewFile(selected[0])}
            disabled={selected.length === 1 ? false : true}
            size="small"
          >
            VIEW FILE
          </Button>
          {/*<Button
            startIcon={<ViewInArIcon />}
            onClick={() => this.viewFileV2(selected[0])}
            disabled={selected.length === 1 ? false : true}
            size="small"
          >
            VIEW FILE V2
          </Button> */}
          <Button
            startIcon={<PlagiarismIcon />}
            onClick={() => this.similarFinder(selected[0])}
            disabled={selected.length === 1 ? false : true}
            size="small"
          >
            SIMILAR PART FINDER
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
          <Link to={selected.length === 1 ? `/part/${selectedPart.id} ` : "#"}>
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
  };

  delete = () => {
    const { selected } = this.state;
    const { parts } = this.props;

    const selectedPart = parts?.result.find((part) => part.id === selected[0]);

    this.setState({
      selected: [],
      openConfirmationDialog: true,
      confirmationMessage: `The part record with ${selectedPart.id} IDs will be deleted from the system. Do you want to continue?`,
      selectedRow: selectedPart,
    });
  };

  edit = () => {
    const { selected } = this.state;
    const { setOverlay, setDialogData, parts } = this.props;

    const selectedPart = parts?.result.find((part) => part.id === selected[0]);

    setOverlay("add-part");
    setDialogData({ mode: "edit", title: "Edit Part", data: selectedPart });
  };

  onAcceptDelete = () => {
    const { selectedRow } = this.state;
    const { deletePart, setPartsGridLoading } = this.props;
    setPartsGridLoading(true);
    deletePart(selectedRow.id);
    this.setState({ openConfirmationDialog: false });
  };

  render() {
    const { openConfirmationDialog, confirmationMessage, pageSize, selected } =
      this.state;
    const { parts, partsGridLoading, classes } = this.props;

    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 70,
      },
      {
        field: "teklif_id",
        headerName: "Teklif Id",
        width: "100",
      },
      {
        field: "teklif_no",
        headerName: "Teklif No",
        width: "100",
      },
      {
        field: "teklif_talep_rev_no",
        headerName: "Teklif Talep Rev No",
        width: "150",
      },
      {
        field: "sac_kalinlik",
        headerName: "Sac Kalınlık",
        width: "100",
      },
      {
        field: "sac_cinsi",
        headerName: "Sac Cinsi",
        width: "100",
      },
      {
        field: "net_x",
        headerName: "Net X",
        width: "70",
      },
      {
        field: "net_y",
        headerName: "Net Y",
        width: "70",
      },
      {
        field: "net_xy_division",
        headerName: "Net XY Division",
        width: "120",
      },
      {
        field: "kontur_boyu",
        headerName: "Kontur Boyu",
        width: "120",
      },
      {
        field: "acinim_yuzey_alani",
        headerName: "Açınım Yüzey Alanı",
        width: "150",
      },
      {
        field: "sac_ts_max",
        headerName: "Sac Ts Max",
        width: "100",
      },
      {
        field: "sac_uzama",
        headerName: "Sac Uzama",
        width: "100",
      },
      {
        field: "sertlik",
        headerName: "Sertlik",
        width: "100",
      },
      {
        field: "hazirlama_tarihi",
        headerName: "Hazırlama Tarihi",
        width: "150",
        valueGetter: (params) =>
          `${dateToTableFormat(params.row.hazirlama_tarihi) || ""}`,
      },
      {
        field: "tonaj",
        headerName: "Tonaj",
        width: "100",
      },
      {
        field: "model_path",
        headerName: "Model Path",
        width: "400",
      },
      {
        field: "createdAt",
        headerName: "Created Time",
        width: 170,
        valueGetter: (params) =>
          `${dateToTableFormat(params.row.createdAt) || ""}`,
      },
      {
        field: "updatedAt",
        headerName: "Updated Time",
        width: 170,
        valueGetter: (params) =>
          `${dateToTableFormat(params.row.updatedAt) || "No update"}`,
      },
    ];

    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Parts List" />
        <Box sx={{ height: 400, width: "100%" }} mt={2}>
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
              console.log("selection", selection);
              if (selection.length > 1) {
                const selectionSet = new Set(selected);
                const result = selection.filter((s) => !selectionSet.has(s));

                this.setState({ selected: result });
              } else {
                this.setState({ selected: selection });
              }
            }}
          />
        </Box>

        <DeleteConfirmationDialog
          open={openConfirmationDialog}
          text={confirmationMessage}
          onClose={() => {
            this.setState({ openConfirmationDialog: false });
          }}
          onAccept={this.onAcceptDelete}
        />
      </div>
    );
  }
}

const mstp = (state) => {
  return {
    partsGridLoading: state.part.partsGridLoading,
    parts: state.part.parts,
  };
};

const mdtp = (dispatch) => {
  return {
    getParts: () => dispatch(getParts()),
    setOverlay: (payload) => dispatch(setOverlay(payload)),
    setDialogData: (payload) => dispatch(setDialogData(payload)),
    deletePart: (payload) => dispatch(deletePart(payload)),
    setPartsGridLoading: (payload) => dispatch(setPartsGridLoading(payload)),
  };
};

export default withStyles(styles)(connect(mstp, mdtp)(Parts));
