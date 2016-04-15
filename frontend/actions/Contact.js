import {platform} from "../utils/rc";
import typeToReducer from "type-to-reducer";

const GET_CONTACTS = 'GET_CONTACTS';

// Actions

let cache = null;

export function getContacts(page) {

    if (cache) {
        return {
            type: GET_CONTACTS + '_SUCCESS',
            payload: cache
        };
    }

    return {
        type: GET_CONTACTS,
        payload: platform
            .get('/account/~/extension/~/address-book', {
                // page: page
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

export const contactsReducer = typeToReducer({
    [GET_CONTACTS]: {
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