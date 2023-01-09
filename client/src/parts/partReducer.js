// TYPES
import { GET_PARTS, SET_PARTS_GRID_LOADING, SET_PART_OVERLAY_LOADING, GET_PARTS_BY_OFFER_ID } from "./partTypes";

const initialState = {
    parts: {},
    part: [],
    partsGridLoading: false,
    partOverlayLoading: false,
}

const partReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PARTS:
            return {
                ...state,
                parts: action.payload
            }
        case SET_PARTS_GRID_LOADING:
            return {
                ...state,
                partsGridLoading: action.payload
            }
        case SET_PART_OVERLAY_LOADING:
            return {
                ...state,
                partOverlayLoading: action.payload
            }
        case GET_PARTS_BY_OFFER_ID:
            return {
                ...state,
                part: action.payload
            }
        default:
            return state;
    }
}

export default partReducer;