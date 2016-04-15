import {platform} from "../utils/rc";
import typeToReducer from "type-to-reducer";

const GET_CALLS = 'GET_CALLS';

// Actions

let cache = null;

export function getCalls(page) {

    if (cache) {
        return {
            type: GET_CALLS + '_SUCCESS',
            payload: cache
        };
    }

    return {
        type: GET_CALLS,
        payload: platform
            .get('/account/~/extension/~/call-log', {
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

export const callReducer = typeToReducer({
    [GET_CALLS]: {
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