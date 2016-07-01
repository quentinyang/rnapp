'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Card';
import Immutable from 'immutable';

let initialState = {
    current: 0,
    list: [],
    pager: {}
};

function welfareInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.WELFARE_LIST_FETCHED:
            let newData = state.updateIn(['list'], (k) => {
                return k.concat(Immutable.fromJS(action.wfData.items));
            });
            return newData.set('pager', Immutable.fromJS(action.wfData.pager));
            break;
        case types.WELFARE_LIST_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        case types.WELFARE_STATUS_CHANGED:
            return Immutable.fromJS(initialState).set('current', action.status);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    welfareInfo
});