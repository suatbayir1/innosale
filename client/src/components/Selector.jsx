import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Selector(props) {
  const [selected, setSelected] = React.useState('');

  const handleChange = async (event) => {
    await setSelected(event.target.value);
    await props.handleSelectChance(event);
  };

  return (
    <Box width='250px'>
      <FormControl fullWidth>
        <InputLabel>{props.title}</InputLabel>
        <Select
          name = {props.name}
          label={props.title}
          value={selected}
          onChange={handleChange}
        >
        {
            props.items.map(item => {
                return <MenuItem key={item.key} value={item.value}>{item.text}</MenuItem>
            })
        }
        </Select>
      </FormControl>
    </Box>
  );
}