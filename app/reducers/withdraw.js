'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Withdraw';
import Immutable from 'immutable';

let initialState = {
    price: ''
};

function withdrawInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.PRICE_CHANGED:
            return state.set('price', action.price);
            break;
        case types.PRICE_CLEARED:
            return state.set('price', '');
        default:
            return state;
    }
}

export default combineReducers({
    withdrawInfo
});