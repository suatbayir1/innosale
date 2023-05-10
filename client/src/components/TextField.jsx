import * as React from 'react';
import Box from '@mui/material/Box';
import { Autocomplete, TextField } from '@mui/material';

export default function BasicTextFields(props) {

  const handleInput = (event) => {
    const { name, value } = event.target
    props.handleInputChange(name, value)
  }

  const handleFiller = (event) => {
    const { innerText } = event.target
    props.handleInputChange(props.name, innerText)
  }

  
  const autofillList = [
    'otoform', 'maliyet', 'i̇ndirim', 'teklif', 'kar', 'i̇şçilik', 'fikstür', 'kapama', 'eş', 'eksen', 'tolerans', 'press', 
    'delme', 'bükme', 'progresif', 'saat', 'krupp', 'hatve', 'rulo', 'genişliği', 'kenet', 'punto', 'kamlı', 'kesme', 'operasyon',
    'doluluk', 'ön', 'açınım', 'pota', 'çekme', 'kavis', 'ayırma', 'kalibre', 'frankfurt', 'sac', 'kalınlığı', 'kot', 'farkı', 'kontur',
    'adım', 'standart', 'euro', 'kilogram', 'delik', 'çevre', 'bant', 'pozisyoner', 'şerit', 'maksimum', 'ölçü', 'ton', 'saati', 'mastar',
    'cr3', 'kalınlık', 'boyut', 'minimum', 'kuvvet', 'smeral'
  ]
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      {props.isImportantWord == true ?
        <Autocomplete
        id="free-solo-demo"
        value={props.value}
        freeSolo
        options={autofillList.map((option) => option)}
        onChange={handleFiller}
        renderInput={(params) =>
          <TextField
          
            {...params}
            name={props.name}
            id="outlined-basic"
            label={props.title}
            variant="outlined"
            onChange={(e) => handleInput(e, true)}
          />
        }
        />
       :
      
        <TextField
        name={props.name}
        id="outlined-basic"
        label={props.title}
        value={props.value}
        variant="outlined"
        onChange={handleInput}
      />}
      
    </Box>
  );
}