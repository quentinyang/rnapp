package com.xinyi.fy360;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;

// Import Getui
import com.igexin.sdk.PushManager;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import com.xinyi.fy360.getui.GeTuiManager;

import org.json.JSONException;
import org.json.JSONObject;

import com.networkbench.agent.impl.NBSAppAgent;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "fy360";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setPushAction(getIntent());
        //checkHash();
        OpenAppActivity.hasLanched = true;


        //if (!PushManager.getInstance().isPushTurnedOn(this)) {
        Log.d("GetuiSdkDemo init", "init instance");
        PushManager.getInstance().initialize(this.getApplicationContext());
        //}

        NBSAppAgent.setLicenseKey(BuildConfig.TY_APPKEY_VALUE).withLocationServiceEnabled(true).start(this.getApplicationContext());
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
    public void onNewIntent(Intent intent) {
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

        final SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this);
        final String payload = sp.getString("dataString", "");

        if(!payload.equals("")) {
            try {
                JSONObject dataObject = new JSONObject(payload);
                String type = dataObject.getString("type");
                //if (type.equals("2")) {
                    getWindow().getDecorView().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            if (null != GeTuiManager.module) {
                                Log.d("ccz", "onResume send event");
                                //GeTuiManager.module.handleRemoteNotificationReceived("geTuiDataReceived", payload);


                                try{
                                    JSONObject data = new JSONObject();
                                    data.put("payloadMsg", payload);
                                    data.put("isOffline", true);
                                    GeTuiManager.module.handleRemoteNotificationReceived("geTuiDataReceived", data.toString());


                                    sp.edit().putString("dataString", "").commit();
                                }catch (JSONException e) {
                                    e.printStackTrace();
                                }

                            }
                        }
                    }, 3000);
                //}
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
}