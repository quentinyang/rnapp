'use strict';

import * as types from '../constants/User';
import {profileService} from '../service/userService';
import {makeActionCreator} from './base';

export const userProfileFetched = makeActionCreator(types.USER_PROFILE, 'profile');

export function fetchUserProfile(params) {
    return dispatch => {
        return profileService()
            .then((oData) => {
                console.info('[Ajax Success] User Profile: ', oData);
                dispatch(userProfileFetched(oData))
            })
            .catch((error) => {
                console.error('[Ajax Error] User Profile: ', error);
            })
    }
}