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

function formInfo(state = initialState.formData, action) {
    switch(action.type) {
        case types.PHONE_CHANGED:
            return Object.assign({}, state, {
                phone: action.phone
            });
        case types.CODE_CHANGED:
            return Object.assign({}, state, {
                code: action.code
            });
        default:
            return state;
    }
}

function controllerInfo(state = initialState.controllerData, action) {
    switch(action.type) {
        case types.CSTATUS_CHANGED:
            return Object.assign({}, state, {
                code_status: action.code_status
            });
        case types.CSEND_CHANGED:
            return Object.assign({}, state, {
                code_send: action.code_send
            });
        case types.CTEXT_CHANGED:
            return Object.assign({}, state, {
                code_text: action.code_text
            });
        case types.ERR_MSG:
            return Object.assign({}, state, {
                err_msg: action.err_msg
            });
        case types.FORM_SUBMITTED:
            return Object.assign({}, state, {
                register_form: action.register_form
            });
        default:
            return state;
    }
}

export default combineReducers({
    formInfo,
    controllerInfo
});