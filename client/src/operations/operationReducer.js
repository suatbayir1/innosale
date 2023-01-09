// TYPES
import { GET_OPERATIONS, SET_OPERATIONS_GRID_LOADING, GET_OPERATIONS_BY_OFFER_ID } from "./operationTypes";

const initialState = {
    operations: {},
    operationsGridLoading: false,
    operationsByOfferId: [],
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
        case GET_OPERATIONS_BY_OFFER_ID:
            return {
                ...state,
                operationsByOfferId: action.payload
            }
        default:
            return state;
    }
}

export default operationReducer;