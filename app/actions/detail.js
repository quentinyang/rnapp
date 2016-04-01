'use strict';

import * as types from '../constants/DetailType';
import { getBaseInfoService } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');
export const houseBaseFetched = makeActionCreator(types.HOUSE_BASE_FETCHED, 'houseBase');

export function fetchBaseInfo(data) {
    return dispatch => {
        return getBaseInfoService(data)
             .then((oData) => {
                 debugger;
                 console.info('baseinfo Ajax Success: ' + oData);
                 dispatch(houseBaseFetched(oData))
             })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

export function fetchSimilarHouseList(params) {
    return dispatch => {
        return fetchSimilarHouseListService(params)
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseSimilarFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

