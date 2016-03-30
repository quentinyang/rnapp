import { combineReducers } from 'redux';
import * as types from '../constants/Login';
import Immutable from 'immutable';
let urls = require('../config/urls').urls;

let initialState = {
    formData: {
        'phone': '',
        'code': '',
    },
    controllerData: {
        'code_status': '',
        'code_send': '',  //判断是否正在发送,true在发，false不在。
        'code_text': '获取验证码',
        'err_msg': '',
        'register_form': '',
    }
};

function formInfo(state = Immutable.fromJS(initialState.formData), action) {
    switch(action.type) {
        case types.PHONE_CHANGED:
            return state.set('phone', Immutable.fromJS(action.phone));
        case types.CODE_CHANGED:
            return state.set('code', Immutable.fromJS(action.code));
        default:
            return state;
    }
}

function controllerInfo(state = Immutable.fromJS(initialState.controllerData), action) {
    switch(action.type) {
        case types.CSTATUS_CHANGED:
            return state.set('code_status', Immutable.fromJS(action.code_status));
        case types.CSEND_CHANGED:
            return state.set('code_send', Immutable.fromJS(action.code_send));
        case types.ERR_MSG:
            return state.set('err_msg', Immutable.fromJS(action.err_msg));
        case types.FORM_SUBMITTED:
            return state.set('register_form', Immutable.fromJS(action.register_form));
        default:
            return state;
    }
}

export default combineReducers({
    formInfo,
    controllerInfo
});