// TYPES
import { SET_AUDIOS } from "./nlpTypes";

const initialState = {
    audios: [],
}

const nlpReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUDIOS:
            return {
                ...state,
                audios: action.payload
            }
        default:
            return state;
    }
}

export default nlpReducer;