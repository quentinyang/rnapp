package com.xinyi.fy360;

import android.app.Application;
import android.util.Log;

import com.angejia.android.applog.ActionLog;
import com.angejia.android.commonutils.common.DevUtil;
import com.custom.component.ModulePackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

// 1. Import the plugin class
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;
import com.facebook.react.shell.MainReactPackage;
import com.xinyi.fy360.getui.GeTuiManager;
import com.xinyi.fy365.deviceid.DeviceIDManager;

import com.imagepicker.ImagePickerPackage;

/**
 * Created by renjieguan on 16/4/11.
 */
public class MyApp extends Application implements ReactApplication {
    public static MyApp _instance;

    public static MyApp getInstance() {
        if (_instance == null) {
            _instance = new MyApp();
        }
        return _instance;
    }


    @Override
    public void onCreate() {
        super.onCreate();
        _instance = this;
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
        DevUtil.setDebug(BuildConfig.DEBUG);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        // 2. Override the getJSBundleFile method in order to let
        // the CodePush runtime determine where to get the JS
        // bundle location from on each app start
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile("index.android.jsbundle");
        }

        @Override
        protected List<ReactPackage> getPackages() {
            // 3. Instantiate an instance of the CodePush runtime and add it to the list of
            // existing packages, specifying the right deployment key. If you don't already
            // have it, you can run "code-push deployment ls <appName> -k" to retrieve your key.
            return Arrays.<ReactPackage>asList(
                    new RNDeviceInfo(),
                    new MainReactPackage(),
                    new ModulePackage(),
                    new GeTuiManager(),
                    new AliPackage(),
                    new RNAudioPlayer(),
                    new DeviceIDManager(),
                    new ImagePickerPackage(),
                    new CodePush(BuildConfig.CODE_PUSH_KEY, MyApp.this, BuildConfig.DEBUG)
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
