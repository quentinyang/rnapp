'use strict';

function status(response, resolve, reject) {
    if(response.status >= 200 && response.status < 300) {
        resolve(response.json());
    } else {
        response.json().then(reject);
    }
}

function get(url, params) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            ...params
        })
        .then((response) => {
            resolve(response.json());
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function post(url, params) {
    let {body, ...paramsOther} = params;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            ...paramsOther
        })
        .then((response) => {
            status(response, resolve, reject);
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function remove(url, params) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
            ...params
        })
        .then((response) => {
            resolve(response.json());
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function put(url, params) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'PUT',
            ...params
        })
        .then((response) => {
            resolve(response.json());
        })
        .catch((error) => {
            reject(error)
        })
    })
}

let ajax = {
    get,
    post,
    put,
    remove
}

module.exports = ajax;
