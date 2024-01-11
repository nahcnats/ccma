//
//  RNConfig.m
//  CultCreative
//
//  Created by Stanley Chan on 21/01/2023.
//

#import "RNConfig.h"

@implementation RNConfig

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport{
  
#if INTERNAL
  return @{ @"env": @"Internal" };
#elif STAGING
  return @{ @"env": @"Staging" };
#elif EXTERNAL
  return @{ @"env": @"External" };
#endif
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}
@end
