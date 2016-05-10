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

@implementation Alipay
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)order)
{
  NSString *appScheme = @"fy360";
  
  [[AlipaySDK defaultService] payOrder:order fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    NSString *status = [resultDic objectForKey:@"resultStatus"];

    [self.bridge.eventDispatcher sendAppEventWithName:@"EventReminder"
                                                 body:@{@"status": status}];
  }];
  
  
}
@end
