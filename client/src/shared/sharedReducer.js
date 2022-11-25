// TYPES
import { SET_OVERLAY } from "./sharedTypes";

const initialState = {
    overlay: [],
}

const sharedReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_OVERLAY:
            return {
                ...state,
                overlay: action.payload
            }
        default:
            return state;
    }
}

export default sharedReducer;