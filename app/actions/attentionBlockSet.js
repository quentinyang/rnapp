'use strict';

import * as types from '../constants/AttentionBlockSet';
import {fetchAttentionBlockSetService, enterAttentionBlockSetService} from '../service/blockService';
import {makeActionCreator, serviceAction} from './base';

export const attentionBlockSetFetched = makeActionCreator(types.ATTENTION_BLOCK_SET_FETCHED, 'blockSet');
export const attentionBlockSetAdded = makeActionCreator(types.ATTENTION_BLOCK_SET_ADDED, 'block');
export const attentionBlockSetDeleted = makeActionCreator(types.ATTENTION_BLOCK_SET_DELETED, 'block');
export const attentionBlockSetEntered = makeActionCreator(types.ATTENTION_BLOCK_SET_ENTERED, 'status');

export const attentionBlockSetCleared = makeActionCreator(types.ATTENTION_BLOCK_SET_CLEAR);

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

export function enterAttentionBlockSet() {
    return dispatch => {
        serviceAction(dispatch)({
            service: enterAttentionBlockSetService,
            success: function(oData) {
                dispatch(attentionBlockSetEntered(oData))
            },
            error: function(oData) {
                console.log('put请求报错，不影响页面？', oData)
            }
        })
    }
}
