import * as React from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';



export default function SelectTextFields(props) {
  const {fileList, setSelectedFile} = props;

  const [i, setI] = React.useState(0);

  const handleChange = async (event) => {
    setI(event.target.value);
    await setSelectedFile(fileList[event.target.value]);
    
  };

  return (
    <Box sx={{ minWidth: 120, maxWidth: 700 }}>
    <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Select File</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    defaultValue={""}
    value={i}
    label="Select File"
    onChange={handleChange}
  >
   {
    (fileList && fileList.length > 0) ? fileList.map((val, key) => (<MenuItem key={key} value={key}>{val}</MenuItem>)) : []
    }
  </Select>
</FormControl>
</Box>
  );
}