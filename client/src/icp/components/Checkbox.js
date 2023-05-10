import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';



export default function CheckboxSecondary(props) {
  const {name1, name2, on1, on2, setOn1, setOn2, option, setOption, useFilters, setUseFilters} = props;

  return (
    <List dense sx={{ width: '100%', maxWidth: 700, bgcolor: 'white' , color: 'black'}}>
        <ListItem
          key={Math.random()}
          secondaryAction={
            <Checkbox
              edge="end"
              onChange={()=>setOn1(!on1)}
              checked={on1}
              inputProps={{ 'aria-labelledby': 0 }}
            />
          }
          disablePadding
        >
          <ListItemButton>    
            <ListItemText id={0} primary={`${name1} Base`} />
          </ListItemButton>
        </ListItem>

        <ListItem
          key={Math.random()}
          secondaryAction={
            <Checkbox
              edge="end"
              onChange={()=>setOn2(!on2)}
              checked={on2}
              inputProps={{ 'aria-labelledby': 1 }}
            />
          }
          disablePadding
        >

          <Box sx={{
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center',}}>
          <ListItemButton>
            
            <ListItemText id={1} primary={`${name2} Base`} />
          </ListItemButton>
          {
          (on2) ? (
          <FormControl fullWidth >
            <InputLabel id="select-option">Select Option</InputLabel>
              <Select
                labelId="select-option-label"
                id="select-option-simple"
                defaultValue={'RMSE'}
                value={option}
                label="Select Option"
                onChange={(event) => {setOption(event.target.value)}}
              >
                <MenuItem value={'RMSE'}>RMSE</MenuItem>
                <MenuItem value={'NORM'}>NORM</MenuItem>
                <MenuItem value={'BOTH'}>BOTH</MenuItem>
              </Select>
          </FormControl>
          ) : []
          }
          </Box>
        </ListItem>

        <ListItem
            key={Math.random()}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={()=>setUseFilters(!useFilters)}
                checked={useFilters}
                inputProps={{ 'aria-labelledby': 0 }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              
              <ListItemText id={2} primary={`Use Filters`} />
            </ListItemButton>
        </ListItem>
        
      
    </List>
  );
}