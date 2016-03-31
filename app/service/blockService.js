import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchAttentionBlockSetService() {
    return ajax.get(urls.blocks.attention)
};

export function saveAttentionBlockSetService(params) {
    return ajax.post(urls.blocks.saveAttention, {
        body: {
            id: params
        }
    })
};

export function fetchAttentionBlockAndCommunityService() {
    return ajax.get(urls.attention.blockAndCommunity)
};

export function saveAttentionCommunitySetService(params) {
    return ajax.post(urls.attention.saveAttentionCommunity, {
        body: {
            id: params
        }
    })
};


