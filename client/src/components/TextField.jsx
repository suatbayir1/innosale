import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields(props) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        name={props.name}
        id="outlined-basic"
        label={props.title}
        value={props.value}
        variant="outlined"
        onChange={props.handleInputChange}
      />
    </Box>
  );
}