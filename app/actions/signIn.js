'use strict';

import * as types from '../constants/SignIn';
import {signInStatusService} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const signInfoFetched = makeActionCreator(types.SIGN_INFO_FETCHED, 'info');
export const cleanSignInfo = makeActionCreator(types.CLEAN_SIGN_INFO);

export function fetchSignInfo() {
    return dispatch => {
        serviceAction(dispatch)({
            service: signInStatusService,
            success: function(oData) {
                var oData = {
                    "collected_welfare_cards" : { //已领取礼包
                        "total": "1", //条数
                        "welfare_cards": [
                            {
                                "name": "看房卡",  // 福利卡名称
                                "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                                "type": "1", // 1看房卡, 2补签卡
                                "cost": "1", // 花费积分，0积分为免费。补签卡则另外说明
                            }]
                    },
                    "future_welfare_cards": [ //未达成
                        {
                            "sign_in_days": "15", // 抢到天数
                            "total": "1", // 总数
                            "welfare_cards": [ // 福利卡，如果多张则多个数据
                                {
                                    "name": "看房卡",  // 福利卡名称
                                    "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                                    "type": "2", // 1看房卡, 2补签卡
                                    "cost": "1", // 花费积分，0积分为免费。补签卡则另外说明
                                }
                            ]
                        },
                        {
                            "sign_in_days" : 30, // 签到天数
                            "total": "1", // 总数
                            "welfare_cards" : [ // 福利卡，如果多张则多个数据
                                {
                                    "name": "看房卡",  // 福利卡名称
                                    "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                                    "type": "1", // 1看房卡, 2补签卡
                                    "cost": "1", // 花费积分，0积分为免费。补签卡则另外说明
                                }
                            ]
                        }
                    ]

                };
                for(var i = 0; i < oData.future_welfare_cards.length; i++) {
                    for(var j = 0; j < oData.future_welfare_cards[i].welfare_cards.length; j++) {
                        oData.future_welfare_cards[i].welfare_cards[j].status = 1;
                    }
                }
                dispatch(signInfoFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

