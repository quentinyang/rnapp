package com.custom.component;

<<<<<<< b88f65f801b5902db554de10c20b1efbfac2e0c4
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Callback;
import com.xinyi.fy360.BuildConfig;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Utils extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public Utils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Utils";
    }

    public void sendEvent(String eventName, String params) {
        android.util.Log.i("handle", eventName + " event...");
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public static void getApiHost(Callback callback) {
        callback.invoke(BuildConfig.API_HOST);
    }

    @ReactMethod
    public static void getEnv(Callback callback) {
        callback.invoke(BuildConfig.DEBUG);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("host", BuildConfig.API_HOST);
        constants.put("isDebug", BuildConfig.DEBUG);
        return constants;
    }
}
