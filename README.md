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

code-push 
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

