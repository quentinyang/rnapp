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

## 正式打包Todo List：
1. 修改个推、codepush、友盟等key: `node switch.js [release] [-c channel]`。
    - 默认是`Debug`模式，无需设置
    - 切换到Release的Key，执行`node switch.js release`。`-c`参数是指定渠道。如：`node switch.js release -c QQ`。

1. 检查版本号

    [IOS] `./fy360-native/ios/fy360/Info.plist`需要检查`CFBundleShortVersionString`值，下一个版本要自动加1：

    ```
           <key>CFBundlePackageType</key>
           <string>APPL</string>
           <key>CFBundleShortVersionString</key>
    -      <string>1.0.1</string>
    +       <string>1.0.2</string>
           <key>CFBundleVersion</key>
    -      <string>1.0.1.2</string>
    +     <string>1.0.2.0</string>
    ```
    [Android] `android/app/build.gradle`，更新`versionCode` &  `versionName`值

    ```
    android{
     defaultConfig {
       versionCode 19// 如果versionname保持不变，那么versioncode需要加1
       versionName "1.0.2"
     }  
    }
    ```

1. 开发时部署到真机前，生成本地JsBundle文件

 ```
 ./bundle-generator.sh
 ```

1. 关闭`Yellow Box`
  ```
  console.disableYellowBox = true; 
  ``` 


## Codepush
有需要时，使用codepush提交更新：

 ```
 ./codepush-generator.sh
 ```

推送到codepush云服务

   - Debug: `code-push release FangYuan360 ./release 1.0.0`
   - Release: `code-push release FangYuan360-Release ./release 1.0.0`

常用命令: 

   - 查看历史: `code-push deployment history FangYuan360 Staging` 
   - 查看Key : `code-push deployment ls FangYuan360 -k` 
 
参考：[Code Push@Quentin github](https://github.com/quentinyang/sharing/blob/master/App/codepush.md)

## Android签名备忘

- Password&Key Password: `FY360@2016#RN`
- Alias: `Android-Signature`
- First and Last Name: `XinYi`
- Organization: `XinYi`
- City or Locality: `Shanghai`

## Device Info
- 参考：[Device Info@Github](https://github.com/rebeccahughes/react-native-device-info)

## 参考
 - [Code Push@Quentin github](https://github.com/quentinyang/sharing/blob/master/App/codepush.md)
 - [Device Info@Github](https://github.com/rebeccahughes/react-native-device-info)
 

