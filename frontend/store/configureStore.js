import {createStore, applyMiddleware, combineReducers} from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise-middleware";
import {reducer as formReducer} from "redux-form";
import reducers from "../actions/reducers";

export default function configureStore(initialState) {

    const store = createStore(
        combineReducers({
            ...reducers,
            form: formReducer
        }),
        initialState,
        applyMiddleware(
            promiseMiddleware({
                promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']
            }),
            thunk,
            createLogger({
                collapsed: true
            })
        )
    );

    if (module.hot) {

        module.hot.accept('../actions/reducers', () => {
            const nextRootReducer = require('../actions/reducers');
            store.replaceReducer(nextRootReducer);
        });

    }

    return store;

}
