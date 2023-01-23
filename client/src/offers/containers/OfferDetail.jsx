// Libraries
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

// Components
import { Header, OfferDetailTableRow, EmptyState } from '../../components';

// Actions
import { setOverlay, setDialogData, getPartsByOfferId, setOfferDetailPageLoading } from "../../store/index";

// HOC
import withRouter from '../../shared/hoc/withRouter';

// Constants
import notFoundImage from '../../data/notfound.png'

class OfferDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount = async () => {
        const { getPartsByOfferId, setOfferDetailPageLoading, params } = this.props;
        await setOfferDetailPageLoading(true);
        await getPartsByOfferId(params.id)
    }

    add = () => {
        const { setOverlay, setDialogData, params } = this.props;

        setOverlay("add-part")
        setDialogData({ "mode": "add", "title": "Add Part", "data": { teklif_id: params.id } });
    }

    render() {
        const { part, operationsByOfferId, params, offerDetailPageLoading } = this.props;

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Sales Case Company Name" title="Offer Details" />

                {
                    offerDetailPageLoading ? <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: '400px'
                    }}>
                        <CircularProgress size={200} thickness={1} />
                    </Box>
                        :
                        <>
                            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                <Grid item xs={2} md={2}>
                                    <Link to={`/audio-files/${params.id}`}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            style={{ textTransform: 'none', width: '100%' }}
                                            color="primary"
                                        >
                                            Audio Files
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            {
                                part.length === 0 ?
                                    <EmptyState
                                        minHeight={'50vh'}
                                        image={notFoundImage}
                                        primaryMessage={'No asset created yet'}
                                        secondaryMessage={'No part records related with this offer were found. Create a part now.'}
                                        buttonClick={() => { this.add() }}
                                        buttonText={"Create Part"}
                                    />
                                    :
                                    <>
                                        <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                            <Grid item xs={12} md={12}>
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
                                                            {part.map((row) => (
                                                                <OfferDetailTableRow key={row.id} row={row} params={params} />
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Grid>
                                    </>
                            }
                        </>
                }
            </div >
        );
    }
};

const mstp = (state) => {
    return {
        part: state.part.part,
        offerDetailPageLoading: state.offer.offerDetailPageLoading,
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload)),
        setDialogData: (payload) => dispatch(setDialogData(payload)),
        getPartsByOfferId: (payload) => dispatch(getPartsByOfferId(payload)),
        setOfferDetailPageLoading: (payload) => dispatch(setOfferDetailPageLoading(payload)),
    }
}

export default withRouter(connect(mstp, mdtp)(OfferDetail));