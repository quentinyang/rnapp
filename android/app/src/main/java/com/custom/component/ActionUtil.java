package com.custom.component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.angejia.android.applog.ActionLog;
import com.angejia.android.applog.entity.Extend;
import com.angejia.android.applog.entity.Log;
import com.angejia.android.applog.entity.Usage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.Iterator;

/**
 * Created by angejia on 16/4/12.
 */
public class ActionUtil extends ReactContextBaseJavaModule {
    static Usage usageObj = new Usage();

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
    public static void setActionWithExtend(String action, ReadableMap params) {
        Log log = new Log();
        log.setAction(action);
        log.setClickTime(System.currentTimeMillis() / 1000 + "");

        Extend extend = new Extend();
        ReadableMapKeySetIterator r = params.keySetIterator();
        JSONObject jsonObject = new JSONObject();

        while (r.hasNextKey()){
            String key = r.nextKey();

            switch (key) {
                case "vpid":
                    extend.setVpid(params.getString(key));
                    break;
                case "bp":
                    extend.setBp(params.getString(key));
                    break;
                case "aid":
                    extend.setAid(params.getString(key));
                    break;
                case "brokerId":
                    extend.setBrokerId(params.getString(key));
                    break;
                case "visitId":
                    extend.setVisitId(params.getString(key));
                    break;
                case "appOpenTime":
                    extend.setAppOpenTime(params.getString(key));
                    break;
                case "appCloseTime":
                    extend.setAppCloseTime(params.getString(key));
                    break;
                default:
                    String a = params.getType(key).toString();
                    jsonObject.put(key, params.getType(key).toString());
                    //jsonObject.put(key, params.getString(key));
                    break;
            }
        }

        extend.setCols(jsonObject.toString());
        log.setExtend(extend);

        ActionLog.setAction(getUsage(), log);
    }

    @ReactMethod
    public static void setUid(String uid) {
        usageObj.setUid(uid);
    }
    @ReactMethod
    public static void deleteUid() {
        usageObj.setUid("");
    }
    @ReactMethod
    public static void setCcid(String ccid) {
        usageObj.setCcid(ccid);
    }
    @ReactMethod
    public static void setGcid(String gcid) {
        usageObj.setGcid(gcid);
    }
    @ReactMethod
    public static void setGeo(String geo) {
        usageObj.setGeo(geo);
    }

    @ReactMethod
    public static void setUsage(ReadableMap usageConfig) {

        ReadableMapKeySetIterator r = usageConfig.keySetIterator();
        String geoStr = "";
        while (r.hasNextKey()){
            String key = r.nextKey();
            switch(key) {
                case "uid":
                    usageObj.setUid(usageConfig.getString(key));
                    break;
                case "ccid":
                    usageObj.setCcid(usageConfig.getString(key));
                    break;
                case "gcid":
                    usageObj.setGcid(usageConfig.getString(key));
                    break;
                case "lat":
                    geoStr += usageConfig.getString(key);
                    break;
                case "lng":
                    geoStr += "-" + usageConfig.getString(key);
                    break;
                default:
                    break;
            }
        }
        if(geoStr.length() > 0) {
            usageObj.setGeo(geoStr);
        }
    }

    public static Usage getUsage() {
        return usageObj;
    }
}
