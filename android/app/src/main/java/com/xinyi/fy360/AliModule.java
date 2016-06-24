package com.xinyi.fy360;

/**
 * Created by skyline on 16/5/13.
 */

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.alipay.sdk.app.PayTask;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AliModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public AliModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Alipay";
    }

    @ReactMethod
    public void addEvent(final String message, final String order) {
        Runnable payRunnable = new Runnable() {

            @Override
            public void run() {
                // 构造PayTask 对象
                PayTask alipay = new PayTask(getCurrentActivity());
                // 调用支付接口，获取支付结果
                String result = alipay.pay(message, true);
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(order+"EventReminder", result);
            }
        };

        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }
}
