// TYPES
import { GET_OFFERS, SET_OFFER_OVERLAY_LOADING, SET_OFFERS_GRID_LOADING, OFFER_DETAIL_PAGE_LOADING } from "./offerTypes";

const initialState = {
    offers: {},
    offersGridLoading: false,
    offerOverlayLoading: false,
    offerDetailPageLoading: false,
}

const offerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_OFFERS:
            return {
                ...state,
                offers: action.payload
            }
        case SET_OFFERS_GRID_LOADING:
            return {
                ...state,
                offersGridLoading: action.payload
            }
        case SET_OFFER_OVERLAY_LOADING:
            return {
                ...state,
                offerOverlayLoading: action.payload
            }
        case OFFER_DETAIL_PAGE_LOADING:
            console.log("reducer", action.payload);
            return {
                ...state,
                offerDetailPageLoading: action.payload
            }
        default:
            return state;
    }
}

export default offerReducer;