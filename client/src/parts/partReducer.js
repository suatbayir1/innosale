// TYPES
import { GET_PARTS } from "./partTypes";

const initialState = {
    parts: {},
    parts_total_count: 0
}

const partReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PARTS:
            return {
                ...state,
                parts: action.payload.data,
                parts_total_count: action.payload.parts_total_count
            }
        default:
            return state;
    }
}

export default partReducer;