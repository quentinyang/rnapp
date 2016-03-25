'use strict';

import * as types from '../constants/DetailType';
import { getBaseInfo } from '../service/detailService';

export function fetchBaseInfo() {
    return dispatch =>{
        return getBaseInfo()
            .then((oData) => {
                dispatch()
            })
            .catch(error) {
                dispatch()
            }
    }
}

