import {platform, WebPhone} from "../utils/rc";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCES = 'LOGIN_SUCCES';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export const REFRESH_REQUEST = 'REFRESH_REQUEST';
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS';
export const REFRESH_FAIL = 'REFRESH_FAIL';

let webPhone;

const initialState = {
    user: null,
    fetching: false,
    error: ''
};

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
    return function(dispatch) {
        return platform.login({username, extension, password});
    }
}

export function handleLogout() {
    return function(dispatch) {
        return platform.logout();
    }
}

export function makeCall(to, from) {
    return function(dispatch) {
        return webPhone.userAgent.invite(to, {
            // fromNumber: 'PHONE_NUMBER', // Optional, Company Number will be used as default
            // homeCountryId: '1', // Optional, the value of
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        });
    }
}

export function acceptCall(session) {
    return function(dispatch) {
        return session.accept({
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        });
    }
}

// Service functions

export function dispatchEventsToStore(store) {

    function getUser() {
        return platform.get('/account/~/extension/~')
            .then((res)=> {
                store.dispatch(loginSuccess(res.json()));
            })
            .then(createWebPhone)
            .catch((e)=> {
                store.dispatch(loginFail(e));
                console.error(e.stack);
                throw e;
            });
    }

    function createWebPhone() {

        return platform
            .post('/client-info/sip-provision', {
                sipInfo: [{transport: 'WSS'}]
            })
            .then(function(res) {

                webPhone = new WebPhone(res.json(), { // optional
                    appKey: platform._appKey,
                    logLevel: 1, // error 0, warn 1, log: 2, debug: 3
                    audioHelper: {
                        enabled: true, // enables audio feedback when web phone is ringing or making a call
                        incoming: '../node_modules/ringcentral-web-phone/audio/incoming.ogg', // path to audio file for incoming call
                        outgoing: '../node_modules/ringcentral-web-phone/audio/outgoing.ogg' // path to aduotfile for outgoing call
                    },
                    onSession: (session) => {

                        var sessionId = 'Session event:';

                        console.log('Binding to session');
                        // console.log('From', session.request.from.displayName, session.request.from.friendlyName);
                        // console.log('To', session.request.to.displayName, session.request.to.friendlyName);

                        session.on('accepted', function() {
                            store.dispatch({type: 'PHONE_SESSION_ACCEPTED', payload: session});
                            console.log(sessionId, 'Accepted');
                        });
                        session.on('progress', function() {
                            store.dispatch({type: 'PHONE_SESSION_PROGRESS', payload: session});
                            console.log(sessionId, 'Progress');
                        });
                        session.on('rejected', function() { console.log(sessionId, 'Rejected'); });
                        session.on('failed', function() { console.log(sessionId, 'Failed'); });
                        session.on('terminated', function() {
                            store.dispatch({type: 'PHONE_SESSION_TERMINATED', payload: session});
                            console.log(sessionId, 'Terminated');
                        });
                        session.on('cancel', function() {console.log(sessionId, 'Cancel');});
                        session.on('refer', function() { console.log(sessionId, 'Refer');});
                        session.on('replaced', function(newSession) {
                            store.dispatch({type: 'PHONE_SESSION_REPLACED', payload: newSession});
                            console.log(sessionId, 'Replaced', 'old session', session, 'has been replaced with', newSession);
                        });
                        session.on('dtmf', function() { console.log(sessionId, 'DTMF'); });
                        session.on('muted', function() {
                            store.dispatch({type: 'PHONE_SESSION_MUTE', payload: session});
                            console.log(sessionId, 'Muted');
                        });
                        session.on('unmuted', function() {
                            store.dispatch({type: 'PHONE_SESSION_UNMUTE', payload: session});
                            console.log(sessionId, 'Unmuted');
                        });
                        session.on('connecting', function() { console.log(sessionId, 'Connecting'); });
                        session.on('bye', function() { console.log(sessionId, 'Bye'); });

                        // session.mediaHandler.on('iceConnection', function() { console.log(sessionId, 'ICE: iceConnection'); });
                        // session.mediaHandler.on('iceConnectionChecking', function() { console.log(sessionId, 'ICE: iceConnectionChecking'); });
                        // session.mediaHandler.on('iceConnectionConnected', function() { console.log(sessionId, 'ICE: iceConnectionConnected'); });
                        // session.mediaHandler.on('iceConnectionCompleted', function() { console.log(sessionId, 'ICE: iceConnectionCompleted'); });
                        // session.mediaHandler.on('iceConnectionFailed', function() { console.log(sessionId, 'ICE: iceConnectionFailed'); });
                        // session.mediaHandler.on('iceConnectionDisconnected', function() { console.log(sessionId, 'ICE: iceConnectionDisconnected'); });
                        // session.mediaHandler.on('iceConnectionClosed', function() { console.log(sessionId, 'ICE: iceConnectionClosed'); });
                        // session.mediaHandler.on('iceGatheringComplete', function() { console.log(sessionId, 'ICE: iceGatheringComplete'); });
                        // session.mediaHandler.on('iceGathering', function() { console.log(sessionId, 'ICE: iceGathering'); });
                        // session.mediaHandler.on('iceCandidate', function() { console.log(sessionId, 'ICE: iceCandidate'); });
                        // session.mediaHandler.on('userMedia', function() { console.log(sessionId, 'ICE: userMedia'); });
                        // session.mediaHandler.on('userMediaRequest', function() { console.log(sessionId, 'ICE: userMediaRequest'); });
                        // session.mediaHandler.on('userMediaFailed', function() { console.log(sessionId, 'ICE: userMediaFailed'); });

                        store.dispatch({type: 'PHONE_SESSION', payload: session});

                    }
                });

                webPhone.userAgent.on('invite', function(session) {
                    store.dispatch({type: 'PHONE_INVITE', payload: session});
                });

                console.log('WebPhone Created', webPhone);

                return webPhone;

            });

    }

    function removeWebPhone() {
        webPhone && webPhone.userAgent.unregister();
    }

    // Refresh

    platform.on(platform.events.beforeRefresh, () => { store.dispatch(refreshRequest()); });
    platform.on(platform.events.refreshSuccess, (res)=> { store.dispatch(refreshSuccess()); });
    platform.on(platform.events.refreshError, (e)=> {
        removeWebPhone();
        store.dispatch(refreshFail(e));
    });

    // Logout

    platform.on(platform.events.beforeLogout, () => { store.dispatch(logoutRequest()); });
    platform.on(platform.events.logoutSuccess, (res) => {
        removeWebPhone();
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

        case 'PHONE_INVITE':
            return {...state, callState: 'invite', session: action.payload};

        case 'PHONE_SESSION':
            return {...state, callState: 'created', session: action.payload};

        case 'PHONE_SESSION_PROGRESS':
        case 'PHONE_SESSION_REPLACED':
            return {...state, session: action.payload};

        case 'PHONE_SESSION_ACCEPTED':
            return {...state, callState: 'accepted', session: action.payload};

        case 'PHONE_SESSION_MUTE':
            return {...state, callMute: true, session: action.payload};

        case 'PHONE_SESSION_UNMUTE':
            return {...state, callMute: false, session: action.payload};

        case 'PHONE_SESSION_TERMINATED':
            return {...state, callState: 'null', session: null};

        default:
            return state;

    }

}
