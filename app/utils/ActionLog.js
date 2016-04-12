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
 * a. String action: A string with action num
 * b. String extend: The extend params to send
 *
 */
import { NativeModules } from 'nuke'

module.exports = NativeModules.ActionUtil;
