import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import SignalCellularAlt1BarRoundedIcon from '@mui/icons-material/SignalCellularAlt1BarRounded';
import SignalCellularAlt2BarRoundedIcon from '@mui/icons-material/SignalCellularAlt2BarRounded';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {
  const [value, setValue] = React.useState(0)

  const handleBlur = () => {
    if (value < 0) setValue(0)
    else if (value > 100) setValue(100)
  }

  const soundLogo = () => {
    if (props.value == 0) return (<SignalCellularAlt1BarRoundedIcon color='disabled'/>)
    else if (props.value < 33) return (<SignalCellularAlt1BarRoundedIcon color='error'/>)
    else if (props.value < 66) return (<SignalCellularAlt2BarRoundedIcon color='warning'/>)
    else if (props.value < 100) return (<SignalCellularAltRoundedIcon color='info'/>)
    else if (props.value == 100) return (<SignalCellularAltRoundedIcon color='success'/>)
  }
  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {props.title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {soundLogo()}
        </Grid>
        <Grid item xs>
          <Slider
            name={props.name}
            value={typeof props.value === 'number' ? props.value : 0}
            onChange={props.handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            name={props.name}
            value={props.value}
            size="small"
            onChange={props.handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}