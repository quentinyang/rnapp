import {getToken} from '../service/tokenService';

/*
* @params data 图片路径或图片base64编码
*/
export function upload(data) {
    getToken()
    .then((d) => {
        let token = d.items[0];
        uploadImage(data, token);
    })
}

function uploadImage(data, token) {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('file', {uri: data, type: 'application/octet-stream'});

    fetch('http://upload.qiniu.com', {body: formData, method: 'POST'})
    .then((data) => {
        return data.json();
    })
    .then((json) => {
        console.log('json--------', json)
    })
}