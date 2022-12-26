// TYPES
import { GET_OPERATIONS, SET_OPERATIONS_GRID_LOADING } from "./operationTypes";

const initialState = {
    operations: {},
    operationsGridLoading: false,
}

const operationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_OPERATIONS:
            return {
                ...state,
                operations: action.payload
            }
        case SET_OPERATIONS_GRID_LOADING:
            return {
                ...state,
                operationsGridLoading: action.payload
            }
        default:
            return state;
    }
}

export default operationReducer;