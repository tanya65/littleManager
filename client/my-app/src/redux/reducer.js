import {UPDATE_USER} from "./actions";

const INITIAL_STATE = {
    user: {},
}

export const reducer = (state = INITIAL_STATE,action) => {
    switch(action.type){
        case UPDATE_USER : return {
            ...state,
            user : action.user
        };
        default:
          return state;
    }
}
