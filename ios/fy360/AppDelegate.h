/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import "RCTRootView.h"

// [Start] 集成个推SDK
#import "GeTuiSdk.h"     // GetuiSdk头文件，需要使用的地方需要添加此代码

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

/// 需要使用个推回调时，需要添加"GeTuiSdkDelegate"
//@interface AppDelegate : UIResponder <UIApplicationDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, GeTuiSdkDelegate> {
  @private
    UINavigationController *_naviController;
}
@property (assign, nonatomic) int lastPayloadIndex;

- (void)startSdkWith:(NSString *)appID appKey:(NSString *)appKey appSecret:(NSString *)appSecret;

// [End] 集成个推SDK

//@interface AppDelegate : UIResponder <UIApplicationDelegate>
@property (nonatomic, strong) RCTRootView *rootView;

@property (nonatomic, strong) UIWindow *window;

@end
