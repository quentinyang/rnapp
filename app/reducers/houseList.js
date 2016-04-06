'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/HouseList';
import Immutable from 'immutable';

let initialState = {
    properties: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.HOUSE_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.HOUSE_APPEND_FETCHED:
            let immuData = Immutable.fromJS(action.houseList);
            let newData = state.updateIn(['properties'], (k) => {
                return k.concat(immuData.get('properties'));
            });
            newData = newData.set('pager', Immutable.fromJS(action.houseList['pager']));
            return newData;
            break;
        case types.HOUSE_PREPEND_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

let initFilterData = {
    price: [],
    bedrooms: [],
    district_block_list: [
        {
            "id": -1,
            "name": "不限",
            "blocks": [
                {
                    "id": -1,
                    "name": "全部"
                }
            ]
        }
    ]
};

function filterData(state = Immutable.fromJS(initFilterData), action) {
    switch(action.type) {
        case types.HOUSE_FILTER_FETCHED:
            return Immutable.fromJS(action.filterList);
            break;
        default:
            return state;
    }
}

let initQueryParams = {
    block_id: -1,
    district_id: -1,
    min_price: 0,
    max_price: 0,
    min_bedrooms: 0,
    max_bedrooms: 0,
    only_verify: false,
    community_id: '',
    community_name: '',
    keyword: ''
};

function queryParamsData(state = Immutable.fromJS(initQueryParams), action) {
    switch(action.type) {
        case types.ONLY_VERIFY_CHANGED:
            return state.set('only_verify', action.onlyVerify);
        case types.BLOCK_FILTER_CHANGED:
            return state.set('block_id', action.blockId).set('district_id', action.districtId);
        case types.FILTER_TAB_PRICE_CHANGED:
            return state.set('min_price', action.min).set('max_price', action.max);
        case types.FILTER_TAB_BEDROOMS_CHANGED:
            return state.set('min_bedrooms', action.min).set('max_bedrooms', action.max);
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initQueryParams);
            break;
        default:
            return state;
    }
}

let initUIData = {
    tabType: '',
    onlyVerify: false,
    areaName: '',
    priceName: '',
    bedroomsName: ''
};

function uiData(state = Immutable.fromJS(initUIData), action) {
    switch(action.type) {
        case types.FILTER_ITEM_PRESSED:
            return state.set('tabType', action.item);
            break;
        case types.ONLY_VERIFY_CHANGED:
            return state.set('onlyVerify', action.onlyVerify);
            break;
        case types.BLOCK_FILTER_CHANGED:
            return state.set('areaName', action.areaName);
            break;
        case types.FILTER_TAB_PRICE_CHANGED:
            return state.set('priceName', action.title);
            break;
        case types.FILTER_TAB_BEDROOMS_CHANGED:
            return state.set('bedroomsName', action.title);
            break;
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initUIData);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData,
    filterData,
    queryParamsData,
    uiData
});