import {phoneReducer} from "./Phone";
import {contactsReducer} from "./Contact";
import {messageReducer} from "./Message";
import {callReducer} from "./Call";
import {userReducer} from "./User";
import {navReducer} from "./Nav";

export default {
    nav: navReducer,
    message: messageReducer,
    contact: contactsReducer,
    call: callReducer,
    phone: phoneReducer,
    user: userReducer
};