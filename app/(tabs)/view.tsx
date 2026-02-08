import { StyleSheet, Text, View, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

export default function ViewScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets(); 

  useFocusEffect(
    useCallback(() => {
      let localSound: Audio.Sound;

      const playSongs = async () => {
        const songs = [
          require('../../assets/audio/songb.mp3'),
          require('../../assets/audio/songc.mp3'),
        ];
        const randomSong = songs[Math.floor(Math.random() * songs.length)];

        const { sound } = await Audio.Sound.createAsync(
          randomSong,
          { shouldPlay: true, isLooping: true }
        );
        localSound = sound;
        setSound(sound);
      };

      playSongs();
      return () => { localSound && localSound.unloadAsync(); };
    }, [])
  );

  const handleMutePress = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    await sound.setIsMutedAsync(!status.isMuted);
  };

  const handleMainPress = async () => {
    if (sound) await sound.unloadAsync();
    setPdfUri(null);
    router.replace('/main'); 
  };

  const handleBrowsePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPdfUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("ผิดพลาด", "ไม่สามารถเปิดไฟล์ PDF ได้");
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.viewerContainer}>
          {!pdfUri ? (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>กรุณาเลือกไฟล์ PDF เพื่อดู</Text>
            </View>
          ) : (
            <Pdf
              source={{ uri: pdfUri }}
              style={styles.pdf}
              trustAllCerts={false}
            />
          )}
        </View>
      </View>

      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom || 10 }]}>
        <Pressable style={[styles.mainButton, styles.muteButton]} onPress={handleMutePress}>
          <Text style={styles.buttonText}>Mute</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.browseButton]} onPress={handleBrowsePress}>
          <Text style={styles.buttonText}>Browse</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.mainNavButton]} onPress={handleMainPress}>
          <Text style={styles.buttonText}>Main</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#fff' },
  mainContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  viewerContainer: {
    flex: 1,
    width: '100%',
    borderWidth: 2,
    borderColor: '#555',
    padding: 10,
  },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { textAlign: 'center', fontSize: 16, color: '#888' },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  mainButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center', width: '30%' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  muteButton: { backgroundColor: '#FF8C00' },
  browseButton: { backgroundColor: '#8B4513' },
  mainNavButton: { backgroundColor: '#007bff' },
  pdf: { flex: 1, width: '100%' },
});

