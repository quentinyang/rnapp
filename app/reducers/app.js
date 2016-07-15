'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/App';
import Immutable from 'immutable';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';

let initialState = {
    config: {
        showUpdateModal: false,
        showRecharge: true,
        isCidLogin: false,
        isEnforceUpdate: false
    },
    auth: {
        visible: false,
        msg: '的积分卡对\n方附近开发'
    },

    msg: '',

    loadingVisible: false,

    listSearchHistoryKey: '',
    inputSearchHistoryKey: '',
    listSearchHistory: [],
    inputSearchHistory: [],

    net: 'yes',  //yes有网，no无网
};

function appData(state = Immutable.fromJS(initialState), action) {
    let listKey = state.get('listSearchHistoryKey'),
        inputKey = state.get('inputSearchHistoryKey');

    switch(action.type) {
        case types.WEB_AUTHENTICATION:
            return state.set('auth', Immutable.fromJS(action.auth));
            break;
        case types.WEB_NETWORK_ERROR:
            return state.set('msg', action.msg);
            break;
        case types.APP_CONFIG:
            return state.set('config', Immutable.fromJS(action.appConfig));
            break;
        case types.CLOSE_UPDATE_MODAL:
            return state.setIn(['config', 'showUpdateModal'], action.visible);
            break;
        case types.CLOSE_LOGIN_MODAL:
            return state.setIn(['config', 'isCidLogin'], action.visible);
            break;
        case types.SET_SEARCH_HISTORY_KEY:
            state = state.set('listSearchHistoryKey', Immutable.fromJS("list_search_history_" + action.searchHistoryKey));
            return state.set('inputSearchHistoryKey', Immutable.fromJS("input_search_history_" + action.searchHistoryKey));
            break;
        case types.GET_SEARCH_HISTORY:
            state = state.set('listSearchHistory', Immutable.fromJS(action.searchHistoryValue.list));
            return state.set('inputSearchHistory', Immutable.fromJS(action.searchHistoryValue.input));
            break;
        case types.ADD_LIST_SEARCH_HISTORY:
            let tempListSearchHistory = state.get('listSearchHistory'), newListId = action.addItem.id, hasList = false;
            tempListSearchHistory.forEach((val) => {
                if(val.get('id') == newListId) {
                    hasList = true;
                }
            });
            if(hasList) {
                return state;
            }
            state = state.updateIn(['listSearchHistory'], (k) => {
                if(k.size == 10) {
                    k = k.pop();
                }
                return k.unshift(Immutable.fromJS(action.addItem));
            });
            AsyncStorageComponent.save(listKey, JSON.stringify(state.get('listSearchHistory')));

            return state;
            break;
        case types.ADD_INPUT_SEARCH_HISTORY:
            let tempInputSearchHistory = state.get('inputSearchHistory'), newInputId = action.addItem.id, hasInput = false;
            tempInputSearchHistory.forEach((val) => {
                if(val.get('id') == newInputId) {
                    hasInput = true;
                }
            });
            if(hasInput) {
                return state;
            }

            state = state.updateIn(['inputSearchHistory'], (k) => {
                if(k.size == 10) {
                    k = k.pop();
                }
                return k.unshift(Immutable.fromJS(action.addItem));
            });
            AsyncStorageComponent.save(inputKey, JSON.stringify(state.get('inputSearchHistory')));

            return state;
            break;
        case types.CLEAR_LIST_SEARCH_HISTORY:
            AsyncStorageComponent.remove(listKey);

            return state.set('listSearchHistory', Immutable.fromJS([]));
            break;
        case types.CLEAR_INPUT_SEARCH_HISTORY:
            AsyncStorageComponent.remove(inputKey);

            return state.set('inputSearchHistory', Immutable.fromJS([]));
            break;
        case types.APP_LOADING_CHANGED:
            return state.set('loadingVisible', action.visible);
            break;
        case types.APP_NETWORK_CHANGED:
            return state.set('net', action.net);
        default:
            return state;
    }
}

let initialClickStatus = {
    chouldTapClick: true
};

function clickStatus(state = Immutable.fromJS(initialClickStatus), action) {
    switch(action.type) {
        case types.FORBIDDEN_TAB_CHANGED:
            return state.set('chouldTapClick', action.status);
            break;
        default:
            return state;
    }
}

let initialConfig = {
    showRecharge: true,
};

function appConfig(state = Immutable.fromJS(initialConfig), action) {
    switch(action.type) {
        case types.APP_CONFIG:
            return Immutable.fromJS(action.appConfig);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    appData,
    appConfig,
    clickStatus
});