package com.xinyi.fy360;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.angejia.android.commonutils.common.DevUtil;
import com.custom.component.ModulePackage;
import com.custom.component.Utils;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

// Import Getui
import com.igexin.sdk.PushManager;

// 1. Import the plugin class
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

// Import react native device info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.umeng.analytics.MobclickAgent;

import com.xinyi.fy360.getui.GeTuiManager;
import com.xinyi.fy365.deviceid.DeviceIDManager;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

    // 2. Define a private field to hold the CodePush runtime instance
    private CodePush _codePush;

    private final Timer timer = new Timer();
    private TimerTask task;

    // 3. Override the getJSBundleFile method in order to let
    // the CodePush runtime determine where to get the JS
    // bundle location from on each app start
    @Override
    protected String getJSBundleFile() {
        return this._codePush.getBundleUrl("index.android.jsbundle");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "fy360";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {

        Log.d("GetuiSdk", "initializing sdk...");
//        PushManager.getInstance().initialize(this.getApplicationContext());

        // 4. Instantiate an instance of the CodePush runtime, using the right deployment key. If you don't
        // already have it, you can run "code-push deployment ls <appName> -k" to retrieve your key.
        //this._codePush = new CodePush(BuildConfig.CODE_PUSH_KEY, this, BuildConfig.DEBUG);
        this._codePush = new CodePush("h1P3-9fxoznO3bDQ9qubMvvG0ewm4yoltiYTl", this, BuildConfig.DEBUG);

        // 5. Add the CodePush package to the list of existing packages
        return Arrays.<ReactPackage>asList(
                new ModulePackage(),
                new RNDeviceInfo(),
                new MainReactPackage(),
                new GeTuiManager(),
                new AliPackage(),
                new DeviceIDManager(),
                this._codePush.getReactPackage()
        );
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!PushManager.getInstance().isPushTurnedOn(this.getApplicationContext())) {
            PushManager.getInstance().initialize(this.getApplicationContext());
        }
        //checkHash();
        // Important::please do not change this code, unless change it in the `switch.js`
        DevUtil.setDebug(true);
        Intent intent = getIntent();
        setPushAction(intent);
        //Log.d("umengKey", "UmengKey:" + BuildConfig.umengKey);

        task = new TimerTask() {
            @Override
            public void run() {
                if (null != ModulePackage.utils) {
                    android.util.Log.i("life" , "send event if");
                    ModulePackage.utils.sendEvent("goPage", "HouseList");
                }

            }
        };
    }

    //检查hash
    private void checkHash() {
        PackageInfo info = null;
        try {
            info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature sig : info.signatures) {
                android.util.Log.i("grj" , "sig:" + sig.hashCode() + "");
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setPushAction(intent);
    }

    private void setPushAction(Intent intent){
        if (null != intent.getStringExtra("type") && intent.getStringExtra("type").equals("1")){
            if (null != GeTuiManager.module) {
                GeTuiManager.module.handleRemoteNotificationReceived("setGeTuiOpenAction", "");
            }
        }

    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);

        Intent intent = getIntent();
        if (intent != null){
            Uri uri = intent.getData();
            android.util.Log.i("life", "intent if");

            if (uri != null){
                android.util.Log.i("life", "uri if");
                String dataString = intent.getDataString();
                String scheme = uri.getScheme();
                String host = uri.getHost();
                String query = uri.getQuery();

                Log.d("url", "dataString = " + dataString + " | scheme = " + scheme + " | host = " + host + " | query = " + query);
                android.util.Log.i("life query", query);

                timer.schedule(task, 4000);
            }
        }
        android.util.Log.i("life", "onResume");
    }

    @Override
    protected @Nullable Bundle getLaunchOptions() {
        return null;
    }
}