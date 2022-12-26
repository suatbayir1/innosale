import InputSlider from "../../components/Slider";
import { Fab, Stack } from "@mui/material";
import SummarizeSettingSelect from "../../components/SummarizeSettingSelect";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

export default function entities (name_, freq_) {
    let name = name_;
    let freq = freq_;

    return(
        <Stack direction='row' spacing={7}>
            <Fab size="small" color="error" style={{alignSelf: 'center'}}>
                <DeleteForeverRoundedIcon/>
            </Fab>
            <SummarizeSettingSelect />
            <InputSlider name="Entity Frequency" />
        </Stack>
    )
}

