package com.custom.component;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.angejia.android.applog.ActionLog;
import com.angejia.android.applog.entity.Extend;
import com.angejia.android.applog.entity.Log;
import com.angejia.android.applog.entity.Usage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Iterator;

/**
 * Created by angejia on 16/4/12.
 */
public class ActionUtil extends ReactContextBaseJavaModule {
    public ActionUtil(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ActionUtil";
    }

    @ReactMethod
    public static void setAction(String action) {
        Log log = new Log();
        log.setAction(action);
        log.setClickTime(System.currentTimeMillis() / 1000 + "");

        ActionLog.setAction(getUsage(), log);
    }

    @ReactMethod
    public static void setActionWithExtend(String action, String params) {
        Log log = new Log();
        log.setAction(action);
        log.setClickTime(System.currentTimeMillis() / 1000 + "");

        Extend extend = new Extend();
        extend.setCols(params);
        log.setExtend(extend);

        ActionLog.setAction(getUsage(), log);
    }

    public static Usage getUsage() {
        return new Usage("当前用户userId", null, null, null);
    }
}
