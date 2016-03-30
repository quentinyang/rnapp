'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import houseList from  './houseList';
import home from  './home';
import detail from  './detail';

const rootReducer = combineReducers({
    test,
    login,
    houseList,
    home,
    detail
});

export default rootReducer;