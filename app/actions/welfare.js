'use strict';

import * as types from '../constants/Card';
import {makeActionCreator, serviceAction} from './base';
import { getWelfareList } from '../service/cardService';

export const welfareListFetched = makeActionCreator(types.WELFARE_LIST_FETCHED, 'wfData', 'index');

export const welfareListCleared = makeActionCreator(types.WELFARE_LIST_CLEARED);

export const welfareStatusChanged = makeActionCreator(types.WELFARE_STATUS_CHANGED, 'status');

export function fetchWelfareList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getWelfareList,
            data: params,
            loading: params.status == 1 && params.page == 1 ? true : false,
            success: function(oData) {
                dispatch(welfareListFetched(oData, params.status || ''))
            },
            error: function(oData) {
            }
        })
    }
}