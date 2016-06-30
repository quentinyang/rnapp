'use strict';

import * as types from '../constants/Card';
import {makeActionCreator, serviceAction} from './base';
import { getWelfareList } from '../service/cardService';

export const welfareListFetched = makeActionCreator(types.WELFARE_LIST_FETCHED, 'wfData');

export function fetchWelfareList(params) {
    let oData = {

        "items" : [
            {
                "id": "1", //用户福利卡id
                "name": "福利卡", //福利卡名称
                "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                "type": "1", //1看房卡, 2补签卡
                "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
                "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
                "begin_at": "", //开始时间，空为获取时就开始
                "end_at": "2016-07-16", //过期时间
                "created_at": "2016-06-01", //获取时间
                "used_at": "2016-06-05" //使用时间，未使用时为空
            },
            {
                "id": "2", //用户福利卡id
                "name": "看房卡", //福利卡名称
                "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                "type": "1", //1看房卡, 2补签卡
                "cost": "2", //花费积分，0积分为免费。补签卡则另外说明
                "status": "2", //使用状态, 0不可用, 1可用, 2已用，3过期
                "begin_at": "", //开始时间，空为获取时就开始
                "end_at": "2016-07-16", //过期时间
                "created_at": "2016-06-01", //获取时间
                "used_at": "2016-06-05" //使用时间，未使用时为空
            },
            {
                "id": "3", //用户福利卡id
                "name": "看房卡", //福利卡名称
                "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                "type": "1", //1看房卡, 2补签卡
                "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
                "status": "3", //使用状态, 0不可用, 1可用, 2已用，3过期
                "begin_at": "", //开始时间，空为获取时就开始
                "end_at": "2016-07-16", //过期时间
                "created_at": "2016-06-01", //获取时间
                "used_at": "2016-06-05" //使用时间，未使用时为空
            },
            {
                "id": "4", //用户福利卡id
                "name": "看房卡", //福利卡名称
                "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
                "type": "1", //1看房卡, 2补签卡
                "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
                "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
                "begin_at": "", //开始时间，空为获取时就开始
                "end_at": "2016-07-16", //过期时间
                "created_at": "2016-06-01", //获取时间
                "used_at": "2016-06-05" //使用时间，未使用时为空
            }
        ],
        "pager" : {
            "total" : "31", //总数据量
            "page" : "1", //当前页数
            "per_page" : "10" //每页数据量
        }

    }
    return welfareListFetched(oData)
    // return dispatch => {
    //     serviceAction(dispatch)({
    //         service: getWelfareList,
    //         data: params,
    //         success: function(oData) {
    //             dispatch(welfareListFetched(oData))
    //         },
    //         error: function(oData) {

    //         }
    //     })
    // }
}
