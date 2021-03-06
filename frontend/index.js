import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import App from "./components/App";
import configureStore from "./store/configureStore";
import {dispatchUserEventsToStore} from "./actions/User";
import {dispatchPhoneEventsToStore} from "./actions/Phone";

if (process.env.WEBPACK) {
    require("./styles/styles.less");
}

const store = configureStore();

dispatchUserEventsToStore(store);
dispatchPhoneEventsToStore(store);

window.onload = () => {

    render(
        <Provider store={store}>
            <div className='app'>
                <App />
            </div>
        </Provider>,
        document.getElementById('app')
    );

    document.getElementById('loading').style.display = 'none';

    console.log('Loaded');

};