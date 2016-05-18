package com.custom.component;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by angejia on 16/5/18.
 */
public class CallModule extends ReactContextBaseJavaModule{
    ReactApplicationContext reactContext;

    public CallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CallModule";
    }

    public void sendEvent(String eventName, String params) {
        Log.d("handle", "send event...");
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
