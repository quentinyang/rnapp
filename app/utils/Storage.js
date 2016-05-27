'use strict';

import React from 'react';
import {AsyncStorage} from 'react-native';

var deviceStorage = {
    get: function(key) {
        return AsyncStorage.getItem(key).then(function(value) {
            return JSON.parse(value);
        }).catch((error) => {
            console.log(error);
        });
    },

    save: function(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    },

    update: function(key, value) {
        return deviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    },

    delete: function(key) {
        return AsyncStorage.removeItem(key);
    }
};

export default deviceStorage;