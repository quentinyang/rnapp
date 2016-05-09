'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Navigation';

var stateStack = [];
export default function navAwarable(reducer, states, name) {
    return (state = states, action) => {
        switch(action.type) {
            case types.LIST_PUSH_ROUTE:
                if(name == 'houseList') {
                    stateStack.push(state);
                }
                return state;
            case types.DETAIL_PUSH_ROUTE:
                if(name == 'houseDetail') {
                    stateStack.push(state);
                }
                return state;
            case types.LIST_POP_ROUTE:
                if(name == 'houseList') {
                    let originState = stateStack.pop();
                    return reducer(originState, action);
                }
                return state;
            case types.DETAIL_POP_ROUTE:
                if(name == 'houseDetail') {
                    let originState = stateStack.pop();
                    return reducer(originState, action);
                }
                return state;
            default:
                return reducer(state, action);
        }
    }
}