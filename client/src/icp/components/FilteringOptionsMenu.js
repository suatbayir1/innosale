import * as React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import  { Button } from '@mui/material'



export default function FilteringOptionsMenu(props) {
    const {filteringOptions, setFilteringOptions, onChange} = props;

    const [changesMade, setChangesMade] = React.useState(false);

    const setSac = (val) => {
        var f = filteringOptions;
        f.sac = val;
        setFilteringOptions(f);
    }

    const setNetX = (val) => {
        var f = filteringOptions;
        f.acinim_x = val;
        setFilteringOptions(f);
    }

    const setNetY = (val) => {
        var f = filteringOptions;
        f.acinim_y = val;
        setFilteringOptions(f);
    }

    const setKontur = (val) => {
        var f = filteringOptions;
        f.kontur = val;
        setFilteringOptions(f);
    }

    const setAlan = (val) => {
        var f = filteringOptions;
        f.alan = val;
        setFilteringOptions(f);
    }

    const setSacRange = (val) => {
        var f = filteringOptions;
        f.sac_range = val;
        setFilteringOptions(f);
    }

    const setNetXRange = (val) => {
        var f = filteringOptions;
        f.acinim_x_range = val;
        setFilteringOptions(f);
    }

    const setNetYRange = (val) => {
        var f = filteringOptions;
        f.acinim_y_range = val;
        setFilteringOptions(f);
    }

    const setKonturRange = (val) => {
        var f = filteringOptions;
        f.kontur_range = val;
        setFilteringOptions(f);
    }

    const setAlanRange = (val) => {
        var f = filteringOptions;
        f.alan_range = val;
        setFilteringOptions(f);
    }



    return (
        <Box sx={{padding:1, border: 1, justifyContent:"flex-end"}}>
            <h1>Filtering Options</h1>
            <Grid container direction={'row'} spacing={3} marginTop={'10px'} marginBottom={'10px'} justifyContent="flex-end">
                <Grid container item xs={3} md={3}  direction={'column'} spacing={2}>
                    <Grid item xs={3} md={3}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField  sx={{maxWidth:'120px'}}  disabled={true} InputLabelProps={{shrink: true,}} id="sac" label="Saç Kalınlığı" variant="outlined" value={filteringOptions.sac}  onChange={(event)=>{ setSac(event.target.value); setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField label="±" type="number" id="sac_range"  InputLabelProps={{shrink: true,}} variant="outlined" value={filteringOptions.sac_range} onChange={(event)=>{ setSacRange(event.target.value);  setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item xs={2} md={2} direction={'column'} spacing={2}> 
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField sx={{maxWidth:'80px'}} disabled={true} InputLabelProps={{shrink: true,}} id="net-acinim-x" label="Net X" variant="outlined" value={filteringOptions.acinim_x}  onChange={(event)=>{ setNetX(event.target.value); setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField label="±" type="number" id="netx_range"  InputLabelProps={{shrink: true,}} variant="outlined" value={filteringOptions.acinim_x_range} onChange={(event)=>{ setNetXRange(event.target.value); setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item xs={2} md={2} direction={'column'} spacing={2}> 
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField sx={{maxWidth:'80px'}} disabled={true}  InputLabelProps={{shrink: true,}} id="net-acinim-y"  label="Net Y" variant="outlined" value={filteringOptions.acinim_y}  onChange={(event)=>{ setNetY(event.target.value); setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField label="±" type="number" id="nety_range"  InputLabelProps={{shrink: true,}} variant="outlined" value={filteringOptions.acinim_y_range} onChange={(event)=>{ setNetYRange(event.target.value); setChangesMade(true);}}/>             
                        </FormControl>
                    </Grid>
                 </Grid>
                 <Grid container item xs={2} md={2} direction={'column'} spacing={2}> 
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                                <TextField sx={{maxWidth:'80px'}} disabled={true} InputLabelProps={{shrink: true,}}  id="cevre-konturu" label="Kontur" variant="outlined" value={filteringOptions.kontur} onChange={(event)=>{ setKontur(event.target.value); setChangesMade(true);}}/>  
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField label="±" type="number" id="kontur_range"  InputLabelProps={{shrink: true,}} variant="outlined" value={filteringOptions.kontur_range} onChange={(event)=>{ setKonturRange(event.target.value); setChangesMade(true);}}/>    
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item xs={3} md={3} direction={'column'} spacing={2}> 
                    <Grid item xs={3} md={3}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField sx={{maxWidth:'120px'}} disabled={true} InputLabelProps={{shrink: true,}} id="yüzey-alani" label="Yüzey Alanı" variant="outlined" value={filteringOptions.alan} onChange={(event)=>{ setAlan(event.target.value); setChangesMade(true);}}/> 
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <FormControl style={{ minWidth: "100%" }}>
                            <TextField label="±" type="number" id="alan_range"  InputLabelProps={{shrink: true,}} variant="outlined" value={filteringOptions.alan_range} onChange={(event)=>{ setAlanRange(event.target.value); setChangesMade(true);}}/>              
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Button variant="contained" disabled={!changesMade} onClick={()=> {onChange(filteringOptions); setChangesMade(false); }}>
                Apply Changes
            </Button>
        </Box>
    );
}


