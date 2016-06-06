'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Withdraw';
import Immutable from 'immutable';

let initialState = {
    price: '',
    account: '',
    alipay_account: '',
    name: '',
    has_bound: '',
    bound_failed: '',
    err_msg: ''
};

function withdrawInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.ALIPAY_ACCOUNT_CHANGED:
            return state.set('alipay_account', action.alipay_account);
            break;
        case types.NAME_CHANGED:
            return state.set('name', action.name);
            break;
        case types.PRICE_CHANGED:
            return state.set('price', action.price);
            break;
        case types.PRICE_CLEARED:
            return state.set('price', '');
            break;
        case types.ALIPAY_FETCHED:
            return state.set('has_bound', action.is_binding_alipay);
            break;
        case types.FROM_USER_FETCHED:
            return state.set('account', action.account).set('has_bound', action.has_bound);
            break;
        case types.WITHDRAW_ERR_MSG:
            return state.set('err_msg', action.err_msg);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    withdrawInfo
});