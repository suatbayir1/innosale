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
import { Navbar, Sidebar, Scene } from "../components";

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

class CAD extends Component {
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

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Navbar />
        </Grid>
        <Grid item xs={2} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10} md={10}>
          <Scene />
        </Grid>
      </Grid>
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

export default withStyles(styles)(connect(mstp, mdtp)(CAD));
