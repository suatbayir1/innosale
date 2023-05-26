// Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { withStyles } from "@material-ui/core/styles";
import { Navigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

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

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div style={{ padding: "4px 4px 0px" }}>
        <Button startIcon={<FileUploadIcon />} onClick={() => {}} size="small">
          ADD
        </Button>
        <Button startIcon={<ViewInArIcon />} onClick={() => {}} size="small">
          VIEW FILE
        </Button>
        <Button startIcon={<EditIcon />} onClick={() => {}} size="small">
          EDIT
        </Button>
        <Button startIcon={<DeleteIcon />} onClick={() => {}} size="small">
          DELETE
        </Button>
        <Button startIcon={<NorthEastIcon />} size="small">
          DETAIL
        </Button>
      </div>
    );
  }
}

const mstp = (state) => {
  return {};
};

const mdtp = (dispatch) => {
  return {};
};

export default withStyles(styles)(connect(mstp, mdtp)(Navbar));
