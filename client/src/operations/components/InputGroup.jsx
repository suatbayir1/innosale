import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default class InputGroup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { firstTitle, secondTitle, marginTop } = this.props;

        return (
            <Grid item xs={12} md={12}>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900" style={{ marginTop }}>
                    {firstTitle}
                </p>
                <p className="text-lg text-gray-400">
                    {secondTitle}
                </p>
                <Divider style={{ marginTop: '10px', marginBottom: '20px' }} />
            </Grid>
        )
    }
}
