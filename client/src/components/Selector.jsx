import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Selector (props) {
  const { value, items } = props
  const handleSelect = async (event) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].value == event.target.value) {
        await props.handleSelect(event, items[i].text, event.target.value, i)
        break
      }
    }
  }

  return (
    <Box width='250px'>
      <FormControl fullWidth>
        <InputLabel>{props.title}</InputLabel>
        <Select
          name = {props.name}
          label = {props.title}
          value = {value}
          onChange = {handleSelect} 
        >
          {
            items.map(item => {
              return (
                <MenuItem
                  key = {item.key}
                  value = {item.value}
                >
                  {item.text}
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    </Box>
  )
}