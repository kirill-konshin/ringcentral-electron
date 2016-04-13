import {platform} from "../utils/rc";

export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
export const GET_MESSAGES_FAIL = 'GET_MESSAGES_FAIL';

const initialState = {
    records: [],
    paging: {
        page: 0,
        totalPages: 0,
        totalElements: 0
    },
    fetching: false,
    error: ''
};

// Actions

export function getMessages(page) {

    page = page || 0;

    return (dispatch) => {

        dispatch({
            type: GET_MESSAGES_REQUEST,
            page: page
        });

        platform
            .get('/account/~/extension/~/message-store', {
                dateFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
            }) //, {page: page}
            .then((res)=> {
                dispatch({
                    type: GET_MESSAGES_SUCCESS,
                    payload: res.json()
                });
            })
            .catch(function(e) {
                dispatch({
                    type: GET_MESSAGES_FAIL,
                    error: true,
                    payload: e
                })
            });

    }

}

// Reducer

export function messageReducer(state = initialState, action) {

    switch (action.type) {
        case GET_MESSAGES_REQUEST:
            return {
                ...state,
                page: action.payload,
                fetching: true,
                error: ''
            };

        case GET_MESSAGES_SUCCESS:
            return {
                ...state,
                ...action.payload,
                fetching: false,
                error: ''
            };

        case GET_MESSAGES_FAIL:
            return {
                ...state,
                error: action.payload.message,
                fetching: false
            };

        default:
            return state;
    }

}
