'use strict';
import {InteractionManager} from 'nuke'
import * as types from '../constants/BackScore';
import {makeActionCreator, serviceAction} from './base';
import {postFeedback} from '../service/detailService';
import {setFeedbackVisible} from './detail'
export const changeSuccessModalVisible = makeActionCreator(types.SUCCESS_MODAL_VISIBLE_CHANGE, 'visible');

export function submitReason(params, nav) {
    return dispatch => {
        serviceAction(dispatch)({
            service: postFeedback,
            data: params,
            success: function() {
                dispatch(changeSuccessModalVisible(true));

                InteractionManager.runAfterInteractions(() => {
                    setTimeout(() => {
                        dispatch(changeSuccessModalVisible(false));
                        nav.pop();
                    }, 2000);
                });
            },
            error: function(oData) {

            }
        })
    }
}