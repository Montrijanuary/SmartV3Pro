package com.smartv3.victory;
import android.os.Bundle; // เพิ่มบรรทัดนี้
import expo.modules.splashscreen.SplashScreenManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  // เพิ่มส่วนนี้เพื่อให้ Expo Prebuild หาค่าเจอครับ
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-9de1acb179e7badd745510fd00d9f3e42afcc9f5
    SplashScreenManager.registerOnActivity(this);
    // @generated end expo-splashscreen
    super.onCreate(null);
  }

  @Override
  protected String getMainComponentName() {
    return "SmartV3";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        false);
  }
}