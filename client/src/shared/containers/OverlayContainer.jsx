// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import AudioFileOverlay from '../../nlp/overlays/AudioFileOverlay';
import PartOverlay from '../../parts/overlays/PartOverlay';
import DetailOffer from '../../offers/overlays/DetailOffer';
import ConfirmationDialog from '../../components/ConfirmationDialogClass';
import OfferOverlay from '../../offers/overlays/OfferOverlay';
import TranscribeOverlay from '../../nlp/overlays/TranscribeOverlay';
import SummarizeOverlay from '../../nlp/overlays/SummarizeOverlay';
import OperationOverlay from '../../operations/overlays/OperationOverlay';

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
            case 'detail-offer':
                return <DetailOffer />
            case 'add-offer':
                return <OfferOverlay />
            case 'summarize-settings':
                return <ConfirmationDialog />
            case 'transcribe-overlay':
                return <TranscribeOverlay />
            case 'summarize-overlay':
                return <SummarizeOverlay />
            case 'operation-overlay':
                return <OperationOverlay />
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
