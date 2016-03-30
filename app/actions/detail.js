'use strict';

import * as types from '../constants/DetailType';
import { getBaseInfoService } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');

// export function fetchBaseInfo() {
//     return dispatch => {
//         return getBaseInfoService()
//             .then((oData) => {
//                 dispatch(houseSimilarFetched(oData))
//             })
//             .catch(error) {
//                 dispatch()
//             }
//     }
// }

export function fetchSimilarHouseList() {
    return dispatch => {
        return fetchSimilarHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseSimilarFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

