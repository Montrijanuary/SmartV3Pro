import React, { useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

// ปิดไว้ชั่วคราวเพื่อไม่ให้ Babel ตรวจสอบไฟล์ที่พังครับ
// import { WebView } from 'react-native-webview'; 

const { width, height } = Dimensions.get('window');

export default function ViewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>ระบบกำลังจัดเตรียมหน้าแสดงผล...</Text>
        <Text style={styles.subText}>[WebView ถูกปิดชั่วคราวเพื่อการ Build APK]</Text>
        
        {/* ส่วนของ WebView ด้านล่างนี้ถูกปิดไว้เพื่อไม่ให้เกิด SyntaxError ครับ */}
        {/* <WebView 
          source={{ uri: 'https://google.com' }} 
          style={{ flex: 1 }} 
        /> 
        */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  }
});