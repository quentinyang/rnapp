'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import houseList from  './houseList';
import home from  './home';

const rootReducer = combineReducers({
    test,
    login,
    houseList,
    home
});

export default rootReducer;