// TYPES
import { SET_AUDIOS, UPLOAD_AUDIO_LOADING, SUMMARIZE_SETTINGS, SUMMARIZE_RESULT, ENTITY_LIST, SELECTED_SETTING, INSERTED_ID, SAMPLE_SUMMARIZE_RESULT, TRANSCRIBE_RESULTS, QUEUE_TABLE, HASH } from "./nlpTypes";

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
        case SUMMARIZE_RESULT:
            return {
                ...state,
                summarizeResult: action.payload
            }
        case SAMPLE_SUMMARIZE_RESULT:
            return {
                ...state,
                sampleSummarizeResult: action.payload
            }
        case ENTITY_LIST:
            return {
                ...state,
                entityList: action.payload
            }
        case SELECTED_SETTING:
            return {
                ...state,
                selectedSetting: action.payload
            }
        case INSERTED_ID:
            return {
                ...state,
                insertedId: action.payload
            }
        case TRANSCRIBE_RESULTS:
            return {
                ...state,
                transcribeResults: action.payload
            }
        case QUEUE_TABLE:
            return {
                ...state,
                queueTable: action.payload
            }
        case HASH:
            return {
                ...state,
                currentHash: action.payload
            }
        default:
            return state;
    }
}

export default nlpReducer;