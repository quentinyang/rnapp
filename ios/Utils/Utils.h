//
//  Utils.h
//  fy360
//
//  Created by Angejia Frontend Team on 16/5/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#ifndef Utils_h
#define Utils_h


#endif /* Utils_h */

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "RCTRootView.h"

@interface Utils : NSObject <RCTBridgeModule>

+(void)sendEvent:(NSString *)eventName withRoot:(RCTRootView *)rootView;
+(void)sendEventWithParam:(NSString *)eventName withParam:(NSDictionary *)param withRoot:(RCTRootView *)rootView;

@end
