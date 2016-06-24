//
//  Alipay.m
//  fy360
//
//  Created by Skyline Chu on 16/5/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "Alipay.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <AlipaySDK/AlipaySDK.h>
#import "AppDelegate.h"

@interface Alipay ()
@property (nonatomic, strong) NSString *eventReminder;
@end

@implementation Alipay
@synthesize bridge = _bridge;


RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(addEvent:(NSString *)order role:(NSString *)role)
{
  NSString *appScheme = @"opendiyifangyuan";
  self.eventReminder = [role stringByAppendingString:@"EventReminder"];
  
  [[AlipaySDK defaultService] payOrder:order fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    //NSString *status = [resultDic objectForKey:@"resultStatus"];
    [self.bridge.eventDispatcher sendAppEventWithName:self.eventReminder
                                                 body:@{@"resultDic": resultDic}];
  }];
}


+(Alipay *)alipay{
  AppDelegate *appdelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
  RCTRootView *rootview = appdelegate.rootView;
  RCTBridge *bridge = rootview.bridge;
  Alipay *alipay = [bridge moduleForName:@"Alipay"];
  return alipay;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  if ([url.host isEqualToString:@"safepay"]) {
    //跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
     // NSString *status = [resultDic objectForKey:@"resultStatus"];
      
      [self.bridge.eventDispatcher sendAppEventWithName:self.eventReminder
                                                   body:@{@"resultDic": resultDic}];
    }];
  }
  return YES;
}

// NOTE: 9.0以后使用新API接口
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
  if ([url.host isEqualToString:@"safepay"]) {
    //跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      //NSString *status = [resultDic objectForKey:@"resultStatus"];
      
      [self.bridge.eventDispatcher sendAppEventWithName:self.eventReminder
                                                   body:@{@"resultDic": resultDic}];
    }];
  }
  return YES;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge{
  return nil;
}

@end
