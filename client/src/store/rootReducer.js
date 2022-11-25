// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "../auth/authReducer";
import partReducer from "../parts/partReducer";
import sharedReducer from "../shared/sharedReducer"
import nlpReducer from "../nlp/nlpReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    part: partReducer,
    shared: sharedReducer,
    nlp: nlpReducer,
});

export default rootReducer;
