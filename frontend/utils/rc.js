import SDK from "ringcentral";
import store from "../store/store";
import {
    loginSuccess,
    logoutSuccess,
    loginFail,
    loginRequest,
    logoutRequest,
    refreshFail,
    refreshRequest,
    refreshSuccess,
    logoutFail
} from "../actions/UserActions";

var sdk = new SDK({
    server: SDK.server.production + ':443', //FIXME Port???
    appKey: 'htPeaGLLSsy4ssTPpjCdtg',
    appSecret: 'Bqty5oVsT621yWpLcWatCwfSZB9NOsTwCZynfsZHoSOg'
});

var platform = sdk.platform();

export function getUser() {
    return platform.get('/account/~/extension/~')
        .then((res)=> {
            store.dispatch(loginSuccess(res.json()));
        })
        .catch((e)=> {
            store.dispatch(loginFail(e));
            throw e;
        });
}

// Refresh

platform.on(platform.events.beforeRefresh, () => {
    store.dispatch(refreshRequest());
});

platform.on(platform.events.refreshSuccess, (res)=> {
    store.dispatch(refreshSuccess());
});

platform.on(platform.events.refreshError, (e)=> {
    store.dispatch(refreshFail(e));
});

// Logout

platform.on(platform.events.beforeLogout, () => {
    store.dispatch(logoutRequest());
});

platform.on(platform.events.logoutSuccess, (res) => {
    store.dispatch(logoutSuccess());
});

platform.on(platform.events.logoutError, (e) => {
    store.dispatch(logoutFail(e));
});

// Login

platform.on(platform.events.beforeLogin, () => {
    store.dispatch(loginRequest());
});

platform.on(platform.events.loginSuccess, (res) => {
    getUser();
});

platform.on(platform.events.loginError, (e) => {
    store.dispatch(loginFail(e));
});

// Bootstrapping

platform.loggedIn() // when app is starting -- log in
    .then(()=> {
        return getUser();
    })
    .then((res)=> {
        store.dispatch(loginSuccess(res.json()));
    })
    .catch((e)=> {
        //do nothing, failed automatic login is no big deal
        //store.dispatch(loginFail(e));
    });

// Exports

export {platform, sdk};