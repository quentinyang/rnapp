'use strict';

import * as types from '../constants/AttentionBlockSet';
import {fetchAttentionBlockSetService} from '../service/blockService';
import {makeActionCreator, serviceAction} from './base';

export const attentionBlockSetFetched = makeActionCreator(types.ATTENTION_BLOCK_SET_FETCHED, 'blockSet');
export const attentionBlockSetAdded = makeActionCreator(types.ATTENTION_BLOCK_SET_ADDED, 'block');
export const attentionBlockSetDeleted = makeActionCreator(types.ATTENTION_BLOCK_SET_DELETED, 'block');

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
