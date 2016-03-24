'use strict';

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
            body: JSON.stringify(body),
            ...paramsOther
        })
        .then((response) => {
            resolve(response.json());
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
