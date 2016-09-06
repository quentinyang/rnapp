'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/BindAlipay';
import Immutable from 'immutable';

let initialState = {
    name: '',
    identity_card_number: '',
    district_id: '',
    block_id: '',
    business_card_id: '',
    identity_card_id: '',
    err_msg: '',
};

function userInformation(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.REAL_NAME_CHANGED:
            return state.set('name', action.name);
            break;
        case types.ID_CARD_NUM_CHANGED:
            return state.set('identity_card_number', action.identity_card_number);
            break;
        case types.WORK_ADDRESS_CHANGED:
            return state.set('district_id', action.data.district_id).set('block_id', action.data.block_id);
            break;
        case types.BUSINESS_CARD_CHANGED:
            return state.set('business_card_id', action.business_card_id);
            break;
        case types.IDENTITY_CARD_CHANGED:
            return state.set('identity_card_id', action.identity_card_id);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    userInformation
});