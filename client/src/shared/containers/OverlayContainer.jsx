// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import UploadAudioFile from '../../nlp/overlays/UploadAudioFile';

// Actions
import { setOverlay } from "../../store/index";

class OverlayContainer extends Component {
    getOverlay = () => {
        const { overlay } = this.props;

        console.log("return", overlay);
        switch (overlay) {
            case 'add-audio-file':
                return <UploadAudioFile />
            default: return null
        }
    }

    render() {

        console.log("type", this.props.overlay);
        return (
            <>
                {this.getOverlay()}
            </>
        )
    }
}


const mstp = (state) => {
    return {
        overlay: state.shared.overlay
    }
}

const mdtp = (dispatch) => {
    return {
        setOverlay: (payload) => dispatch(setOverlay(payload))
    }
}

export default connect(mstp, mdtp)(OverlayContainer);
