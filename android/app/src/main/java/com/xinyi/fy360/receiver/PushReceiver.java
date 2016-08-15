package com.xinyi.fy360.receiver;

/**
 * Created by zhouxiaojian on 16/4/13.
 */

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.res.ResourcesCompat;
import android.util.Log;

import com.igexin.sdk.PushConsts;

import com.xinyi.fy360.MainActivity;
import com.xinyi.fy360.R;
import com.xinyi.fy360.getui.GeTuiManager;

import org.json.JSONException;
import org.json.JSONObject;

public class PushReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        Log.d("GetuiSdkDemo", "onReceive() action=" + bundle.getInt("action"));

        switch (bundle.getInt(PushConsts.CMD_ACTION)) {
            case PushConsts.GET_CLIENTID:
                // 获取ClientID(CID)
                // 第三方应用通常需要将CID上传到第三方服务器，并且将当前用户帐号和CID进行关联，以便日后通过用户帐号查找CID进行消息推送。
                // 部分特殊情况下CID可能会发生变化，为确保应用服务端保存的最新的CID，应用程序在每次获取CID广播后，如果发现CID出现变化，需要重新进行一次关联绑定
                String cid = bundle.getString("clientid");

                Log.d("GetuiSdkDemo", "Got CID:" + cid);
                if (null != GeTuiManager.module) {
                    GeTuiManager.module.setClientId(cid);
                    GeTuiManager.module.handleRemoteNotificationReceived("clientIdReceived", cid);
                }
                break;
            case PushConsts.GET_MSG_DATA:
                // 获取透传（payload）数据
                String taskid = bundle.getString("taskid");
                String messageid = bundle.getString("messageid");
                byte[] payload = bundle.getByteArray("payload");
                if (payload != null) {
                    String dataString = new String(payload);
                    Log.d("GetuiSdkDemo", "Got Payload:" + dataString);

                    try {
                        JSONObject dataObject = new JSONObject(dataString);

                        showNotifyToActivityWithExtra(context, dataObject, dataString);
                        if (null != GeTuiManager.module) {
                            Log.d("ccz", "pushReceiver send event");
                            //GeTuiManager.module.handleRemoteNotificationReceived("geTuiDataReceived", dataString);

                            JSONObject data = new JSONObject();
                            data.put("payloadMsg", dataString);
                            data.put("isOffline", false);
                            GeTuiManager.module.handleRemoteNotificationReceived("geTuiDataReceived", data.toString());
                        } else {
                            Log.d("ccz", "pushReceiver sp save");
                            SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(context);
                            sp.edit().putString("dataString", dataString).commit();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                break;
            default:
                break;
        }
    }

    private static Bitmap getNotifyLargeIcon(Context context, int resId) {
        BitmapDrawable bd = (BitmapDrawable) ResourcesCompat.getDrawable(context.getResources(), resId, context.getTheme());
        Bitmap largeIcon = bd.getBitmap();
        return largeIcon;
    }

    public static void showNotifyToActivityWithExtra(Context context, JSONObject dataObject, String dataString) {
        String title = "";
        String type = "";

        try {
            title = dataObject.getJSONObject("data").getString("msg");
            type = dataObject.getString("type");

        } catch (JSONException e) {
            e.printStackTrace();
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context)
                .setSmallIcon(R.mipmap.ic_icon_notify)
                .setLargeIcon(getNotifyLargeIcon(context, R.mipmap.ic_launcher))
                .setTicker("第一房源:" + title)
                .setContentTitle("第一房源")
                .setContentText(title)
                .setOnlyAlertOnce(false)
                .setAutoCancel(true)
                .setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE);
        Intent newIntent = new Intent();
        newIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        newIntent.setClass(context, MainActivity.class);
        newIntent.putExtra("type", type);
        newIntent.putExtra("payload", dataString);
        PendingIntent pendingIntent;
        pendingIntent = PendingIntent.getActivity(context, 900009, newIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        builder.setContentIntent(pendingIntent);


        try {
            NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            mNotificationManager.notify(900009, builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}