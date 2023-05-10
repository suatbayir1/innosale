// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { Header } from '../../components';
import withRouter from '../../shared/hoc/withRouter';
import ThreeScene from '../components/ThreeScene';
import { Button, Stack } from '@mui/material';
import { SceneService } from '../../shared/services';
import { Navigate } from 'react-router-dom';

const styles = theme => ({
    root: {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
        }
    }
});

class ThreeJS extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            container1: document.getElementById("partModelPreviewScene1"),
            container2: document.getElementById("partModelPreviewScene2")
            
        }
    }

    async componentDidMount() {
        await this.wait_for_seconds(1)
        await this.setState({
            container1: document.getElementById("partModelPreviewScene1"),
            container2: document.getElementById("partModelPreviewScene2")
        })
    }

    wait_for_seconds = (second) => {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    handleClick = (teklif_id) => {
        const url = `/three_environment/${teklif_id}`;
        window.open(url, '_blank');
        return <Navigate to={url} target="_blank" />
    };
    
    render() {
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="3D Similarity" title="ThreeJS Worksheet" />
                <div style={{ flex: 1, display: 'row', flexDirection: 'row' }}>
                <Button onClick={() => this.handleClick(5)}>ID. 5</Button>
                <Button onClick={() => this.handleClick(6)}>ID. 6</Button>
                <Button onClick={() => this.handleClick(7)}>ID. 7</Button>
                    
                    <Stack direction={"row"}>
                        <Stack id="partModelPreviewScene1">
                            <ThreeScene
                                partModelPreviewScene = {this.state.container1}
                                width = {500} height = {500}
                                color = "red"
                                url = {this.props.onlyUrl}
                            />
                        </Stack>
                        <Stack id="partModelPreviewScene2">
                            <ThreeScene
                                partModelPreviewScene = {this.state.container2}
                                width = {500} height = {500}
                                color = "green"
                            />
                        </Stack>
                    </Stack>
                    
                </div>
            </div>
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

export default withRouter(withStyles(styles)(connect(mstp, mdtp)(ThreeJS)));