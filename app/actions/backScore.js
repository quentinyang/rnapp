'use strict';
import {InteractionManager} from 'nuke'
import * as types from '../constants/BackScore';
import {makeActionCreator, serviceAction} from './base';
import {postFeedback, postRefund} from '../service/detailService';
import {setFeedbackVisible} from './detail'
import {fetchPrependContactHouse} from './settings'
export const changeSuccessModalVisible = makeActionCreator(types.SUCCESS_MODAL_VISIBLE_CHANGE, 'visible');

export function submitReason(params, nav, origin) {
    return dispatch => {
        serviceAction(dispatch)({
            service: origin == 'ContactHouse' ? postRefund : postFeedback,
            data: params,
            success: function() {
                dispatch(changeSuccessModalVisible(true));

                InteractionManager.runAfterInteractions(() => {
                    if(origin == 'ContactHouse') {
                        fetchPrependContactHouse({page: 1});
                    }
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