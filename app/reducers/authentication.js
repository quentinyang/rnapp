'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Authentication';
import Immutable from 'immutable';

let initialState = {
    name: '',
    identity_card_number: '',
    district_id: '',
    district_name: '',
    block_id: '',
    block_name: '',
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
            return state.set('district_id', action.data.district_id).set('district_name', action.data.district_name)
                        .set('block_id', action.data.block_id).set('block_name', action.data.block_name);
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

let initialController = {
    modal_visible: false
}

function autController(state = Immutable.fromJS(initialController), action) {
    switch(action.type) {
        case types.ADDR_PICKER_CHANGED:
            return state.set('modal_visible', action.visible);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    userInformation,
    autController
});