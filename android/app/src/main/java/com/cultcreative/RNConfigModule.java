
package com.cultcreative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;


import java.util.Map;
import java.util.HashMap;

public class RNConfigModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  RNConfigModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName(){
  	return "RNConfig";
  }

  @Override
	public Map<String, Object> getConstants() {
		final Map<String, Object> constants = new HashMap<>();
		constants.put("env", BuildConfig.FLAVOR);
		return constants;
	}
}
