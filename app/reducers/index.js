'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import houseList from  './houseList';

const rootReducer = combineReducers({
    test,
    login,
    houseList
})

export default rootReducer;