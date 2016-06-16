'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/HouseList';
import * as homeTypes from '../constants/Home';
import Immutable from 'immutable';
import navigation from './navigation';

let initialState = {
    properties: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
};

function houseData(state, action) {
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

function filterData(state, action) {
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
    only_new: false,
    community_id: '',
    community_name: '',
    keyword: ''
};

function queryParamsData(state, action) {
    switch(action.type) {
        case types.ONLY_NEW_CHANGED:
            return state.set('only_new', action.onlyNew);
        case types.BLOCK_FILTER_CHANGED:
            return state.set('block_id', action.blockId).set('district_id', action.districtId);
        case types.FILTER_TAB_PRICE_CHANGED:
            return state.set('min_price', action.min).set('max_price', action.max);
        case types.FILTER_TAB_BEDROOMS_CHANGED:
            return state.set('min_bedrooms', action.min).set('max_bedrooms', action.max);
        case types.FILTER_COMMUNITY_NAME_CHANGED:
            let newData = Immutable.fromJS(initQueryParams);
            return newData.set('community_id', action.communityId).set('community_name', action.communityName);
            break;
        case types.FILTER_COMMUNITY_NAME_CLEARED:
            return Immutable.fromJS(initQueryParams);
            break;
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initQueryParams);
            break;
        default:
            return state;
    }
}

let initUIData = {
    tabType: '',
    onlyNew: false,
    areaName: '',
    priceName: '',
    bedroomsName: '',
    autocompleteView: false
};

function uiData(state, action) {
    switch(action.type) {
        case types.FILTER_ITEM_PRESSED:
            return state.set('tabType', action.item);
            break;
        case types.ONLY_NEW_CHANGED:
            return state.set('onlyNew', action.onlyNew);
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
        case types.AUTOCOMPLETE_VIEW_SHOWED:
            return state.set('autocompleteView', action.show);
            break;
        case types.FILTER_COMMUNITY_NAME_CHANGED:
            return Immutable.fromJS(initUIData);
            break;
        case types.FILTER_COMMUNITY_NAME_CLEARED:
            return Immutable.fromJS(initUIData);
            break;
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initUIData);
            break;
        default:
            return state;
    }
}

let initCommunityData = {
    results: [],
};

function communityData(state, action) {
    switch(action.type) {
        case types.HOUSE_LIST_SEARCH_HOUSE_FETCHED:
            return state.set('results', Immutable.fromJS(action.communityList));
            break;
        case types.HOUSE_LIST_SEARCH_KEYWORD_CHANGED:
            return state.set('keyword', action.keyword);
            break;
        case types.HOUSE_LIST_SEARCH_CLEARED:
            return Immutable.fromJS(initCommunityData);
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initCommunityData);
            break;
        default:
            return state;
    }
}

let base = {
    houseData: Immutable.fromJS(initialState),
    filterData: Immutable.fromJS(initFilterData),
    queryParamsData: Immutable.fromJS(initQueryParams),
    uiData: Immutable.fromJS(initUIData),
    communityData: Immutable.fromJS(initCommunityData)
};

function houseList(state, action) {
    return {
        houseData: houseData(state.houseData, action),
        filterData: filterData(state.filterData, action),
        queryParamsData: queryParamsData(state.queryParamsData, action),
        uiData: uiData(state.uiData, action),
        communityData: communityData(state.communityData, action)
    };
}

export default navigation(houseList, base, 'houseList');