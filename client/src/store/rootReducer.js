// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "../auth/authReducer";
import partReducer from "../parts/partReducer";
import sharedReducer from "../shared/sharedReducer"
import nlpReducer from "../nlp/nlpReducer";
import operationReducer from "../operations/operationReducer";
import offerReducer from "../offers/offerReducer";
import partfileReducer from "../icp/partfileReducer";
import spfReducer from "../spf/spfReducer";


const rootReducer = combineReducers({
    auth: authReducer,
    part: partReducer,
    operation: operationReducer,
    shared: sharedReducer,
    nlp: nlpReducer,
    offer: offerReducer,
    icp: partfileReducer,
    spf: spfReducer
});

export default rootReducer;
