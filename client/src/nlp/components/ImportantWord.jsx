import InputSlider from "../../components/Slider";
import { Fab, Stack } from "@mui/material";
import BasicTextFields from "../../components/TextField";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

export default function importantWord (word_, freq_) {
    let word = word_;
    let freq = freq_;

    return(
        <Stack direction='row' spacing={7}>
            <Fab size="small" color="error" style={{alignSelf: 'center'}}>
                <DeleteForeverRoundedIcon/>
            </Fab>
            <BasicTextFields name="Important Word"/>
            <InputSlider name="Important Word Frequency" />
        </Stack>
    )
}

