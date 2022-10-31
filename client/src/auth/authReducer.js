// TYPES
import { LOGIN } from "./authTypes";

const initialState = {
    user: {},
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload,
            }
        default:
            return state;
    }
}

export default authReducer;