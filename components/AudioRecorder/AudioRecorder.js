import React from 'react';
import { View, Text } from 'react-native';
// แก้ไข: ปรับ Path ให้ถูกต้องตามโครงสร้างจริง (ถอยออก 2 ชั้นเพื่อไปที่ app/utils)
import { uploadAudioToServer } from '../../utils/audioProcessor';

const AudioRecorder = () => {
  return (
    <View>
      <Text>Audio Recorder Ready</Text>
    </View>
  );
};

export default AudioRecorder;