import React,  { Component} from 'react';
import { ReactDOM } from 'react-dom';
import  { Button } from '@mui/material'
import  TextField  from './TextField';
import  Checkbox  from './Checkbox';
import  FilteringOptionsMenu  from './FilteringOptionsMenu';
import  SimilarPartsList  from './SimilarPartsList';
import  PartInformation  from './PartInformation';
import  ModelThree  from './ModelThree';


import FileUploadIcon from '@mui/icons-material/FileUpload';
import Grid from '@mui/material/Grid';

import {connect, Provider} from "react-redux";

import {setOverlay, setDialogData, getAllParts, calculateTable, calculateTableFeatureBased, calculateTableHybrid, setCalculating, getFilteredParts, getFeatures} from '../../store/index.js';

// FIXME: apply filters dedikten sonra sayfayı yenileyince yanlış allfiles veriyor.
/* FIXME: MUI: You have provided an out-of-range value `0` for the select component.
Consider providing a value that matches one of the available options or ''.
The available values are "". */

// TODO: Upload file gets information

class ICPCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      on1:false,
      on2:false,
      useFilters:false,
      selectedFile:"",
      selectedFileId:"",
      option: 'RMSE',
      fileReady: false,
      filteringOptions: {
        sac:0,
        acinim_x:0,
        acinim_y:0,
        kontur:0,
        alan:0,

        sac_range:0.25,
        acinim_x_range:150,
        acinim_y_range:150,
        kontur_range:300,
        alan_range:1000,
      },
    }
  }

  setUseFilters = (useFilters) => {
    this.setState({useFilters:useFilters})
  }

  updateSelectedFileId = () => {
    console.log(this.state.selectedFile.split("."));
    this.setState({selectedFileId: this.state.selectedFile.split(".")[0]});
  }

  setFilteringOptions = (filteringOptions) => {
    this.setState({filteringOptions: filteringOptions})
  }

  setOn1 = (on1) => {
    this.setState({on1:on1})
  }

  setOption = (option) => {
    this.setState({option:option})
  }

  setOn2 = (on2) => {
    this.setState({on2:on2})
  }

  setFileReady = (fileReady) => {
    this.setState({fileReady: fileReady});
  } 

  setSelectedFile = async (selectedFile) => {
    const {features} = this.props;
    const {filteringOptions, fileReady, selectedFileId} = this.state;

    this.setState({fileReady: false}, () => {
      console.log(selectedFile);

      let fileId = selectedFile.split(".")[0];

      this.setState({selectedFile:selectedFile}, () => {
        this.setState({selectedFileId: fileId}, () => {
          if (fileId) {
            this.props.getFeatures(fileId);  
            var f = filteringOptions;

            f.sac = features.sac; 
            f.acinim_x = features.acinim_x;
            f.acinim_y = features.acinim_y;
            f.kontur = features.kontur;
            f.alan = features.alan;

            this.setState({filteringOptions: f}, () => {this.handleFiltersChange(f); this.setFileReady(true);});          
          } else {
            console.log("no selected file");
          }
        });
      });
    });
  }


  setTable = (table) => {
    this.setState({table: table}
      //,() => console.log(this.state.table)
    );
  }

  addFile = () => {
    const { setOverlay, setDialogData} = this.props;

    setOverlay("add-part");
    setDialogData({ "mode": "add", "title": "Add Part", "data": {} });
  }

  buttonHandler = () => {
    const {calculateTable, calculateTableFeatureBased, calculateTableHybrid, allFiles, fileList} = this.props;
    const {selectedFile, on2, on1, option, useFilters} = this.state;

    console.log(allFiles);
    console.log(fileList);

    if (selectedFile) {
      if  (on2 && !on1) { // geometry based
        // compute data
        this.props.setCalculating(1);

        const formData = new FormData();
        formData.append('selectedFile', selectedFile);
        formData.append('selection', option);
        
        if (useFilters)
          fileList.forEach((item) => formData.append('fileList', item));
        else
          allFiles.forEach((item) => formData.append('fileList', item));

        console.log(formData);


        calculateTable(formData);
        console.log(this.props.table);

      } else if (on1 && !on2) { // feature based
        this.props.setCalculating(1);

        const formData = new FormData();
        formData.append('selectedFile', selectedFile);

        if (useFilters)
          fileList.forEach((item) => formData.append('fileList', item));
        else
          allFiles.forEach((item) => formData.append('fileList', item));

        console.log(formData);
        calculateTableFeatureBased(formData);
        console.log(this.props.table);


      } else if (on1 && on2) { // hybrid
        this.props.setCalculating(1);

        const formData = new FormData();
        formData.append('selectedFile', selectedFile);
        formData.append('selection', option);
        
        if (useFilters)
          fileList.forEach((item) => formData.append('fileList', item));
        else
          allFiles.forEach((item) => formData.append('fileList', item));

        calculateTableHybrid(formData);
        console.log(this.props.table);
      } else { // none
        console.log("none selected");
      }
    }
  }

  handleFiltersChange = (f) => {
    const {getFilteredParts, fileList} = this.props;
    const {useFilters} = this.state;
    if(useFilters) {
      const formData = new FormData();
      formData.append('sac', f.sac);
      formData.append('acinim_x', f.acinim_x);
      formData.append('acinim_y', f.acinim_y);
      formData.append('kontur', f.kontur);
      formData.append('alan', f.alan);
      formData.append('sac_range', f.sac_range);
      formData.append('acinim_x_range', f.acinim_x_range);
      formData.append('acinim_y_range', f.acinim_y_range);
      formData.append('kontur_range', f.kontur_range);
      formData.append('alan_range', f.alan_range);

      getFilteredParts(formData);
      console.log(fileList.length)
      console.log(fileList);
    }
  }

  componentDidMount() {
    const { allFiles, getAllParts, fileList, setCalculating} = this.props;
   
    setCalculating(0);

    getAllParts();
    
    if (allFiles && allFiles.length > 0) {
      console.log("here1");
      this.setSelectedFile(allFiles[0]);
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.features.sac !== this.props.features.sac || 
      prevProps.features.acinim_x !== this.props.features.acinim_x ||
      prevProps.features.acinim_y !== this.props.features.acinim_y ||
      prevProps.features.kontur !== this.props.features.kontur || 
      prevProps.features.alan !== this.props.features.alan) {
      
      var f = this.state.filteringOptions;

      f.sac = this.props.features.sac;
      f.acinim_x = this.props.features.acinim_x;
      f.acinim_y = this.props.features.acinim_y;
      f.kontur = this.props.features.kontur;
      f.alan = this.props.features.alan;

      this.setState({filteringOptions: f}, () => {this.handleFiltersChange(f)});
    }
  }

  render() {
    const {on1, on2, option, filteringOptions, useFilters, selectedFile , selectedFileId, fileReady} = this.state;
    const {calculating, table, fileList, allFiles} = this.props;

    return (
        <div style={{
          marginTop: '50px',
          minHeight: '600px',
          minWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <header className="App-header"/>
            <div style={{alignItems:'center'}}>
            <Grid container direction={'row'} spacing={1} >
              
              <Grid container item xs={5} md={5} direction={'column'} spacing={2} marginLeft={"10px"}>
                <Grid container item xs={1} md={1} direction={'row'} spacing={0} alignItems={'center'}>
                  {/* File Selection */}
                  <Grid item xs={3} md={3}>
                  <Button startIcon={<FileUploadIcon/>} variant="contained" onClick={this.addFile}>
                      NEW
                    </Button>
                  </Grid>
                  <Grid item xs={1} md={1}>
                    <h1>or</h1>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <TextField fileList={allFiles} setSelectedFile={this.setSelectedFile} filteringOptions={filteringOptions}/>
                  </Grid>
                  
                </Grid>
                <Grid item xs={3} md={3}>
                  {/* Geometry / Feature Based Checkboxes */}
                  <Checkbox name1="Feature" name2="Geometry" on1={on1} on2={on2} useFilters={useFilters} setOn1={this.setOn1} setOn2={this.setOn2} setUseFilters={this.setUseFilters} option={option} setOption={this.setOption}/>
                </Grid>
                {(fileReady) ? (
                  <Grid item xs={2} md={2}>
                    <ModelThree fileId={selectedFileId}/>
                  </Grid>
                ) : []
                }
                <Grid item xs={1} md={1} marginLeft={'60px'}>
                  {/* Compute Button */}
                  <Button sx={{minWidth: '300px'}} variant="contained" disabled={(calculating==1 && fileList && fileList.length > 0)} 
                    onClick={this.buttonHandler}>
                    {(!allFiles || allFiles.length == 0) ? 
                      "Files cannot be detected" : 
                      (this.props.calculating != 1 ? 
                        "Calculate the most similar parts!" : 
                        "Calculating...")}  
                  </Button>
                </Grid>
                
              </Grid>

              
                <Grid container direction={'column'} item xs={6} marginLeft={'30px'} marginRight={'10px'}>
                  {(fileReady) ? (<Grid item xs={1} md={1} marginBottom={'10px'}>
                    <PartInformation partInfo={{
                      name: "info-" + selectedFileId,
                      sac: this.props.features.sac,
                      acinim_x: this.props.features.acinim_x,
                      acinim_y: this.props.features.acinim_y,
                      kontur: this.props.features.kontur,
                      alan: this.props.features.alan,
                    }}/>
                  </Grid>):[]}
                  {useFilters ? (
                  <Grid item xs={5}>
                    <FilteringOptionsMenu filteringOptions={filteringOptions} setFilteringOptions={this.setFilteringOptions} onChange={this.handleFiltersChange}/>
                  </Grid>
                  ) : []}
                </Grid>
              
            </Grid>
            </div>
            {/* File List*/}
            {(calculating == 2 ) ? <SimilarPartsList table={table}/> : []}
        </div>
      
    )
  }
}

const mstp = (state) => {
  return {
    fileList: state.icp.parts,
    table: state.icp.table,
    calculating: state.icp.calculating,
    features: state.icp.features,
    allFiles: state.icp.allParts,
  }
}

const mdtp = (dispatch) => {
  return {
    getAllParts: () => dispatch(getAllParts()),
    calculateTable: (payload) => dispatch(calculateTable(payload)),
    setCalculating: (payload) => dispatch(setCalculating(payload)),
    getFilteredParts: (payload) => dispatch(getFilteredParts(payload)),
    getFeatures: (payload) => dispatch(getFeatures(payload)),
    setOverlay: (payload) => dispatch(setOverlay(payload)),
    setDialogData: (payload) => dispatch(setDialogData(payload)),
    calculateTableFeatureBased: (payload) => dispatch(calculateTableFeatureBased(payload)),
    calculateTableHybrid: (payload) => dispatch(calculateTableHybrid(payload)),
  }
}

export default connect(mstp, mdtp)(ICPCalculator);


