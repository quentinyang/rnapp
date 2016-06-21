package com.xinyi.fy360;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

/**
 * Created by quentin on 16-04-08.
 */
public class WelcomeActivity extends Activity{


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        mHandler.sendEmptyMessageDelayed(1, 1500);
        Log.d("life welcome", "onCreate");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d("life welcome", "onResume");
    }

    private Handler mHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            finish();
            startActivity(new Intent(WelcomeActivity.this, MainActivity.class));
        }

    };
}
