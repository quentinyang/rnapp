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

+(void)sendEvent:(NSString *)eventName withRoot:(RCTRootView *)rootView
{
  Utils *utils = [rootView.bridge moduleForClass:[Utils class]];
  
  [utils.bridge.eventDispatcher sendAppEventWithName:eventName body:nil];
}

@end