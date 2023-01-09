// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { SET_OFFER_OVERLAY_LOADING, SET_OFFERS_GRID_LOADING, GET_OFFERS, OFFER_DETAIL_PAGE_LOADING } from "./offerTypes";

// Actions
import { setOverlay } from "../store";

export const setOffers = (payload) => {
    return {
        type: GET_OFFERS,
        payload,
    }
}

export const setOfferOverlayLoading = (payload) => {
    return {
        type: SET_OFFER_OVERLAY_LOADING,
        payload,
    }
}

export const setOffersGridLoading = (payload) => {
    return {
        type: SET_OFFERS_GRID_LOADING,
        payload,
    }
}

export const setOfferDetailPageLoading = (payload) => {
    return {
        type: OFFER_DETAIL_PAGE_LOADING,
        payload,
    }
}

export const addOffer = (payload) => {
    return (dispatch, getState) => {
        setOfferOverlayLoading(true);

        let url = `${process.env.REACT_APP_API_URL}/offer/add`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getOffers());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setOfferOverlayLoading(false));
            });
    }
}

export const updateOffer = (payload) => {
    return (dispatch, getState) => {
        setOfferOverlayLoading(true);

        let url = `${process.env.REACT_APP_API_URL}/offer/update`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getOffers());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setOfferOverlayLoading(false));
            });
    }
}

// Redux Thunk
export const getOffers = () => {
    return (dispatch, getState) => {
        setOffersGridLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/offer/getAll`;

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setOffers({
                        result: response.data.data,
                        count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                dispatch(setOffers({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setOffersGridLoading(false));
            });
    }
}
