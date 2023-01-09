// Libraries
import React, { Component } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

class EmptyState extends Component {
    render() {
        const { buttonClick, minHeight, primaryMessage, secondaryMessage, image, buttonText } = this.props;

        return (
            <Grid
                container
                spacing={0}
                align="center"
                justifyContent="center"
                direction="column"
                minHeight={minHeight}
            >
                <p>
                    <img className="rounded-lg h-100 w-24" src={image} alt="" />
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
                    {primaryMessage}
                </p>
                <p className="text-2xl text-gray-400 mt-3">
                    {secondaryMessage}
                </p>
                <p className="mt-3">
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => { buttonClick() }}>
                        {buttonText}
                    </Button>
                </p>
            </Grid>
        )
    }
}

export default EmptyState;