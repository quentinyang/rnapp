package com.xinyi.fy360;

/**
 * Created by zhouxiaojian on 16/7/4.
 */

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;

public class RNAudioPlayerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;
    MediaPlayer mp;


    public RNAudioPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNAudioPlayer";
    }

    @ReactMethod
    public void play(String audio) {
        if(mp != null) {
            mp.reset();
        } else {
            mp = new MediaPlayer();
        }

        try {
            mp.setDataSource(audio);
            mp.prepare();
            mp.start();
            mp.setOnCompletionListener(new OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    handleRemoteNotificationReceived("mediaCompletioned", null);
                    mp.reset();
                    mp.release();
                    mp = null;
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void pause() {
        if (mp != null) {
            mp.pause();
        }
    }

    @ReactMethod
    public void stop() {
        if (mp != null) {
            mp.stop();
        }
    }

    public void handleRemoteNotificationReceived(String eventName, String params) {
        try {
            this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
    }
}

