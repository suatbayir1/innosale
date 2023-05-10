import * as React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import  { Button, Typography } from '@mui/material'


export default function PartInformation(props) {
    const {partInfo} = props;

    return (
            <div>
            <Grid container direction={'row'} spacing={3} marginBottom={'10px'} justifyContent="flex-end">
                <Grid container item xs={3} md={3}  direction={'column'} spacing={1}>
                    <Grid item xs={3} md={3}>
                        <Box  sx={{padding:1, border: 1, justifyContent:"flex-end",alignItems: "center", borderColor: '#9D9D9D'}}>
                            <Typography align={"center"} variant={'body1'}>{"Saç Kalınlığı"}</Typography>   
                            <Typography align={"center"} variant={'body1'}>{partInfo.sac}</Typography> 
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={2} md={2} direction={'column'} spacing={1}> 
                    <Grid item xs={2} md={2}>
                    <Box  sx={{padding:1, border: 1, justifyContent:"flex-end",alignItems: "center", borderColor: '#9D9D9D'}}>
                            <Typography align={"center"} variant={'body1'}>{"Net X" }</Typography>   
                            <Typography align={"center"} variant={'body1'}>{partInfo.acinim_x}</Typography> 
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={2} md={2} direction={'column'} spacing={1}> 
                    <Grid item xs={2} md={2}>
                    <Box  sx={{padding:1, border: 1, justifyContent:"flex-end",alignItems: "center", borderColor: '#9D9D9D'}}>
                            <Typography align={"center"} variant={'body1'}>{"Net Y" }</Typography> 
                            <Typography align={"center"} variant={'body1'}>{partInfo.acinim_y}</Typography>  
                        </Box>
                    </Grid>
                 </Grid>
                 <Grid container item xs={2} md={2} direction={'column'} spacing={1}> 
                    <Grid item xs={2} md={2}>
                    <Box  sx={{padding:1, border: 1, justifyContent:"flex-end", alignItems: "center", borderColor: '#9D9D9D'}}>
                            <Typography align={"center"} variant={'body1'}>{"Kontur" }</Typography>  
                            <Typography align={"center"} variant={'body1'}>{partInfo.kontur}</Typography>  
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={3} md={3} direction={'column'} spacing={1}> 
                    <Grid item xs={3} md={3}>
                    <Box  sx={{padding:1, border: 1, justifyContent:"flex-end", alignItems: "center", borderColor: '#9D9D9D'}}>
                            <Typography align={"center"} variant={'body1'}>{"Yüzey Alanı" }</Typography>  
                            <Typography align={"center"} variant={'body1'}>{partInfo.alan}</Typography>   
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            </div>
    );
}


