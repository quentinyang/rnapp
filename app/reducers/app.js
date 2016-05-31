'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/App';
import Immutable from 'immutable';

let initialState = {
    config: {
        showUpdateModal: false,
        showRecharge: true,
    },
    auth: true,
    msg: ''
};

function appData(state = Immutable.fromJS(initialState), action) {
    let listKey = state.get('listSearchHistoryKey'),
        inputKey = state.get('inputSearchHistoryKey');

    switch(action.type) {
        case types.WEB_AUTHENTICATION:
            return state.set('auth', action.auth);
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
            tempListSearchHistory.forEach((val) => {
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
    appConfig
});