'use strict';

import * as types from '../constants/CommunitySearch';
import {fetchCommunityListService} from '../service/communityService';
import {makeActionCreator, serviceAction} from './base';

export const settingSearchHouseFetched = makeActionCreator(types.SETTING_SEARCH_HOUSE_FETCHED, 'communityList');
export const settingSearchCleared = makeActionCreator(types.SETTING_SEARCH_CLEARED);
export const settingSearchKeywordChanged = makeActionCreator(types.SETTING_SEARCH_KEYWORD_CHANGED, 'keyword');

export function fetchCommunityList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchCommunityListService,
            data: params,
            success: function(oData) {
                dispatch(settingSearchHouseFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}
