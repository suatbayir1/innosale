// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import AudioFileOverlay from '../../nlp/overlays/AudioFileOverlay';

// Actions
import { setOverlay } from "../../store/index";

class OverlayContainer extends Component {
    getOverlay = () => {
        const { overlay } = this.props;

        switch (overlay) {
            case 'add-audio-file':
                return <AudioFileOverlay />
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
