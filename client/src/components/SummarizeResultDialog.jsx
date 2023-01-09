import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DialogTitle from '@mui/material/DialogTitle';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import { Divider, Stack } from '@mui/material';

export default function SummarizeResultDialog(props) {
    const { summarizeResult } = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                style={{ textTransform: 'none', height: '56px' }}
                variant="outlined"
                startIcon={<TextSnippetRoundedIcon />}
                color="primary"
                onClick={async () => {
                    await props.summarizer()
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
                                summarizeResult ?
                                summarizeResult.data.data.original :
                                ""
                            }
                        </DialogContentText>
                        <DialogContentText width='25000px' textAlign={'justify'}>
                            <span><b>Summarized Text</b></span>
                            <br/>
                            {
                                summarizeResult ?
                                summarizeResult.data.data.result :
                                ""
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