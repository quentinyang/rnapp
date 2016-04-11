'use strict';

import {AsyncStorage} from 'react-native';

export default class AsyncStorageComponent {
    constructor() {}

    static async get(storage_key) {
        try {
            var value = await AsyncStorage.getItem(storage_key);
            return value;
        } catch (error) {
            this._appendMessage('AsyncStorage error: ' + error.message);
        }
    }

    static async save(storage_key, selectedValue) {
        try {
            await AsyncStorage.setItem(storage_key, selectedValue);
        } catch (error) {
            this._appendMessage('AsyncStorage error: ' + error.message);
        }
    }

    static async remove(storage_key) {
        try {
            await AsyncStorage.removeItem(storage_key);
        } catch (error) {
            this._appendMessage('AsyncStorage error: ' + error.message);
        }
    }

    _appendMessage(message) {
        console.log(message);
        //this.setState({storageErrorMessages: this.state.messages.concat(message)});
    }
}