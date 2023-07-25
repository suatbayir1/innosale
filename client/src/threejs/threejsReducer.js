// TYPES
import { PART_BENDS, STL_DICT, OPERATIONS_PRESET } from "./threejsTypes";

const initialState = {
}

const threejsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PART_BENDS:
            return {
                ...state,
                part_bends: action.payload
            }
        case STL_DICT:
            return {
                ...state,
                stl_dict: action.payload
            }
        case OPERATIONS_PRESET:
            return {
                ...state,
                operations_preset: action.payload
            }
            
        default:
            return state;
    }
}

export default threejsReducer;