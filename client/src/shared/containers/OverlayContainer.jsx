// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import AudioFileOverlay from '../../nlp/overlays/AudioFileOverlay';
import PartOverlay from '../../parts/overlays/PartOverlay';

// Actions
import { setOverlay } from "../../store/index";

class OverlayContainer extends Component {
    getOverlay = () => {
        const { overlay } = this.props;

        switch (overlay) {
            case 'add-audio-file':
                return <AudioFileOverlay />
            case 'add-part':
                return <PartOverlay />
            default: return null
        }
    }

    render() {

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
