//
//  Utils.m
//  fy360
//
//  Created by Angejia Frontend Team on 16/5/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "Utils.h"

@implementation Utils

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport {
  BOOL isDebug = NO;
  
#ifdef DEBUG
  isDebug = YES;
#else
  isDebug = NO;
#endif
  
  return @{
      @"isDebug": @(isDebug),
      @"host": [self getBaseUrl]
  };
}

RCT_EXPORT_METHOD(getApiHost:(RCTResponseSenderBlock) callback) {
  callback(@[[self getBaseUrl]]);
}

RCT_EXPORT_METHOD(getEnv:(RCTResponseSenderBlock) callback) {
  BOOL isDebug = NO;
  
#ifdef DEBUG
  isDebug = YES;
#else
  isDebug = NO;
#endif
  
  callback(@[@(isDebug)]);
}

- (NSDictionary *)getInfoDic {
  return [[NSBundle mainBundle] infoDictionary];
}

- (NSString *)getBaseUrl {
  NSString *version = [self getInfoDic][@"version"];
  
  if([version isEqualToString:@"online"]) {
    return @"https://api.fangyuan360.cn/service/";
    
  } else if([version isEqualToString:@"master"]) {
    return @"http://360.master.dev.angejia.com/service/";

  } else {
    return [NSString stringWithFormat: @"http://360.%@.angejia.com/service/", version];
  }
}

+(void)sendEvent:(NSString *)eventName withRoot:(RCTRootView *)rootView
{
  Utils *utils = [rootView.bridge moduleForClass:[Utils class]];
  
  [utils.bridge.eventDispatcher sendAppEventWithName:eventName body:nil];
}

+(void)sendEventWithParam:(NSString *)eventName withParam:(NSDictionary *)param withRoot:(RCTRootView *)rootView
{
  Utils *utils = [rootView.bridge moduleForClass:[Utils class]];
  
  [utils.bridge.eventDispatcher sendAppEventWithName:eventName body:param];
}

@end