## 生态圈App

## Device Info

```
console.log("Device Unique ID", DeviceInfo.getUniqueID());  // e.g. FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
// * note this is IDFV on iOS so it will change if all apps from the current apps vendor have been previously uninstalled
console.log("Device Manufacturer", DeviceInfo.getManufacturer());  // e.g. Apple
console.log("Device Model", DeviceInfo.getModel());  // e.g. iPhone 6
console.log("Device ID", DeviceInfo.getDeviceId());  // e.g. iPhone7,2 / or the board on Android e.g. goldfish
console.log("Device Name", DeviceInfo.getSystemName());  // e.g. iPhone OS
console.log("Device Version", DeviceInfo.getSystemVersion());  // e.g. 9.0
console.log("Bundle Id", DeviceInfo.getBundleId());  // e.g. com.learnium.mobile
console.log("Build Number", DeviceInfo.getBuildNumber());  // e.g. 89
console.log("App Version", DeviceInfo.getVersion());  // e.g. 1.1.0
console.log("App Version (Readable)", DeviceInfo.getReadableVersion());  // e.g. 1.1.0.89
console.log("Device Name", DeviceInfo.getDeviceName());  // e.g. Becca's iPhone 6
console.log("User Agent", DeviceInfo.getUserAgent()); // e.g. Dalvik/2.1.0 (Linux; U; Android 5.1; Google Nexus 4 - 5.1.0 - API 22 - 768x1280 Build/LMY47D)
console.log("Device Locale", DeviceInfo.getDeviceLocale()); // e.g en-US
console.log("Device Country", DeviceInfo.getDeviceCountry()); // e.g US
```

## 目录说明

```
fy360-native
    \- ios
    \- android
        \- app
            \- src
                \- main
                    \- assets (放置index.android.jsbundle)
                    \- res (放置android图片)
    \- app
        \- image
        \- ...(业务代码)
    \- release (codepush更新)
```

## `react-native`脚本

1. __[常用]开发时部署到真机__

```
# IOS
rm -rf index.ios.jsbundle assets/app/
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./index.ios.jsbundle \
--assets-dest ./ \
--dev false

# Android
rm -rf android/app/src/main/assets/index.android.jsbundle android/app/src/main/res/drawable-mdpi
react-native bundle --platform android --entry-file index.android.js \
--bundle-output ./android/app/src/main/assets/index.android.jsbundle \
--assets-dest ./android/app/src/main/res/ \
--dev false

react-native run-android
```

1. _[`平时不用`]_使用codepush提交更新时

```
# IOS
rm -rf ./release/index.ios.jsbundle ./release/assets/app/
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./release/index.ios.jsbundle \
--assets-dest ./release \
--dev false

# Android
rm -rf ./release/index.android.jsbundle ./release/drawable-mdpi
react-native bundle --platform android --entry-file index.android.js  \
--bundle-output ./release/index.android.jsbundle \
--assets-dest ./release \
--dev false

# 推送到云
 - Debug: `code-push release FangYuan360 ./release 1.0.0`
 - Release: `code-push release FangYuan360-Release ./release 1.0.0`

 PS: 

 - `code-push deployment history FangYuan360 Staging` 查看历史
 - `code-push deployment ls FangYuan360 -k` 查看Key

```

## 正式打包Todo List：
1. 关闭`Yellow Box`
 ```
 console.disableYellowBox = true; 
 ```

1. Code push appkey修改
 1. 修改`./fy360-native/ios/fy360/Info.plist`文件，找到如下代码修改Key值：

 ```
 <key>CodePushDeploymentKey</key>
 <string>h1P3-9fxoznO3bDQ9qubMvvG0ewm4yoltiYTl</string>
 ```
 
 备注：
 
 线下开发环境：`h1P3-9fxoznO3bDQ9qubMvvG0ewm4yoltiYTl`
 
 线上生产环境：`_GhPy-CMXi1mTX0CetRfMU82NLvZ4yoltiYTl`

 额外，检查版本号

 IOS`./fy360-native/ios/fy360/Info.plist`需要检查`CFBundleShortVersionString`值，下一个版本要自动加1：

 ```
         <key>CFBundlePackageType</key>
         <string>APPL</string>
         <key>CFBundleShortVersionString</key>
 -       <string>1.0.1</string>
 +       <string>1.0.2</string>
         <key>CFBundleVersion</key>
 -       <string>1.0.1.2</string>
 +       <string>1.0.2.0</string>
 ```
 Android `android/app/build.gradle`，更新`versionName`值

 ```
 android{
   defaultConfig {
     versionName "1.0.2"
   }  
 }
 ```
 
 1. 修改`./fy360-native/android/app/src/main/java/com/xinyi/fy360/MainActivity.java`文件，找到如下代码修改Key值：
 
 ```
 new CodePush("h1P3-9fxoznO3bDQ9qubMvvG0ewm4yoltiYTl", this, BuildConfig.DEBUG);
 ```
1. 个推

 - IOS `ios/fy360/AppDelegate.h`

 ```
 /// 个推开发者网站中申请App时，注册的AppId、AppKey、AppSecret
 #ifdef DEBUG
  #define kGtAppId           @"Ln5H71Iykf94XdqPoLTHI8"
  #define kGtAppKey          @"NA6fia56568ieAobzLmJw5"
  #define kGtAppSecret       @"Ntat8Ou93MAvkeE3uxSOj3"
 #else
  #define kGtAppId           @"ay6BIg9J4bA2Hb9FPZ00v8"
  #define kGtAppKey          @"SvO4Xb1j0FA1ZHQPUQWjQ6"
  #define kGtAppSecret       @"dtztWFamWJ6ZRAOV94LcX5"
 #endif
 ```
 - Android `./fy360-native/android/app/src/main/AndroidManifest.xml`
 
 注意：APPID 有两个地方，线上的AppId, AppKey, AppSecret参照上面的。

 ```
 <meta-data
     android:name="PUSH_APPID"
     android:value="ay6BIg9J4bA2Hb9FPZ00v8" /><!--替换为第三方应用的APPID-->
 <meta-data
     android:name="PUSH_APPKEY"
     android:value="SvO4Xb1j0FA1ZHQPUQWjQ6" /><!--替换为第三方应用的APPKEY-->
 <meta-data
     android:name="PUSH_APPSECRET"
     android:value="dtztWFamWJ6ZRAOV94LcX5" /><!--替换为第三方应用的APPSECRET-->
 ```

1. 友盟

 - IOS `ios/fy360/AppDelegate.m`
 
 ```
 #ifdef DEBUG
 NSString * const UMengAppKey = @"56fe11a6e0f55ac112001746";
 NSString * const UMengChannelId = @"Web";
 #else
 NSString * const UMengAppKey = @"56fe11cce0f55a61740009e4";
 NSString * const UMengChannelId = @"";
 #endif
 ```
 - Android `android/app/src/main/AndroidManifest.xml`
  - Development `56fe1060e0f55a1eea002284`
  - AppStore `56fe116867e58e6deb001a08`

 ```
 <meta-data android:value="56fe1060e0f55a1eea002284" android:name="UMENG_APPKEY"></meta-data>
 <meta-data android:value="AppStore" android:name="UMENG_CHANNEL"/>
 ```
配置： [友盟配置](http://dev.umeng.com/analytics/android-doc/integration#1_3)
  

## 内部打包上传说明

1. 内部包管理在[https://d.corp.angejia.com/](https://d.corp.angejia.com/)，主机地址192.168.169.14。

 上传服务器位置：`/srv/app/ios_package/fangyuan360/`，内设`dev`,`alpha`,`master`三种环境。

 如下示例上传到`dev`环境：

```
# IOS
scp ~/Desktop/fy360-ios-dev/fy360.ipa angejia@192.168.169.14:/srv/app/ios_package/fangyuan360/dev/fy360.ipa
fy360.ipa
# Android
scp ~/Desktop/fy360-android-dev/app-debug.apk angejia@192.168.169.14:/srv/app/android_package/fangyuan360/app-dev.apk
```

## Android签名备忘

- Password&Key Password: `FY360@2016#RN`
- Alias: `Android-Signature`
- First and Last Name: `XinYi`
- Organization: `XinYi`
- City or Locality: `Shanghai`

## 参考

 - [Code Push@Quentin github](https://github.com/quentinyang/sharing/blob/master/App/codepush.md)
 - [Device Info@Github](https://github.com/rebeccahughes/react-native-device-info)

