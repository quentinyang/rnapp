package com.custom.component;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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
        Log.d("handle", "send call idle event...");
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void callUp(String phone) {
        Log.d("phone", phone);
        Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:"
                + phone));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }
}
