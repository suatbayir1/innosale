import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { ButtonBase } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(value, list, theme) {
    return {
        fontWeight:
            list.indexOf(value) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function FilterSelect(props) {
    const theme = useTheme()

    return (
        <div>
            <FormControl sx={{ minWidth: props.minWidth }}>
                <InputLabel id="multiple-chip-label">{props.header}</InputLabel>
                <Select
                    labelId="multiple-chip-label"
                    id="multiple-chip"
                    multiple
                    value={props.filterValue}
                    onChange={props.handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label={props.header} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {
                                selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        clickable
                                        deleteIcon={
                                            <CancelIcon
                                                onMouseDown={(event) => event.stopPropagation()}
                                            />
                                        }
                                        onDelete={() => props.handleDelete(value)}
                                        onClick={() => console.log("click")}
                                    />
                                ))
                            }
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {props.filterList.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, props.filterValue, theme)}
                    >
                        {name}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}