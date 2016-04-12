import {LOGIN_REQUEST, LOGIN_SUCCES, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_REQUEST, REFRESH_FAIL, REFRESH_REQUEST, REFRESH_SUCCESS} from "../constants/User";
import {platform} from "../utils/rc";

export function loginRequest() {
    return {type: LOGIN_REQUEST};
}

export function loginSuccess(user) {
    return {type: LOGIN_SUCCES, payload: user};
}

export function loginFail(e) {
    return {type: LOGIN_FAIL, payload: e, error: true};
}

export function logoutRequest() {
    return {type: LOGOUT_REQUEST};
}

export function logoutSuccess() {
    return {type: LOGOUT_SUCCESS};
}

export function logoutFail(e) {
    return {type: LOGOUT_SUCCESS, payload: e, error: true};
}

export function refreshRequest() {
    return {type: REFRESH_REQUEST};
}

export function refreshSuccess() {
    return {type: REFRESH_SUCCESS};
}

export function refreshFail(e) {
    return {type: REFRESH_FAIL, payload: e, error: true};
}

export function handleLogin({username, extension, password}) {
    return function(dispatch) {
        platform.login({username, extension, password});
    }
}

export function handleLogout() {
    return function(dispatch) {
        platform.logout();
    }
}
