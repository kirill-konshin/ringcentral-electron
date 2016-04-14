import {platform} from "../utils/rc";
import WebPhone from "ringcentral-web-phone";

let webPhone;

// Actions

export function makeCall(to, from) {
    return {
        type: 'X_PHONE_MAKECALL',
        payload: webPhone.userAgent.invite(to, {
            // fromNumber: 'PHONE_NUMBER', // Optional, Company Number will be used as default
            // homeCountryId: '1', // Optional, the value of
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        })
    }
}

export function acceptCall(session) {
    return {
        type: 'X_PHONE_ACCEPTCALL',
        payload: session.accept({
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        })
    }
}

// Service functions

export function dispatchPhoneEventsToStore(store) {

    function createWebPhone() {

        if (webPhone) return Promise.resolve(webPhone);

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

                        session.on('accepted', function() {
                            store.dispatch({type: 'PHONE_SESSION_ACCEPTED', payload: session});
                        });
                        session.on('progress', function() {
                            store.dispatch({type: 'PHONE_SESSION_PROGRESS', payload: session});
                        });
                        session.on('rejected', function() { console.log(sessionId, 'Rejected'); });
                        session.on('failed', function() { console.log(sessionId, 'Failed'); });
                        session.on('terminated', function() {
                            store.dispatch({type: 'PHONE_SESSION_TERMINATED', payload: session});
                        });
                        session.on('cancel', function() {console.log(sessionId, 'Cancel');});
                        session.on('refer', function() { console.log(sessionId, 'Refer');});
                        session.on('replaced', function(newSession) {
                            store.dispatch({type: 'PHONE_SESSION_REPLACED', payload: newSession});
                        });
                        session.on('dtmf', function() { console.log(sessionId, 'DTMF'); });
                        session.on('muted', function() {
                            store.dispatch({type: 'PHONE_SESSION_MUTE', payload: session});
                        });
                        session.on('unmuted', function() {
                            store.dispatch({type: 'PHONE_SESSION_UNMUTE', payload: session});
                        });
                        session.on('connecting', function() { console.log(sessionId, 'Connecting'); });
                        session.on('bye', function() { console.log(sessionId, 'Bye'); });

                        session.mediaHandler.on('iceConnection', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnection'}); });
                        session.mediaHandler.on('iceConnectionChecking', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionChecking'}); });
                        session.mediaHandler.on('iceConnectionConnected', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionConnected'}); });
                        session.mediaHandler.on('iceConnectionCompleted', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionCompleted'}); });
                        session.mediaHandler.on('iceConnectionFailed', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionFailed'}); });
                        session.mediaHandler.on('iceConnectionDisconnected', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionDisconnected'}); });
                        session.mediaHandler.on('iceConnectionClosed', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceConnectionClosed'}); });
                        session.mediaHandler.on('iceGatheringComplete', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceGatheringComplete'}); });
                        session.mediaHandler.on('iceGathering', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceGathering'}); });
                        session.mediaHandler.on('iceCandidate', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'iceCandidate'}); });
                        session.mediaHandler.on('userMedia', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'userMedia'}); });
                        session.mediaHandler.on('userMediaRequest', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'userMediaRequest'}); });
                        session.mediaHandler.on('userMediaFailed', function() { store.dispatch({type: 'PHONE_ICE_STATUS', payload: 'userMediaFailed'}); });

                        store.dispatch({type: 'PHONE_SESSION', payload: session});

                    }
                });

                webPhone.userAgent.on('invite', function(session) {
                    store.dispatch({type: 'PHONE_INVITE', payload: session});
                });

                //TODO Notify store?

                console.log('WebPhone Created', webPhone);

                return webPhone;

            });

    }

    function removeWebPhone() {
        console.log('WebPhone Removed', webPhone);
        webPhone && webPhone.userAgent.unregister();
        webPhone.userAgent.removeAllListeners();
        webPhone = null;
    }

    platform.on(platform.events.refreshSuccess, createWebPhone);
    platform.on(platform.events.loginSuccess, createWebPhone);

    platform.on(platform.events.refreshError, removeWebPhone);
    platform.on(platform.events.logoutSuccess, removeWebPhone);

    if (platform.auth().accessTokenValid()) {
        createWebPhone();
    }

}

// Reducer

const initialState = {
    callState: null,
    session: null,
    iceStatus: null
};

export function phoneReducer(state = initialState, action) {

    switch (action.type) {

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

        case 'PHONE_ICE_STATUS':
            return {...state, iceStatus: action.payload};

        default:
            return state;

    }

}
