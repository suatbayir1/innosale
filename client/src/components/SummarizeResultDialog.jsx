import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DialogTitle from '@mui/material/DialogTitle';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

import { CircularProgress, Divider, Stack } from '@mui/material';


export default function SummarizeResultDialog(props) {
    const { summarizeResult, getSampleSummarize } = props
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);    
    const loadingText = "LOADING";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                disabled={loading}
                style={{ textTransform: 'none', height: '56px' }}
                variant="outlined"
                startIcon={loading ? <CircularProgress size={20} thickness={5} color={"inherit"} /> : <TextSnippetRoundedIcon />}
                color="primary"
                onClick={async () => {
                    setLoading(true)
                    await getSampleSummarize()
                    await props.timeout(3000)
                    setLoading(false)
                    handleClickOpen()
                }}
            >
                Sample Summarize
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogTitle>Summarize Result</DialogTitle>
                <DialogContent>
                    <Stack
                        direction='row'
                        spacing={3}
                        margin={2}
                        divider={<Divider orientation="vertical" flexItem />}
                    >
                        <DialogContentText textAlign={'justify'}>
                            <span><b>Sample Text</b></span>
                            <br/>
                            {
                                loading?loadingText:(summarizeResult ?
                                summarizeResult.baseText :
                                "")
                            }
                        </DialogContentText>
                        <DialogContentText width='25000px' textAlign={'justify'}>
                            <span><b>Summarized Text</b></span>
                            <br/>
                            {
                                loading?loadingText:(summarizeResult ?
                                summarizeResult.summarizedText :
                                "")
                            }
                        </DialogContentText>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}