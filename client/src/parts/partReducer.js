// TYPES
import { GET_PARTS } from "./partTypes";

const initialState = {
    parts: [],
}

const partReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PARTS:
            return {
                ...state,
                parts: action.payload
            }
        default:
            return state;
    }
}

export default partReducer;