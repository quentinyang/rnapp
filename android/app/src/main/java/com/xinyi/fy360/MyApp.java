package com.xinyi.fy360;

import android.app.Application;

import com.angejia.android.applog.ActionLog;
import com.angejia.android.commonutils.common.PhoneInfoUtil;

/**
 * Created by renjieguan on 16/4/11.
 */
public class MyApp extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        //初始化
        /**
         *
         * @param debugSigHash  debug前面的hash
         * @param releaseSigHash    release签名的hash
         * @param appName 应用标示 eg a-angejia(用户端android)
         * @param context
         * @param timeInterval 发送间隔 单位秒
         * @param logMaxNum 当log累计达该数量时发送
         */
        ActionLog.reactNativeInit(-297722831, -297722831, "fy360", this, 3 * 60, 5);
    }
}
