package com.xinyi.fy360;

import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;
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

public class MainActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isShowToolbar(false);
        setContentView(R.layout.activity_welcome);
        mHandler.sendEmptyMessageDelayed(GO_LOGIN, 1500);
    }

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            startActivity(new Intent(WelcomeActivity.this, MainActivity.class));
        }

    };

}
