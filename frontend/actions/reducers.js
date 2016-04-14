import {messageReducer} from "./Message";
import {userReducer} from "./User";
import {navReducer} from "./Nav";

export default {
    nav: navReducer,
    message: messageReducer,
    user: userReducer
};