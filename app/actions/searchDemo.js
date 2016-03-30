'use strict';

import * as types from '../constants/searchDemo';
import {fetchHouseListService} from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseFetched = makeActionCreator(types.SEARCH_HOUSE_FETCHED, 'houseList');
export const clearFetched = makeActionCreator(types.CLEAR_FETCHED);

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

export function clearResult() {
    return dispatch => {
        dispatch(clearFetched())
    };
}

