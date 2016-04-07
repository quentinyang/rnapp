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
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./index.ios.jsbundle \
--assets-dest ./ \
--dev false

# Android
react-native bundle --platform android --entry-file index.android.js \
--bundle-output ./android/app/src/main/assets/index.android.jsbundle \
--assets-dest ./android/app/src/main/res/
--dev false

react-native run-android
```

1. _[`平时不用`]_使用codepush提交更新时

```
# IOS
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./release/index.ios.jsbundle \
--assets-dest ./release \
--dev false

# Android
react-native bundle --platform android --entry-file index.android.js  \
--bundle-output ./release/index.android.jsbundle \
--assets-dest ./release \
--dev false

# 推送到云
code-push release FangYuan360 ./release 1.0.0 (Debug)
code-push release FangYuan360-Release ./release 1.0.0 (Release)

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
 <string>Oj0a7yqg1CpDnMfpKp-7O3aZZ_US4yoltiYTl</string>
 ```
 
 备注：
 
 线下开发环境：`Oj0a7yqg1CpDnMfpKp-7O3aZZ_US4yoltiYTl`
 
 线上生产环境：`_GhPy-CMXi1mTX0CetRfMU82NLvZ4yoltiYTl`
 
 1. 修改`./fy360-native/android/app/src/main/java/com/fy360/MainActivity.java`文件，找到如下代码修改Key值：
 
 ```
 new CodePush("Oj0a7yqg1CpDnMfpKp-7O3aZZ_US4yoltiYTl", this, BuildConfig.DEBUG);
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

## 内部打包上传说明

1. 内部包管理在[https://d.corp.angejia.com/](https://d.corp.angejia.com/)，主机地址192.168.169.14。

 上传服务器位置：`/srv/app/ios_package/fangyuan360/`，内设`dev`,`alpha`,`master`三种环境。

 如下示例上传到`dev`环境：

```
scp ~/Desktop/fy360\ 2016-03-25\ 15-20-00/fy360.ipa angejia@192.168.169.14:/srv/app/ios_package/fangyuan360/dev/fy360.ipa
fy360.ipa                              
```

## 参考

 - [Code Push@Quentin github](https://github.com/quentinyang/sharing/blob/master/App/codepush.md)
 - [Device Info@Github](https://github.com/rebeccahughes/react-native-device-info)

