import {phoneReducer} from "./Phone";
import {messageReducer} from "./Message";
import {userReducer} from "./User";
import {navReducer} from "./Nav";

export default {
    nav: navReducer,
    message: messageReducer,
    phone: phoneReducer,
    user: userReducer
};