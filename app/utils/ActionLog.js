'use strict';

/**
 * This exposes the ActioinUtil module as a JS module.
 *
 * 1. function 'setAction'
 *
 * parameters:
 * a. String action: A string with action num
 *
 * 2. function 'setActionWithExtend'
 *
 * parameters
 * json: {"vpid": "", "bp": "", "aid": "", "brokerId": "", "visitId": "", "appOpenTime": "", "appCloseTime": "", "other_custum_cols": ""}
 *
 * 3. function 'setUsage'
 *
 * parameters
 * json: {"uid": "uid", "ccid": "ccid", "gcid": "gcid", "lat": "lat", "lng": "lng"}
 *
 * 4.setUid(String uid)
 * 5.setCcid(String ccid)
 * 6.setGcid(String gcid)
 * 7.setGeo(String geo)  //geo: "lat-lng"
 *
 */
import { NativeModules } from 'nuke'

//NativeModules.ActionUtil.setUsage({"uid": "uid", "ccid": "ccid", "gcid": "gcid", "lat": "lat", "lng": "lng"});

module.exports = NativeModules.ActionUtil;
