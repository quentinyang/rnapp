//
//  Alipay.h
//  fy360
//
//  Created by Skyline Chu on 16/5/6.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"
#import <UIKit/UIKit.h>
#import "RCTViewManager.h"

@interface Alipay : NSObject <RCTBridgeModule>

+(Alipay *)alipay;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation;


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options;
@end
