// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// Components
import { Header, OfferDetailTableRow } from '../../components';


class OfferDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const rows = [
            {
                name: "Frozen Yoghurt",
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                price: 3.99,
                history: [
                    {
                        date: '2020-01-05',
                        customerId: '11091700',
                        amount: 3,
                    },
                    {
                        date: '2020-01-02',
                        customerId: 'Anonymous',
                        amount: 1,
                    },
                ]
            },
            {
                name: "Frozen Yoghurt",
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                price: 3.99,
                history: [
                    {
                        date: '2020-01-05',
                        customerId: '11091700',
                        amount: 3,
                    },
                    {
                        date: '2020-01-02',
                        customerId: 'Anonymous',
                        amount: 1,
                    },
                ]
            }, {
                name: "Frozen Yoghurt",
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                price: 3.99,
                history: [
                    {
                        date: '2020-01-05',
                        customerId: '11091700',
                        amount: 3,
                    },
                    {
                        date: '2020-01-02',
                        customerId: 'Anonymous',
                        amount: 1,
                    },
                ]
            }, {
                name: "Frozen Yoghurt",
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                price: 3.99,
                history: [
                    {
                        date: '2020-01-05',
                        customerId: '11091700',
                        amount: 3,
                    },
                    {
                        date: '2020-01-02',
                        customerId: 'Anonymous',
                        amount: 1,
                    },
                ]
            },
        ];
        const open = true;

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Sales Case Company Name" title="Offer Details" />
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Teklif No</TableCell>
                                <TableCell>Teklif Id</TableCell>
                                <TableCell>Sac Kalınlık</TableCell>
                                <TableCell>Sac Cinsi</TableCell>
                                <TableCell>Net X</TableCell>
                                <TableCell>Net Y</TableCell>
                                <TableCell>Kontur Boyu</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <OfferDetailTableRow key={row.name} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div >
        );
    }
};

const mstp = (state) => {
    return {
    }
}

const mdtp = (dispatch) => {
    return {
    }
}

export default connect(mstp, mdtp)(OfferDetail);