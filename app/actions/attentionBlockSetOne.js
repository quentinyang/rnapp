'use strict';

import * as types from '../constants/AttentionBlockSetOne';
import {makeActionCreator} from './base';

export const attentionListOneSetFetched = makeActionCreator(types.ATTENTION_LIST_ONE_SET_FETCHED, 'attentionList');
export const attentionListOneBlockChanged = makeActionCreator(types.ATTENTION_LIST_ONE_BLOCK_CHANGED, 'blockList');
export const attentionListOneCommunityChanged = makeActionCreator(types.ATTENTION_LIST_ONE_COMMUNITY_CHANGED, 'communityList');

export const attentionListOneCommunityRomoved = makeActionCreator(types.ATTENTION_LIST_ONE_COMMUNITY_ROMOVED , 'communityId');
