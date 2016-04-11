'use strict';

import React, {ToastAndroid} from 'react-native';

export function ToastShort(content) {
    ToastAndroid.show(new String(content), ToastAndroid.SHORT);
}

export function ToastLong(content) {
    ToastAndroid.show(new String(content), ToastAndroid.LONG);
}