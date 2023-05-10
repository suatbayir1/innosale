import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable(props) {
    function sec_to_hms (seconds) {
        const format = val => `${Math.floor(val)}`
        const hours = seconds / 3600
        const minutes = (seconds % 3600) / 60
        
        return [hours, minutes, seconds % 60].map(format).join(':')
    }

    function convert(seconds) {
        seconds = parseInt(seconds) % (24 * 3600);
        let hour = seconds // 3600
        seconds %= 3600;
        let minutes = seconds // 60
        seconds %= 60

        return hour + ':' + minutes + ':' + seconds
        return (hour > 9 ? hour : '0' + hour) + ':' + (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds)
    }
    
    return (
        <TableContainer style = {{ width: '100%', maxHeight: '300px' }} component={Paper}>
        <Table style = {{ width: '100%' }} stickyHeader aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell align="center">Line</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Estimated Transcribe Time</TableCell>
                <TableCell align="center">Estimated Wait Time</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Sound Length</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.items.map((item) => (
                
                <TableRow
                key={item.line}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell align="center" component="th" scope="row">
                    {item.line}
                </TableCell>
                <TableCell align="center">{props.currentHash == item.hash ? item.status + " (you)" : item.status}</TableCell>
                <TableCell align="center">{sec_to_hms(item.est_transcribe_time)}</TableCell>
                <TableCell align="center">{sec_to_hms(item.est_wait_time)}</TableCell>
                <TableCell align="center">{item.model_name.charAt(0).toUpperCase() + item.model_name.slice(1)}</TableCell>
                <TableCell align="center">{sec_to_hms(item.sound_len)}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}