package com.xinyi.fy360.receiver;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;

import com.custom.component.ModulePackage;

/**
 * Created by angejia on 16/5/18.
 */
public class CallReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        TelephonyManager tm = (TelephonyManager) context.getSystemService(Service.TELEPHONY_SERVICE);

        switch (tm.getCallState()) {
            case TelephonyManager.CALL_STATE_RINGING: //响铃
                break;
            case TelephonyManager.CALL_STATE_OFFHOOK: //接听电话
                break;
            case TelephonyManager.CALL_STATE_IDLE: //挂断电话
                if(null != ModulePackage.callModule) {
                    ModulePackage.callModule.sendEvent("callIdle", "");
                }
                break;
            default:
                break;
        }
    }
}
