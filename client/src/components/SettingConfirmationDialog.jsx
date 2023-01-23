import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
export default function SettingConfirmationDialog(props) {
    const { open, setOpen, name, header, text, confirmedFunction } = props

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(name, false)} maxWidth='lg'>
                <DialogTitle style={{color:"#FFB26B"}}>
                    <PriorityHighRoundedIcon style={{color:"#FFB26B"}}/>
                    {header}
                    <PriorityHighRoundedIcon style={{color:"#FFB26B"}}/>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText textAlign={'justify'}>
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(name, false)}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={async () => {
                            await confirmedFunction()
                        }}
                    >OK</Button>   
                </DialogActions>
            </Dialog>
        </div>
    );
}