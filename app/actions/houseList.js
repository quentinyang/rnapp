'use strict';

import * as types from '../constants/HouseList';
import {fetchHouseListService, fetchAppendHouseListService, fetchPrependHouseListService, fetchHouseFilterService} from '../service/houseListService';
import {fetchCommunityListService} from '../service/communityService';
import {makeActionCreator} from './base';

export const houseFetched = makeActionCreator(types.HOUSE_FETCHED, 'houseList');
export const houseAppendFetched = makeActionCreator(types.HOUSE_APPEND_FETCHED, 'houseList');
export const housePrependFetched = makeActionCreator(types.HOUSE_PREPEND_FETCHED, 'houseList');

export const houseFilterFetched = makeActionCreator(types.HOUSE_FILTER_FETCHED, 'filterList');
export const filterItemPressed = makeActionCreator(types.FILTER_ITEM_PRESSED, 'item');
export const onlyVerifyChanged = makeActionCreator(types.ONLY_VERIFY_CHANGED, 'onlyVerify');
export const blockFilterChanged = makeActionCreator(types.BLOCK_FILTER_CHANGED, 'districtId', 'blockId', 'areaName');
export const filterTabPriceChanged = makeActionCreator(types.FILTER_TAB_PRICE_CHANGED, 'min', 'max', 'title');
export const filterTabBedroomsChanged = makeActionCreator(types.FILTER_TAB_BEDROOMS_CHANGED, 'min', 'max', 'title');
export const filterCommunityNameChanged = makeActionCreator(types.FILTER_COMMUNITY_NAME_CHANGED, 'communityId', 'communityName');

export const autocompleteViewShowed = makeActionCreator(types.AUTOCOMPLETE_VIEW_SHOWED, 'show');
export const houseListSearchHouseFetched = makeActionCreator(types.HOUSE_LIST_SEARCH_HOUSE_FETCHED, 'communityList');
export const houseListSearchKeywordChanged = makeActionCreator(types.HOUSE_LIST_SEARCH_KEYWORD_CHANGED, 'keyword');
export const filterCommunityNameCleared = makeActionCreator(types.FILTER_COMMUNITY_NAME_CLEARED);

export const houseListPageCleared = makeActionCreator(types.HOUSE_LIST_PAGE_CLEARED);


export function fetchHouseList(params) {
    return dispatch => {
        return fetchHouseListService(params)
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(houseFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchAppendHouseList(params) {
    return dispatch => {
        return fetchAppendHouseListService(params)
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(houseAppendFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchPrependHouseList(params) {
    return dispatch => {
        return fetchPrependHouseListService(params)
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(housePrependFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchHouseFilter() {
    return dispatch => {
        return fetchHouseFilterService()
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(houseFilterFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchHouseListCommunityList(params) {
    return dispatch => {
        return fetchCommunityListService(params)
            .then((oData) => {
                dispatch(houseListSearchHouseFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}


