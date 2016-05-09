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

- (void)xxx:(NSString *)orderString
{
  NSString *appScheme = @"fy360";
  
  [[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    NSLog(@"reslut = %@",resultDic);
  }];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  NSLog(@"Pretending to create an event %@ at %@", name, location);
  NSString *orderStr = @"partner=\"2088911968230519\"&seller_id=\"13636533425\"&out_trade_no=\"0819145412-6177\"&subject=\"测试\"&body=\"测试测试\"&total_fee=\"0.01\"&notify_url=\"http://notify.msp.hk/notify.htm\"&service=\"mobile.securitypay.pay\"&payment_type=\"1\"&_input_charset=\"utf-8\"&it_b_pay=\"30m\"&sign=\"lBBK%2F0w5LOajrMrji7DUgEqNjIhQbidR13GovA5r3TgIbNqv231yC1NksLdw%2Ba3JnfHXoXuet6XNNHtn7VE%2BeCoRO1O%2BR1KugLrQEZMtG5jmJIe2pbjm%2F3kb%2FuGkpG%2BwYQYI51%2BhA3YBbvZHVQBYveBqK%2Bh8mUyb7GM1HxWs9k4%3D\"&sign_type=\"RSA\"";

  NSString *appScheme = @"fy360";
  
  [[AlipaySDK defaultService] payOrder:orderStr fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    NSString *status = [resultDic objectForKey:@"resultStatus"];

    [self.bridge.eventDispatcher sendAppEventWithName:@"EventReminder"
                                                 body:@{@"status": status}];
    if([status intValue] != 9000) {
      NSLog(@"123456");
    }
    NSLog(@"reslut = %@",resultDic);
  }];
}

RCT_EXPORT_METHOD(findEvents:(RCTResponseSenderBlock)callback)
{
  NSArray *events = @[@1,@2,@3];
  callback(@[[NSNull null], events]);

}
@end
