import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import BasicTextFields from './TextField';

export default function SaveSettingDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState("edit");
    const [saveName, setSaveName] = React.useState(props.name);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setSaveName(event.target.value)
        props.handleBlockChanges("settingName", event.target.value)
    }

    const handleSaveClick = () => {
        props.save(radioValue)
    }

    return (
        <div>
            <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                style={{ textTransform: 'none' }}
                color="primary"
                onClick={handleClickOpen}
            >
                Save Settings
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <BasicTextFields
                        title="Setting Name"
                        value={saveName}
                        name={"settingName"}
                        handleInputChange={handleInputChange}
                    />
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Save Type</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="edit"
                            name="row-radio-buttons-group"
                            value={radioValue}
                            onChange={(event) => {setRadioValue(event.target.value)}}
                        >
                            <FormControlLabel value="edit" control={<Radio />} label="Overwrite" />
                            <FormControlLabel value="new" control={<Radio />} label="Create New" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveClick}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}