// TYPES
import { SET_AUDIOS, UPLOAD_AUDIO_LOADING, SUMMARIZE_SETTINGS } from "./nlpTypes";

const initialState = {
    audios: [],
    uploadAudioLoading: false,
}

const nlpReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUDIOS:
            return {
                ...state,
                audios: action.payload
            }
        case UPLOAD_AUDIO_LOADING:
            return {
                ...state,
                uploadAudioLoading: action.payload,
            }
        case SUMMARIZE_SETTINGS:
            return {
                ...state,
                summarizeSettings: action.payload
            }
        default:
            return state;
    }
}

export default nlpReducer;