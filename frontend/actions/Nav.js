export const NAVIGATE = 'NAVIGATE';

const initialState = {
    page: 'messages'
};

// Actions

export function navigate(page) {
    return (dispatch) => {
        dispatch({type: NAVIGATE, payload: page});
    }
}

// Reducer

export function navReducer(state = initialState, action) {

    switch (action.type) {

        case NAVIGATE:
            return {
                ...state,
                page: action.payload
            };

        default:
            return state;

    }

}
