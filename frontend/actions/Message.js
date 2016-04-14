import {platform} from "../utils/rc";
import typeToReducer from "type-to-reducer";

const GET_MESSAGES = 'GET_MESSAGES';

// Actions

let cache = null;

export function getMessages(page) {

    if (cache) {
        return {
            type: 'GET_MESSAGES_SUCCESS',
            payload: cache
        };
    }

    return {
        type: GET_MESSAGES,
        payload: platform
            .get('/account/~/extension/~/message-store', {
                // page: page,
                dateFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
            }) //, {}
            .then((res)=> {
                cache = res.json();
                return cache;
            })
    };

}

// Reducer

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

export const messageReducer = typeToReducer({
    [GET_MESSAGES]: {
        PENDING: (state, action)=> {
            return {
                ...state,
                fetching: true,
                error: ''
            };
        },
        SUCCESS: (state, action)=> {
            return {
                ...state,
                ...action.payload,
                fetching: false,
                error: ''
            };
        },
        ERROR: (state, action)=> {
            return {
                ...state,
                error: action.payload.message,
                fetching: false
            };
        }
    }
}, initialState);