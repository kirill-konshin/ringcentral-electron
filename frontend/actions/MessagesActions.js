import {GET_MESSAGES_FAIL, GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS} from "../constants/Messages";
import {platform} from "../utils/rc";

function getMoreMessages(page, dispatch) {

    platform
        .get('/account/~/extension/~/message-store', {page: page})
        .then((res)=>{
            dispatch({
                type: GET_MESSAGES_SUCCESS,
                payload: res.json()
            });
        })
        .catch(function(e){
            dispatch({
                type: GET_MESSAGES_FAIL,
                error: true,
                payload: e
            })
        });

}

export function getMessages(page) {

    page = page || 1;

    return (dispatch) => {

        dispatch({
            type: GET_MESSAGES_REQUEST,
            page: page
        });

        getMoreMessages(page, dispatch)

    }
}
