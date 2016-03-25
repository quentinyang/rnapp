import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function getPropertyList() {
    return ajax.get(urls.test.list, {
        headers: {
            'apikey': '19ffb04654b0f50d003e0a58abf2c50b'
        }
    })
}