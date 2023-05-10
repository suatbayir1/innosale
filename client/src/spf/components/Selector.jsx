import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function Selector (props) {
    const { id, disabled, header, value, setValue, items } = props

    return (
        <FormControl fullWidth>
            <InputLabel id={`${id}-label`}>{header}</InputLabel>
            <Select
                disabled = {disabled}
                labelId = {`${id}-label`}
                id = {id}
                name = {id}
                value = {value}
                label = {header}
                onChange = {setValue}
            >
                {
                    items.map((item) => {
                        return <MenuItem key={item.key} value={item.value}>{item.text}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}