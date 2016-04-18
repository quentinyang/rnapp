import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function setWebStartConfigService(params) {
    return ajax.post(urls.app.config, {
        body: {
            cid: params.cId
        }
    });
};