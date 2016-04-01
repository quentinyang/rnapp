'use strict';

import * as types from '../constants/AttentionBlockSet';
import {fetchAttentionBlockSetService} from '../service/blockService';
import {makeActionCreator} from './base';

export const attentionBlockSetFetched = makeActionCreator(types.ATTENTION_BLOCK_SET_FETCHED, 'blockSet');
export const attentionBlockSetAdded = makeActionCreator(types.ATTENTION_BLOCK_SET_ADDED, 'block');
export const attentionBlockSetDeleted = makeActionCreator(types.ATTENTION_BLOCK_SET_DELETED, 'block');

export const attentionBlockSetCleared = makeActionCreator(types.ATTENTION_BLOCK_SET_CLEAR);

export function fetchAttentionBlockSet() {
    return dispatch => {
        return fetchAttentionBlockSetService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(attentionBlockSetFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}
