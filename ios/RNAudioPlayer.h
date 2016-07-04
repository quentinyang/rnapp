//
//  RNAudioPlayer.h
//  fy360
//
//  Created by 周晓建 on 16/7/4.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"
#import <AVFoundation/AVFoundation.h>

@interface RNAudioPlayer : NSObject <RCTBridgeModule>

@property (strong, nonatomic) AVAudioPlayer *audioPlayer;

@end
