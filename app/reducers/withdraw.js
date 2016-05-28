'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Withdraw';
import Immutable from 'immutable';

let initialState = {
    price: '',
    account: ''
};

function withdrawInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.PRICE_CHANGED:
            return state.set('price', action.price);
            break;
        case types.PRICE_CLEARED:
            return state.set('price', '');
            break;
        case types.ALIPAY_FETCHED:
            return state.set('account', action.account);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    withdrawInfo
});