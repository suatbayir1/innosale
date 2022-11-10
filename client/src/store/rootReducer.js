// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "../auth/authReducer";
import partReducer from "../parts/partReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    part: partReducer
});

export default rootReducer;
