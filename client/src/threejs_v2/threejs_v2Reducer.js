// TYPES
import { FILES_LIST, PART_PRESET } from "./threejs_v2Types";

const initialState = {
}

const threejs_v2Reducer = (state = initialState, action) => {
    switch (action.type) {          
        case FILES_LIST:
            return {
                ...state,
                files_list: action.payload
            }
        case PART_PRESET:
            return {
                ...state,
                part_preset: action.payload
            }
            
        default:
            return state;
    }
}

export default threejs_v2Reducer;