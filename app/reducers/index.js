'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import houseList from  './houseList';
import home from  './home';
import detail from  './detail';
import attentionBlockSet from  './attentionBlockSet';
import attentionBlockSetOne from  './attentionBlockSetOne';
import searchDemo from './searchDemo'

const rootReducer = combineReducers({
    test,
    login,
    houseList,
    home,
    detail,
    attentionBlockSet,
    searchDemo,
    attentionBlockSetOne
});

export default rootReducer;