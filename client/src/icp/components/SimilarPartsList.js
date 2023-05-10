import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import ModelThree from './ModelThree';
import PartInformation from './PartInformation';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SimilarPartsList(props) {
  const {table} = props;

  console.log(table);
  
  const table_type = table[2];

  let i = 1;

  let tableFeatureRow = table[3];

  if (table_type == 2) // geometry-based
    tableFeatureRow = table[6]
  else if (table_type == 1) // feature-based
    tableFeatureRow = table[3]
  else if (table_type == 3) // both TODO:
    tableFeatureRow = table[3]

  return (
    <Box sx={{padding:1, marginLeft: '10px', marginTop: '10px'}}>
    <Grid 
      container 
      spacing={1}
      direction={'column'}
    > 
      
      {(table && table.length > 0 && (i=1)) ? table[0].map((id) => (     
        <Box sx={{padding:1, border: 1, borderColor: 'grey.500' , justifyContent:"flex-end"}}>
          <Grid container item direction={'row'} spacing={2} alignItems={'center'} marginLeft={'10px'}>
            <Grid item xs={0.3} md={0.3}>
              <h1><span style={{ fontWeight: 'bold'}}>{i++ + "."}</span></h1>
            </Grid>
            <Grid container item direction={'column'} xs={6} md={6} spacing={2}>
              <Grid container item direction={'row'} xs={2} md={2} spacing={1}>
                <Grid item xs={5} md={5}>
                  <h1><span style={{ fontWeight: 'bold', color: '#1155b0' }}>{table[0][table[0].indexOf(id)] }</span></h1>
                </Grid>
                <Grid item xs={5} md={5}>
                  <h1> <span style={{color: '#1155b0' }}><span style={{ fontWeight: 'bold'}}>{((table_type == 2) ? "RMSE: " : "DIST: ")}</span> {table[1][table[0].indexOf(id)]} </span></h1> 
                </Grid>
              </Grid>
              <Grid item xs={5} md={5}>
                
                <PartInformation 
                  partInfo={{
                    name: "list-" + table[0][table[0].indexOf(id)],
                    sac: tableFeatureRow[table[0].indexOf(id)][0],
                    acinim_x:tableFeatureRow[table[0].indexOf(id)][1],
                    acinim_y: tableFeatureRow[table[0].indexOf(id)][2],
                    kontur: tableFeatureRow[table[0].indexOf(id)][3],
                    alan: tableFeatureRow[table[0].indexOf(id)][4],
                  }}/>
              </Grid>
            </Grid>
            {(table[0].indexOf(id) != 0) ? (
            <Grid item xs={5} md={5}>
              
              <ModelThree fileId={table[0][table[0].indexOf(id)]}/>
            </Grid>):[]
            }
          </Grid>
        </Box>
      )): []}

    </Grid>
    </Box>
  );
}
