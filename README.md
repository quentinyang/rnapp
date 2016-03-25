## 生态圈App

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
```

1. _`[平时不用]`使用codepush提交更新时_
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
```

## 正式打包Todo List：

1. 修改`./fy360-native/ios/fy360/Info.plist`文件，找到如下代码修改Key值：
```
<key>CodePushDeploymentKey</key>
<string>Oj0a7yqg1CpDnMfpKp-7O3aZZ_US4yoltiYTl</string>
```
1. 修改`./fy360-native/android/app/src/main/java/com/fy360/MainActivity.java`文件，找到如下代码修改Key值：
```
new CodePush("Oj0a7yqg1CpDnMfpKp-7O3aZZ_US4yoltiYTl", this, BuildConfig.DEBUG);
```
## 参考

 - [Code Push@Quentin github](https://github.com/quentinyang/sharing/blob/master/App/codepush.md)

