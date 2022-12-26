import React, {Component} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

class SummarizeSettingSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: 10
    };
  }
  render(){
    const {selected}=this.state
    return (
      <Box width='250px'>
        <FormControl fullWidth>
          <InputLabel id="summarize-setting-select-label">Summarize Settings</InputLabel>
          <Select
            labelId="summarize-setting-select-label"
            id="summarize-setting-select"
            label="Summarize Settings"
            value={selected}
            onChange={(e) => {
              this.setState({selected: e.target.value})
            }}
          >
            <MenuItem value={10}>Setting #1</MenuItem>
            <MenuItem value={20}>Setting #2</MenuItem>
            <MenuItem value={30}>Setting #3</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }
  
}
export default SummarizeSettingSelect;