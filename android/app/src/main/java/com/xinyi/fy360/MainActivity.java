package com.xinyi.fy360;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Log;

import com.angejia.android.commonutils.common.DevUtil;
import com.custom.component.ActionPackage;
import com.custom.component.ActionUtil;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

// Import Getui
import com.igexin.sdk.PushManager;

// 1. Import the plugin class
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

// Import react native device info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.umeng.analytics.MobclickAgent;

import com.xinyi.fy360.getui.GeTuiManager;

public class MainActivity extends ReactActivity {

    // 2. Define a private field to hold the CodePush runtime instance
    private CodePush _codePush;

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
        this._codePush = new CodePush("h1P3-9fxoznO3bDQ9qubMvvG0ewm4yoltiYTl", this, BuildConfig.DEBUG);

        // 5. Add the CodePush package to the list of existing packages
        return Arrays.<ReactPackage>asList(
                new RNDeviceInfo(),
                new MainReactPackage(),
                new ActionPackage(),
                new GeTuiManager(),
                this._codePush.getReactPackage()
        );

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d("onCreate", "initializing sdk...");
        super.onCreate(savedInstanceState);
        PushManager.getInstance().initialize(this.getApplicationContext());
        //checkHash();
        // Important::please do not change this code, unless change it in the `switch.js`
        DevUtil.setDebug(true);
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

    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

}


