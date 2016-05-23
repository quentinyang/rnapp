'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Navigation';
import Immutable from 'immutable';

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
            case types.SET_CONTACT_STATUS:
                updateStateStack(action.contactStatus, "is_contact");
                return state;
                break;
            case types.SET_LOOK_STATUS:
                updateStateStack(action.lookStatus, "is_click");
                return state;
                break;
            default:
                return reducer(state, action);
        }
    }
}

function updateStateStack(newObj, name) {
    let len = stateStack.length;
    for(let i=0; i<len; i++) {
        let tempObj = stateStack[i];
        if(tempObj.hasOwnProperty("houseData")) {
            let tempHouseData = tempObj.houseData;

            tempHouseData = tempHouseData.updateIn(['properties'], (k) => {
                let newArr = Immutable.List();
                k.forEach((val, key) => {
                    if(val.get('property_id') == newObj.property_id) {
                        let newVal = val.set(name, Immutable.fromJS(newObj[name]));
                        newArr = newArr.push(newVal);
                    } else {
                        newArr = newArr.push(val);
                    }
                });
                return newArr;
            });
            tempObj.houseData = tempHouseData;
            stateStack[i] = tempObj;
        }
    }
}