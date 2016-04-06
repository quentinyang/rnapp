'use strict';

import * as types from '../constants/CommunitySearch';
import {fetchCommunityListService} from '../service/communityService';
import {makeActionCreator} from './base';

export const settingSearchHouseFetched = makeActionCreator(types.SETTING_SEARCH_HOUSE_FETCHED, 'communityList');
export const settingSearchCleared = makeActionCreator(types.SETTING_SEARCH_CLEARED);
export const settingSearchKeywordChanged = makeActionCreator(types.SETTING_SEARCH_KEYWORD_CHANGED, 'keyword');

export function fetchCommunityList(params) {
    return dispatch => {
        return fetchCommunityListService(params)
            .then((oData) => {
                console.dir('fetchCommunityListService: ');
                console.dir(oData)
                dispatch(settingSearchHouseFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}
