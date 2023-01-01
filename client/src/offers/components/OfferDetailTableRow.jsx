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
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BlindIcon from '@mui/icons-material/Blind';

// Components
import { Header } from '../../components';


class OfferDetailTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }
    }

    render() {
        const { open } = this.state;
        const { row } = this.props;

        let item = {
            icon: <FiShoppingCart />,
            amount: '-$560',
            title: 'Top Sales',
            desc: 'Johnathan Doe',
            iconBg: '#FB9678',
            pcColor: 'red-600',
        };

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell component="th" scope="row">001-2020</TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>{row.fat}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => { this.setState({ open: !open }) }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => { this.setState({ open: !open }) }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => { this.setState({ open: !open }) }}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>                                            <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <div>
                                            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                                                Sac Kalınlık
                                            </p>
                                            <p className="text-lg text-gray-400">XES</p>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={1} md={1}>
                                        <div>
                                            <p className="text-lg text-gray-700">Operations</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={9} md={9}>
                                        <Divider style={{ marginTop: '15px' }} />
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            style={{ textTransform: 'none', width: '100%' }}
                                            color="primary"
                                        >
                                            Add Operation
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <BlindIcon className='text-2xl' color='error' />
                                                            <p className="text-lg text-gray-700">FORM VERME</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">K value</p>
                                                                <p className="text-sm text-gray-400">0.5</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">Packaging</p>
                                                                <p className="text-sm text-gray-400">1400</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8} md={8}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">RL</p>
                                                                    <p className="text-sm text-gray-400">T</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Presler</p>
                                                                    <p className="text-sm text-gray-400">160T;ZTS;03.004.0026</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut X</p>
                                                                    <p className="text-sm text-gray-400">400</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut Y</p>
                                                                    <p className="text-sm text-gray-400">300</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Doluluk</p>
                                                                    <p className="text-sm text-gray-400">0,5</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Euro Kg</p>
                                                                    <p className="text-sm text-gray-400">1,8</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Ağırlık</p>
                                                                    <p className="text-sm text-gray-400">586</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAD</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAM</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">2D</p>
                                                                    <p className="text-sm text-gray-400">12</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">BCNC</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">KCNC</p>
                                                                    <p className="text-sm text-gray-400">493</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">GCNC</p>
                                                                    <p className="text-sm text-gray-400">3423</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">MONTAJ</p>
                                                                    <p className="text-sm text-gray-400">67</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">DNM</p>
                                                                    <p className="text-sm text-gray-400">56</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">ÖLÇÜM</p>
                                                                    <p className="text-sm text-gray-400">16</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={4} md={4}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <BlindIcon className='text-2xl' color='error' />
                                                            <p className="text-lg text-gray-700">ÇEVRE KESME & DELME</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">K value</p>
                                                                <p className="text-sm text-gray-400">0.5</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">Packaging</p>
                                                                <p className="text-sm text-gray-400">1400</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8} md={8}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">RL</p>
                                                                    <p className="text-sm text-gray-400">T</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Presler</p>
                                                                    <p className="text-sm text-gray-400">160T;ZTS;03.004.0026</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut X</p>
                                                                    <p className="text-sm text-gray-400">400</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut Y</p>
                                                                    <p className="text-sm text-gray-400">300</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Doluluk</p>
                                                                    <p className="text-sm text-gray-400">0,5</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Euro Kg</p>
                                                                    <p className="text-sm text-gray-400">1,8</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Ağırlık</p>
                                                                    <p className="text-sm text-gray-400">586</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAD</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAM</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">2D</p>
                                                                    <p className="text-sm text-gray-400">12</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">BCNC</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">KCNC</p>
                                                                    <p className="text-sm text-gray-400">493</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">GCNC</p>
                                                                    <p className="text-sm text-gray-400">3423</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">MONTAJ</p>
                                                                    <p className="text-sm text-gray-400">67</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">DNM</p>
                                                                    <p className="text-sm text-gray-400">56</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">ÖLÇÜM</p>
                                                                    <p className="text-sm text-gray-400">16</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={4} md={4}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <BlindIcon className='text-2xl' color='error' />
                                                            <p className="text-lg text-gray-700">KONTROL FİKSTÜRÜ (GELENEKSEL)</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">K value</p>
                                                                <p className="text-sm text-gray-400">0.5</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2} md={2}>
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                style={{ background: item.iconBg }}
                                                                className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                                            >
                                                                {item.icon}
                                                            </button>
                                                            <div>
                                                                <p className="text-md font-semibold">Packaging</p>
                                                                <p className="text-sm text-gray-400">1400</p>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8} md={8}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">RL</p>
                                                                    <p className="text-sm text-gray-400">T</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Presler</p>
                                                                    <p className="text-sm text-gray-400">160T;ZTS;03.004.0026</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut X</p>
                                                                    <p className="text-sm text-gray-400">400</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Boyut Y</p>
                                                                    <p className="text-sm text-gray-400">300</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Doluluk</p>
                                                                    <p className="text-sm text-gray-400">0,5</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Euro Kg</p>
                                                                    <p className="text-sm text-gray-400">1,8</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">Kalıp Ağırlık</p>
                                                                    <p className="text-sm text-gray-400">586</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAD</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">CAM</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">2D</p>
                                                                    <p className="text-sm text-gray-400">12</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">BCNC</p>
                                                                    <p className="text-sm text-gray-400">49</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">KCNC</p>
                                                                    <p className="text-sm text-gray-400">493</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">GCNC</p>
                                                                    <p className="text-sm text-gray-400">3423</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">MONTAJ</p>
                                                                    <p className="text-sm text-gray-400">67</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">DNM</p>
                                                                    <p className="text-sm text-gray-400">56</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={2} md={2}>
                                                                <div>
                                                                    <p className="text-md font-semibold">ÖLÇÜM</p>
                                                                    <p className="text-sm text-gray-400">16</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={4} md={4}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">10065</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} md={4}>
                                                                <div className="flex gap-4">
                                                                    <BlindIcon className='text-2xl' color='error' />
                                                                    <p className="text-lg text-gray-700">500</p>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
};

export default OfferDetailTableRow;