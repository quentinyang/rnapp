'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Card';
import Immutable from 'immutable';

let initialState = {
    current: 0,
    list1: [],  //未使用
    pager1: {}, //未使用
    list2: [],  //已使用
    pager2: {},  //已使用
    list3: [],  //已过期
    pager3: {}  //已过期
};

function welfareInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.WELFARE_LIST_FETCHED:
            let newData = state.updateIn(['list'+action.index], (k) => {
                return k.concat(Immutable.fromJS(action.wfData.items));
            });
            return newData.set('pager'+action.index, Immutable.fromJS(action.wfData.pager));
            break;
        case types.WELFARE_LIST_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        case types.WELFARE_STATUS_CHANGED:
            return state.set('current', action.status);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    welfareInfo
});