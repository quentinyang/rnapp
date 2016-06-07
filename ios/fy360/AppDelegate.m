/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CoreTelephony/CTCallCenter.h>
#import <CoreTelephony/CTCall.h>

#import "CodePush.h"

#import "MobClick.h"

#import "GeTui.h"

#import "Alipay.h"
#import <AlipaySDK/AlipaySDK.h>

#import "Utils.h"

NSString *const NotificationCategoryIdent = @"ACTIONABLE";
//NSString *const NotificationActionOneIdent = @"ACTION_ONE";
//NSString *const NotificationActionTwoIdent = @"ACTION_TWO";

#ifdef DEBUG
NSString * const UMengAppKey = @"56fe11a6e0f55ac112001746";
NSString * const UMengChannelId = @"Web";
#else
NSString * const UMengAppKey = @"56fe11cce0f55a61740009e4";
NSString * const UMengChannelId = @"";
#endif

@interface AppDelegate ()

@property (nonatomic, strong) Alipay *alipay;
@property (nonatomic, strong) CTCallCenter *center;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  // [UMeng] Start
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  [MobClick setAppVersion:version];
  [MobClick startWithAppkey:UMengAppKey reportPolicy:BATCH channelId:UMengChannelId];
  // [UMeng] End
  
  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */

//  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];

  /**
   * OPTION 2
   * Load from pre-bundled file on disk. The static bundle is automatically
   * generated by "Bundle React Native code and images" build step.
   */

//   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index.ios" withExtension:@"jsbundle"];
  
  /**
   * OPTION 3 - Code Push
   *
   * E.g.:
   *  jsCodeLocation = [CodePush bundleURL];//default main.jsbundle
   *  or
   *  jsCodeLocation = [CodePush bundleURLForResource:@"index.ios" withExtension:@"jsbundle"];
   *
   */
//   jsCodeLocation = [CodePush bundleURLForResource:@"index.ios" withExtension:@"jsbundle"];

  #ifdef DEBUG
    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  #else
    jsCodeLocation = [CodePush bundleURLForResource:@"index.ios" withExtension:@"jsbundle"];
  #endif
  
  NSURL *url = (NSURL *)[launchOptions valueForKey:UIApplicationLaunchOptionsURLKey];
  NSString * urlStr;
  NSDictionary *props;
  
  if(url) {
    urlStr = [url absoluteString];
    NSArray *array = [urlStr componentsSeparatedByString:@"?"];
    props  = @{@"page" : array[1]};
  } else {
    props  = @{@"page" : @""};
  }

  self.rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"fy360"
                                               initialProperties:props
                                                   launchOptions:launchOptions];


  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = self.rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [[Alipay alipay] application:application didFinishLaunchingWithOptions:launchOptions];

  // [1]:使用APPID/APPKEY/APPSECRENT创建个推实例
  // 该方法需要在主线程中调用
  [self startSdkWith:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret];
  
  // [2]:注册APNS
  [self registerRemoteNotification];
  
  // [2-EXT]: 获取启动时收到的APN数据
  NSDictionary *userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if (userInfo) {
    NSString *record = [NSString stringWithFormat:@"[APN]%@, %@", [NSDate date], userInfo];
    NSLog(@"\n>>>[GeTuiSdk DeviceToken Success]:%@\n\n", record);
  } 
  
  // Call State
  [self listenCallEvent:self.rootView];
  
  return YES;
}

#pragma mark - 用户通知(推送) _自定义方法

/** 注册APNS,注:获取DeviceToken不同项目或版本会有所不同，可以参考如下方式注册APNs。 */
/** 注册远程通知 */
- (void)registerRemoteNotification {
#ifdef __IPHONE_8_0
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    //IOS8 新的通知机制category注册
    UIMutableUserNotificationCategory *actionCategory;
    actionCategory = [[UIMutableUserNotificationCategory alloc] init];
    [actionCategory setIdentifier:NotificationCategoryIdent];
    [actionCategory setActions:nil
                    forContext:UIUserNotificationActionContextDefault];
    
    NSSet *categories = [NSSet setWithObject:actionCategory];
    UIUserNotificationType types = (UIUserNotificationTypeAlert |
                                    UIUserNotificationTypeSound |
                                    UIUserNotificationTypeBadge);
    
    UIUserNotificationSettings *settings;
    settings = [UIUserNotificationSettings settingsForTypes:types categories:categories];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    
  } else {
    UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert |
                                                                   UIRemoteNotificationTypeSound |
                                                                   UIRemoteNotificationTypeBadge);
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
  }
#else
  UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert |
                                                                 UIRemoteNotificationTypeSound |
                                                                 UIRemoteNotificationTypeBadge);
  [[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
#endif
}

#pragma mark - 远程通知(推送)回调

/** 远程通知注册成功委托 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
  token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSLog(@"\n>>>[GeTuiSdk DeviceToken Success]:%@\n\n", token);
  
  // [3]:向个推服务器注册deviceToken
  [GeTuiSdk registerDeviceToken:token];
}

/** 远程通知注册失败委托 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
//  [UIViewController logMsg:[NSString stringWithFormat:@"didFailToRegisterForRemoteNotificationsWithError:%@", [error localizedDescription]]];
  NSLog(@"\n>>>[GeTuiSdk DeviceToken Error]:%s\n\n", "APNS注册失败");
}

#pragma mark - background fetch  唤醒
- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  
  //[5] Background Fetch 恢复SDK 运行
  [GeTuiSdk resume];
  
  completionHandler(UIBackgroundFetchResultNewData);
}

#pragma mark - APP运行中接收到通知(推送)处理

/** APP已经接收到“远程”通知(推送) - (App运行在后台/App运行在前台)  */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
  
  // [4-EXT]:处理APN
  NSString *record = [NSString stringWithFormat:@"[APN]%@, %@", [NSDate date], userInfo];
  NSLog(@"\n>>>[GeTuiSdk DidAPN]:%@\n\n", record);
  GeTui *geTui = [GeTui sharedInstance];
  [geTui handleRemoteNotificationReceived:@"setGeTuiOpenAction" andPayloadMsg:@"" withRoot:self.rootView];
  completionHandler(UIBackgroundFetchResultNewData);
}

/******************* Demo ***********************/

#pragma mark - 启动GeTuiSdk

- (void)startSdkWith:(NSString *)appID appKey:(NSString *)appKey appSecret:(NSString *)appSecret {
  //[1-1]:通过 AppId、 appKey 、appSecret 启动SDK
  //该方法需要在主线程中调用
  [GeTuiSdk startSdkWithAppId:appID
                       appKey:appKey appSecret:appSecret delegate:self];
  
  //[1-2]:设置是否后台运行开关
  [GeTuiSdk runBackgroundEnable:YES];
  //[1-3]:设置电子围栏功能，开启LBS定位服务 和 是否允许SDK 弹出用户定位请求
  [GeTuiSdk lbsLocationEnable:YES andUserVerify:YES];
}

#pragma mark - GeTuiSdkDelegate

/** SDK启动成功返回cid */
- (void)GeTuiSdkDidRegisterClient:(NSString *)clientId {
  //个推SDK已注册，返回clientId
  NSLog(@"\n>>>[GeTuiSdk RegisterClient]:%@\n\n", clientId);
  [GeTui setClientId:clientId];
  NSString *eventName = @"clientIdReceived";
  GeTui *geTui = [GeTui sharedInstance];
  
  [geTui handleRemoteNotificationReceived:eventName andPayloadMsg:clientId withRoot:self.rootView];
}


/** SDK收到透传消息回调 */
- (void)GeTuiSdkDidReceivePayloadData:(NSData *)payloadData andTaskId:(NSString *)taskId andMsgId:(NSString *)msgId andOffLine:(BOOL)offLine fromGtAppId:(NSString *)appId {
  // [4]: 收到个推消息
  NSString *payloadMsg = nil;
  NSString *eventName = @"geTuiDataReceived";
  if (payloadData) {
    payloadMsg = [[NSString alloc] initWithBytes:payloadData.bytes
                                          length:payloadData.length
                                        encoding:NSUTF8StringEncoding];
    GeTui *geTui = [GeTui sharedInstance];
    [geTui handleRemoteNotificationReceived:eventName andPayloadMsg:payloadMsg withRoot:self.rootView];
  }
  
  NSString *record = [NSString stringWithFormat:@"%d, %@, %@%@", ++_lastPayloadIndex, [self formateTime:[NSDate date]], payloadMsg, offLine ? @"<离线消息>" : @""];
  NSLog(@"\n>>>[GexinSdk ReceivePayload Record]:%@\n\n", record);
  
  NSString *msg = [NSString stringWithFormat:@"%@ : %@%@", [self formateTime:[NSDate date]], payloadMsg, offLine ? @"<离线消息>" : @""];
  NSLog(@"\n>>>[GexinSdk ReceivePayload Message]:%@, taskId: %@, msgId :%@", msg, taskId, msgId);

  // 汇报个推自定义事件
  [GeTuiSdk sendFeedbackMessage:90001 taskId:taskId msgId:msgId];
}

/** SDK收到sendMessage消息回调 */
- (void)GeTuiSdkDidSendMessage:(NSString *)messageId result:(int)result {
  // [4-EXT]:发送上行消息结果反馈
  NSString *record = [NSString stringWithFormat:@"Received sendmessage:%@ result:%d", messageId, result];
  NSLog(@"\n>>>[GexinSdk Callback Success]:%@\n\n", record);
}

/** SDK遇到错误回调 */
- (void)GeTuiSdkDidOccurError:(NSError *)error {
  //个推错误报告，集成步骤发生的任何错误都在这里通知，如果集成后，无法正常收到消息，查看这里的通知。
  NSLog(@"\n>>>[GexinSdk Callback Error]:%@\n\n", [error localizedDescription]);
}

- (NSString *)formateTime:(NSDate *)date {
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateFormat:@"HH:mm:ss"];
  NSString *dateTime = [formatter stringFromDate:date];
  return dateTime;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation{
  if(!url) {
    return NO;
  }
  
  NSString *urlString = [url absoluteString];
  NSString *hostString = [url host];
  NSString *queryString = [url query];
  
  NSLog(@"urlString in sourceApplication: %@", urlString);
  NSLog(@"hostString in sourceApplication: %@", hostString);
  NSLog(@"queryString in sourceApplication: %@", queryString);
  [Utils sendEvent:@"goPage" withRoot:self.rootView];
  [[Alipay alipay] application:application openURL:url sourceApplication:sourceApplication annotation:sourceApplication];
  
  
  return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options{
  if(!url) {
    return NO;
  }
  NSString *urlString = [url absoluteString];
  NSString *queryString = [url query];
  
  NSLog(@"urlString in options: %@", urlString);
  NSLog(@"queryString in options: %@", queryString);
  
  [Utils sendEvent:@"goPage" withRoot:self.rootView];
  [[Alipay alipay] application:app openURL:url options:options];
  return YES;
}

// 监听系统电话状态变化
- (void)listenCallEvent:(RCTRootView *) rootView
{
  _center = [[CTCallCenter alloc] init];
  [_center setCallEventHandler:^(CTCall *call) {
    if ([call.callState isEqualToString:CTCallStateConnected])
    {
      NSLog(@"Call has been connected!");
    }
    else if ([call.callState isEqualToString:CTCallStateDisconnected])
    {
      NSLog(@"Call has been disconnected!");
      [Utils sendEvent:@"callIdle" withRoot:rootView];
    }
    else if ([call.callState isEqualToString:CTCallStateIncoming])
    {
      NSLog(@"Call is incoming!");
    }
    else if ([call.callState isEqualToString:CTCallStateDialing])
    {
      NSLog(@"Call is dialing!");
    }
    else
    {
      NSLog(@"None State!");
    }
  }];
}
@end
