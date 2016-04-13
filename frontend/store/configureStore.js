import {createStore, applyMiddleware, combineReducers} from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import {reducer as formReducer} from "redux-form";
import reducers from "../actions/reducers";

export default function configureStore(initialState) {

    const logger = createLogger();
    
    const rootReducer = combineReducers({
        ...reducers,
        form: formReducer
    });

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, logger));

    if (module.hot) {

        module.hot.accept('../actions/reducers', () => {
            const nextRootReducer = require('../actions/reducers');
            store.replaceReducer(nextRootReducer);
        });

    }

    return store;

}
