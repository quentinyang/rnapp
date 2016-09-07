'use strict';

import * as types from '../constants/AttentionBlockSet';
import {fetchAttentionBlockSetService, cityListService} from '../service/blockService';
import {makeActionCreator, serviceAction} from './base';

export const attentionBlockSetFetched = makeActionCreator(types.ATTENTION_BLOCK_SET_FETCHED, 'blockSet');
export const attentionBlockSetAdded = makeActionCreator(types.ATTENTION_BLOCK_SET_ADDED, 'block');
export const attentionBlockSetDeleted = makeActionCreator(types.ATTENTION_BLOCK_SET_DELETED, 'block');
export const attentionBlockSetEntered = makeActionCreator(types.ATTENTION_BLOCK_SET_ENTERED, 'status');

export const attentionBlockSetCleared = makeActionCreator(types.ATTENTION_BLOCK_SET_CLEAR);

export const cityListFetched = makeActionCreator(types.CITY_LIST_FETCHED, 'list');
export const curCityChanged = makeActionCreator(types.CUR_CITY_CHANGED, 'id');

export function fetchAttentionBlockSet() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionBlockSetService,
            success: function(oData) {
                dispatch(attentionBlockSetFetched(oData))
            },
            error: function(oData) {
            }
        })
    }
}

export function getCityList() {
    return dispatch => {
        serviceAction(dispatch)({
            service: cityListService,
            success: function(oData) {
                // oData.cities = [
                //     {
                //         "id": "1",
                //         "name": "北京"
                //     },
                //     {
                //         "id": "0",
                //         "name": "上海"
                //     }
                // ];
                dispatch(cityListFetched(oData.cities || []));
            },
            error: function() {
                
            }
        });
    }
}