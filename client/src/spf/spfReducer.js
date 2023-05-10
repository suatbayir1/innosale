// TYPES
import { GET_PARTS, TEKLIF_ID_LIST, SIMILAR_PARTS } from "./spfTypes";

const initialState = {
    parts: {},
    part: [],
    partsGridLoading: false,
    partOverlayLoading: false,
}

const spfReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PARTS:
            return {
                ...state,
                parts: action.payload
            }
        case TEKLIF_ID_LIST:
            return {
                ...state,
                teklif_ids: action.payload
            }
        case SIMILAR_PARTS:
            return {
                ...state,
                similar_parts: action.payload
            }
        default:
            return state;
    }
}

export default spfReducer;