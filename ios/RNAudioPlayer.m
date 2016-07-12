//
//  RNAudioPlayer.m
//  fy360
//
//  Created by 周晓建 on 16/7/4.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNAudioPlayer.h"
#import "RCTEventDispatcher.h"
#import "AppDelegate.h"

@interface RNAudioPlayer ()

@property (strong, nonatomic) AVPlayer *audioPlayer;

@property (strong, nonatomic) AVPlayerItem *songItem;

@property (strong, nonatomic) id timeObserve;

@property (assign, nonatomic) float progress;

@property (strong, nonatomic) NSString *playTime;

@property (strong, nonatomic) NSString * playDuration;

@end


@implementation RNAudioPlayer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(play:(NSString *)fileName)
{
  AVAudioSession *session = [AVAudioSession sharedInstance];
  [session setCategory: AVAudioSessionCategoryPlayback error: nil];
  [session setActive: YES error: nil];
  
  if (self.audioPlayer == nil) {
    self.audioPlayer = [[AVPlayer alloc]initWithURL:[NSURL URLWithString:fileName]];
    self.songItem = self.audioPlayer.currentItem;
    
    __weak typeof(self) weakSelf = self;
    self.timeObserve = [self.audioPlayer addPeriodicTimeObserverForInterval:CMTimeMake(1.0, 1.0) queue:dispatch_get_main_queue() usingBlock:^(CMTime time) {
      float current = CMTimeGetSeconds(time);
      float total = CMTimeGetSeconds(weakSelf.songItem.duration);
      if (current) {
        weakSelf.progress = current / total;
        weakSelf.playTime = [NSString stringWithFormat:@"%.f",current];
        weakSelf.playDuration = [NSString stringWithFormat:@"%.2f",total];
        
        NSLog(@"weakSelf.current%f", current);
        NSLog(@"weakSelf.current%f", total);
        
        if (current >= total) {
          [weakSelf.bridge.eventDispatcher sendAppEventWithName:@"mediaCompletioned"
                                                       body:@""];
          [weakSelf stopPlayer];
        }
      }
    }];
  }
  
  [self.audioPlayer play];
}

RCT_EXPORT_METHOD(pause)
{
  if (self.audioPlayer) {
    [self.audioPlayer pause];
  }
}

RCT_EXPORT_METHOD(stop)
{
  [self stopPlayer];
}

+(RNAudioPlayer *)rNAudioPlayer{
  AppDelegate *appdelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
  RCTRootView *rootview = appdelegate.rootView;
  RCTBridge *bridge = rootview.bridge;
  RNAudioPlayer *rNAudioPlayer = [bridge moduleForName:@"RNAudioPlayer"];
  return rNAudioPlayer;
}

- (void)stopPlayer
{
  if (self.audioPlayer) {
    if (self.timeObserve) {
      [self.audioPlayer removeTimeObserver:_timeObserve];
      self.timeObserve = nil;
    }
    
    self.audioPlayer = nil;
  }
  
  if (self.timeObserve) {
    self.timeObserve = nil;
  }
}

- (void)dealloc
{
  if (_timeObserve) {
    [_audioPlayer removeTimeObserver:_timeObserve];
    _timeObserve = nil;
  }
}

@end

