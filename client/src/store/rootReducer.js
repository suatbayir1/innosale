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
import threejsReducer from "../threejs/threejsReducer";
import threejs_v2Reducer from "../threejs_v2/threejs_v2Reducer";
import threejs_v3Reducer from "../threejs_v3/threejs_v3Reducer";
import loginReducer from "../login/loginReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    part: partReducer,
    operation: operationReducer,
    shared: sharedReducer,
    nlp: nlpReducer,
    offer: offerReducer,
    icp: partfileReducer,
    spf: spfReducer,
    threejs: threejsReducer,
    threejs_v2: threejs_v2Reducer,
    threejs_v3: threejs_v3Reducer,
    login: loginReducer
    
    
});

export default rootReducer;
