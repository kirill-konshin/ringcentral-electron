import {platform} from "../utils/rc";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCES = 'LOGIN_SUCCES';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export const REFRESH_REQUEST = 'REFRESH_REQUEST';
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS';
export const REFRESH_FAIL = 'REFRESH_FAIL';

// Action Creators

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
    return {type: LOGOUT_FAIL, payload: e, error: true};
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

// Actions

export function handleLogin({username, extension, password}) {
    return {
        type: 'X_LOGIN',
        payload: platform.login({username, extension, password})
    };
}

export function handleLogout() {
    return {
        type: 'X_LOGOUT',
        payload: platform.logout()
    };
}

// Service functions

export function dispatchUserEventsToStore(store) {

    function getUser() {
        return platform.get('/account/~/extension/~')
            .then((res)=> {
                store.dispatch(loginSuccess(res.json()));
            })
            .catch((e)=> {
                store.dispatch(loginFail(e));
                console.error(e.stack);
                throw e;
            });
    }

    // Refresh

    platform.on(platform.events.beforeRefresh, () => { store.dispatch(refreshRequest()); });
    platform.on(platform.events.refreshSuccess, (res)=> { store.dispatch(refreshSuccess()); });
    platform.on(platform.events.refreshError, (e)=> {
        store.dispatch(refreshFail(e));
    });

    // Logout

    platform.on(platform.events.beforeLogout, () => { store.dispatch(logoutRequest()); });
    platform.on(platform.events.logoutSuccess, (res) => {
        store.dispatch(logoutSuccess());
    });
    platform.on(platform.events.logoutError, (e) => { store.dispatch(logoutFail(e)); });

    // Login

    platform.on(platform.events.beforeLogin, () => { store.dispatch(loginRequest()); });
    platform.on(platform.events.loginSuccess, (res) => { getUser(); });
    platform.on(platform.events.loginError, (e) => { store.dispatch(loginFail(e)); });

    // Bootstrapping

    platform.loggedIn() // when app is starting -- log in
        .then(() => {
            return getUser();
        })
        .then((res)=> {
            store.dispatch(loginSuccess(res.json()));
        })
        .catch((e)=> {
            //do nothing, failed automatic login is no big deal
            //store.dispatch(loginFail(e));
        });

}

// Reducer

const initialState = {
    user: null,
    fetching: false,
    error: ''
};

export function userReducer(state = initialState, action) {

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
