import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function setWebStartConfigService(params) {
    return ajax.post(urls.app.config, {
        body: {
            cid: params.cId
        }
    });
};

export function deletePushService() {
    return ajax.put(urls.app.deletePush);
}

export function setConfigService() {
    return ajax.get(urls.app.setConfig);
}