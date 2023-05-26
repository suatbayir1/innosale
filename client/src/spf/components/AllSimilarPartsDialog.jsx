import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import ThreeScene_ from '../components/ThreeScene_'
import { Stack } from '@mui/material';


export default function AllSimilarPartsDialog(props) {
    const { vm, open, header, containers } = props
    
    return (
        <div>
            <Dialog open={open} onClose={() => vm.setState({ all_similar_part_dialog_open: false }) } maxWidth='lg'>
                <DialogTitle>
                    {header}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText textAlign={'justify'}>
                        {
                            /*
                                <Stack spacing={5} direction={"row"}>
                                    {
                                        Object.keys(containers).map(key => {
                                            return <Stack key={key}>{containers[key]}</Stack>
                                        })
                                    }
                                </Stack>
                            */
                        }

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => vm.setState({ all_similar_part_dialog_open: false }) }>Cancel</Button>
                    <Button
                        color="error"
                        onClick={() => vm.setState({ all_similar_part_dialog_open: false }) }
                    >OK</Button>   
                </DialogActions>
            </Dialog>
        </div>
    );
}