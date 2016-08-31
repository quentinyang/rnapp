/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>

#import "AppDelegate.h"

#import <tingyunApp/NBSAppAgent.h>

int main(int argc, char * argv[]) {
  @autoreleasepool {
    [NBSAppAgent startWithAppID:@"c89692155d5c4737948e4f8ca7ee0227"];
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
