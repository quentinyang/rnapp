'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/BindAlipay';
import Immutable from 'immutable';

let initialState = {
    alipay_account: '',
    name: '',
    identity_card_number: '',
    has_bound: '',
    err_msg: '',
    step: 1
};

function aliInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.ALIPAY_NAME_CHANGED:
            return state.set('name', action.name);
            break;
        case types.ALIPAY_IDCard_CHANGED:
            return state.set('identity_card_number', action.identity_card_number);
            break;
        case types.BIND_STEP_CHANGED:
            return state.set('step', action.step);
            break;
        case types.ALIPAY_FETCHED:
            return state.set('alipay_account', action.account).set('has_bound', action.has_bound);
            break;
        case types.ALIPAY_ERR_MSG:
            return state.set('err_msg', action.err_msg);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    aliInfo
});