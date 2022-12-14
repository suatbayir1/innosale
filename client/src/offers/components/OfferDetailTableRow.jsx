// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

// Components
import { Header, EmptyState } from '../../components';
import OfferDetailTableRowPartDetail from './OfferDetailTableRowPartDetail';
import OfferDetailTableRowOperationDetail from './OfferDetailTableRowOperationDetail';

// Actions
import { getOperationsByOfferId } from "../../store/index";

// Constants
import notFoundImage from '../../data/notfound.png'

class OfferDetailTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }
    }

    componentDidMount = async () => {
        const { getOperationsByOfferId, setOfferDetailPageLoading, params } = this.props;
        await getOperationsByOfferId(params.id)
    }

    render() {
        const { open } = this.state;
        const { row, operationsByOfferId } = this.props;

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell component="th" scope="row">{row.teklif_no}</TableCell>
                    <TableCell>{row.teklif_id}</TableCell>
                    <TableCell>{row.sac_kalinlik}</TableCell>
                    <TableCell>{row.sac_cinsi}</TableCell>
                    <TableCell>{row.net_x}</TableCell>
                    <TableCell>{row.net_y}</TableCell>
                    <TableCell>{row.kontur_boyu}</TableCell>
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
                                <OfferDetailTableRowPartDetail row={row} />
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

                                {
                                    operationsByOfferId.length === 0 ?

                                        <EmptyState
                                            minHeight={'50vh'}
                                            image={notFoundImage}
                                            primaryMessage={'No asset created yet'}
                                            secondaryMessage={'No operation records related with this offer were found. Create a offer now.'}
                                            buttonClick={() => { this.add() }}
                                            buttonText={'Create Operation'}
                                        />
                                        :
                                        <OfferDetailTableRowOperationDetail row={row} operationsByOfferId={operationsByOfferId} />
                                }
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
};

const mstp = (state) => {
    return {
        operationsByOfferId: state.operation.operationsByOfferId,
    }
}

const mdtp = (dispatch) => {
    return {
        getOperationsByOfferId: (payload) => dispatch(getOperationsByOfferId(payload)),
    }
}

export default connect(mstp, mdtp)(OfferDetailTableRow);