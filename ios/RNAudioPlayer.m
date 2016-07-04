//
//  RNAudioPlayer.m
//  fy360
//
//  Created by 周晓建 on 16/7/4.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNAudioPlayer.h"

@implementation RNAudioPlayer

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(play:(NSString *)fileName)
{
  AVAudioSession *session = [AVAudioSession sharedInstance];
  [session setCategory: AVAudioSessionCategoryPlayback error: nil];
  [session setActive: YES error: nil];
  
  //    NSURL *soundURL1 = [[NSBundle mainBundle] URLForResource:[[fileName lastPathComponent] stringByDeletingPathExtension]
  //                                             withExtension:[fileName pathExtension]];
  //
  //    NSURL *soundURL = [NSURL URLWithString:fileName];
  //
  //    NSLog(@"xxxx %s", soundURL);
  //    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:soundURL1 error:nil];
  
  self.audioPlayer = [[AVPlayer alloc]initWithURL:[NSURL URLWithString:fileName]];
  
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
  if (self.audioPlayer) {
    [self.audioPlayer stop];
  }
}

@end

