// TYPES
import { SET_OVERLAY, SET_DIALOG_DATA } from "./sharedTypes";

const initialState = {
    overlay: [],
    dialogData: {}
}

const sharedReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_OVERLAY:
            return {
                ...state,
                overlay: action.payload
            }
        case SET_DIALOG_DATA:
            console.log("reducer", action.payload);
            return {
                ...state,
                dialogData: action.payload
            }
        default:
            return state;
    }
}

export default sharedReducer;