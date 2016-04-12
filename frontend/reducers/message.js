import {GET_MESSAGES_FAIL, GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS} from "../constants/Messages";

const initialState = {
    messages: [],
    paging: {
        page: 1,
        totalPages: 1,
        totalElements: 0
    },
    fetching: false,
    error: ''
};

export default function message(state = initialState, action) {

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
                messages: action.payload.records,
                paging: action.payload.paging,
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
