import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions, Alert, Platform, Image, Modal, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

export default function ViewScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]); 

  const scale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets(); 
  const soundRef = useRef<Audio.Sound | null>(null);
  const songIndexRef = useRef(0);

  const onPinchGestureEvent = Animated.event([{
    nativeEvent: { scale: scale }
  }], {
    useNativeDriver: true
  });

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const songs = [
        require('../../assets/audio/songb.mp3'),
        require('../../assets/audio/songc.mp3'),
      ];

      // ✅ สุ่มว่าจะเริ่มเพลงไหนก่อนทุกครั้งที่เข้าหน้า View
      songIndexRef.current = Math.random() < 0.5 ? 0 : 1;

      const playLoop = async () => {
        if (!isActive) return;

        try {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
          }

          const { sound: newSound } = await Audio.Sound.createAsync(
            songs[songIndexRef.current],
            { shouldPlay: true }
          );

          soundRef.current = newSound;
          setSound(newSound);

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded || !isActive) return;
            if (status.didJustFinish) {
              // ✅ สลับเพลงไปอีกตัวเสมอ (B→C หรือ C→B)
              songIndexRef.current = songIndexRef.current === 0 ? 1 : 0;
              playLoop();
            }
          });
        } catch (e) {
          console.error('Audio error:', e);
        }
      };

      playLoop();

      return () => {
        isActive = false;
        if (soundRef.current) {
          soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      };
    }, [])
  );

  const handleMainPress = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    router.replace('/main');
  };

  const handleMutePress = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setSound(null);
    }
  };

  const handleBrowsePress = async () => {
    try {
      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('ต้องอนุญาตโฟลเดอร์ก่อน');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFileUri(uri);
        setFileType('pdf');
        setImages([]);
      }
    } catch (e) {
      console.error('Failed to browse and load document:', e);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดไฟล์ได้');
    }
  };
  
  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderContent = () => {
    if (!fileUri) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            กรุณาเลือกไฟล์ PDF เพื่อดู
          </Text>
        </View>
      );
    }

    if (fileType === 'pdf') {
      if (Platform.OS === 'web') {
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              PDF ดูได้เฉพาะตอนติดตั้งเป็นแอปในมือถือเท่านั้น
            </Text>
          </View>
        );
      }
      
      return (
        <WebView
          source={{ uri: fileUri }}
          style={styles.pdf}
          originWhitelist={['*']}
          allowFileAccess={true}
          scalesPageToFit={true}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.viewerContainer}>
          {renderContent()}
        </View>
      </View>
      
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom || 10 }]}> 
        <Pressable style={[styles.mainButton, styles.muteButton]} onPress={handleMutePress}>
          <Text style={styles.buttonText}>Mute</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.browseButton]} onPress={handleBrowsePress}>
          <Text style={styles.buttonText}>Browse</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.backButton]} onPress={handleMainPress}>
          <Text style={styles.buttonText}>Main</Text>
        </Pressable>
      </View>

      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => handleModalClose()}
        >
          <View style={styles.centeredView}>
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <Animated.Image
                source={{ uri: selectedImage?.uri }}
                style={[styles.fullScreenImage, { transform: [{ scale: scale }] }]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => handleModalClose()}
            >
              <Text style={styles.modalCloseButtonText}>X</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#fff' },
  mainContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, alignItems: 'center', justifyContent: 'flex-start' },
  viewerContainer: { flex: 1, width: '100%', borderWidth: 2, borderColor: '#808080', padding: 10, marginBottom: 0, overflow: 'hidden' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { textAlign: 'center', fontSize: 16, color: '#888' },
  bottomButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#fff', marginBottom: 30 },
  mainButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center', width: '30%' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  muteButton: { backgroundColor: '#FF8C00' },
  browseButton: { backgroundColor: '#8B4513' },
  backButton: { backgroundColor: '#007bff' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
  fullScreenImage: { width: '100%', height: '100%' },
  modalCloseButton: { position: 'absolute', top: 40, right: 20, padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 20 },
  modalCloseButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  pdf: { flex: 1, width: '100%', height: '100%' },
});
