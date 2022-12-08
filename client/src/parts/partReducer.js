// TYPES
import { GET_PARTS, SET_PARTS_GRID_LOADING } from "./partTypes";

const initialState = {
    parts: {},
    partsGridLoading: false,
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
        default:
            return state;
    }
}

export default partReducer;