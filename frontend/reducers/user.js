import {LOGIN_SUCCES, LOGIN_FAIL, LOGIN_REQUEST, LOGOUT_SUCCESS, REFRESH_FAIL} from "../constants/User";

const initialState = {
    user: null,
    fetching: false,
    error: ''
};

export default function user(state = initialState, action) {

    switch (action.type) {

        case LOGOUT_SUCCESS:
            return {...state, user: initialState.user};

        case REFRESH_FAIL:
            return {...state, user: initialState.user, error: action.payload.message};

        case LOGIN_REQUEST:
            return {...state, error: '', fetching: true};

        case LOGIN_SUCCES:
            return {...state, user: action.payload, error: '', fetching: false};

        case LOGIN_FAIL:
            return {...state, error: action.payload.message, fetching: false};

        default:
            return state;

    }

}
