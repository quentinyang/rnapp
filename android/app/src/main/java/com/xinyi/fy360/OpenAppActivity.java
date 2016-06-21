package com.xinyi.fy360;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.custom.component.ModulePackage;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by angejia on 16/6/20.
 */
public class OpenAppActivity extends Activity {
    private final Timer timer = new Timer();
    private TimerTask task;
    private String pageName;
    public static Boolean hasLanched = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final Intent intent = getIntent();

        task = new TimerTask() {
            @Override
            public void run() {
                if (null != ModulePackage.utils) {
                    ModulePackage.utils.sendEvent("goPage", "page=" + pageName);
                }
            }
        };

        if (intent != null){
            Uri uri = intent.getData();
            if (uri != null){
                pageName = uri.getQuery();
                intent.setClass(this, MainActivity.class);

                if(hasLanched) {
                    if (null != ModulePackage.utils) {
                        ModulePackage.utils.sendEvent("goPage", "page=" + pageName);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    timer.schedule(task, 4000);
                    startActivity(intent);
                    finish();
                }
            }
        }
    }
}
