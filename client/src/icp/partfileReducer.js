// TYPES
import { GET_ALL_PARTS, CALCULATE_TABLE_FEATURE, CALCULATE_TABLE_HYBRID, CENTER, ALL_PARTS, GET_CENTER, PARTS, TABLE, CALCULATING, CALCULATE_TABLE, GET_URL, URL, GET_FILTERED_PARTS, FEATURES, GET_FEATURES, FILE_SPECS, FILE_LIST, TEKLIF_ID_LIST, PART_PROCESS_LIST } from "./partfileTypes";

const initialState = {
    parts: {},
    table: {},
    calculating: 0, // 0: waiting for input, 1: calculating, 2: completed calculation
    url: "",
    features: {},
    center: {},
    fileSpecs: {}
}
 
const partReducer = (state = initialState, action) => {
    switch (action.type) {
        case PARTS:
            return {
                ...state,
                parts: action.payload
            }
        case CENTER:
            return {
                ...state,
                center: action.payload
            }
        case ALL_PARTS:
            return {
                ...state,
                allParts: action.payload
            }
        case CALCULATING:
            return {
                ...state,
                calculating: action.payload
            }
        case FEATURES:
            return {
                ...state,
                features: action.payload
            }
        case TABLE:
            return {
                ...state,
                table: action.payload
            }
        case URL:
            return {
                ...state,
                url: action.payload
            }
        case GET_FILTERED_PARTS:
            return {
                ...state,
            }
        case GET_CENTER:
            return {
                ...state,
            }
        case GET_ALL_PARTS:
            return {
                ...state,
            }
        case CALCULATE_TABLE:
            return {
                ...state,
            }
        case CALCULATE_TABLE_FEATURE:
            return {
                ...state,
            }
        case CALCULATE_TABLE_HYBRID:
            return {
                ...state,
            }
        case GET_URL:
            return {
                ...state,
            }
        case GET_FEATURES:
            return {
                ...state,
            }
        case FILE_SPECS:
            return {
                ...state,
                fileSpecs: action.payload
            }
        case FILE_LIST:
            return {
                ...state,
                fileList: action.payload
            }
        case TEKLIF_ID_LIST:
            return {
                ...state,
                teklifIdList: action.payload
            }
        case PART_PROCESS_LIST:
            return {
                ...state,
                partProcessList: action.payload
            }
        default:
            return state;
    }
}

export default partReducer;
