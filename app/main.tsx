import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function MainScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    async function playSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/songa.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        setSound(sound);
      } catch (error) {
        console.log("ยังไม่มีไฟล์เพลง songa.mp3");
      }
    }
    playSound();
    return () => { if (sound) { sound.unloadAsync(); } };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* แก้ไขเป็น hometv.png ตามที่พี่สั่ง */}
      <Image 
        source={require('../assets/images/hometv.png')} 
        style={styles.logo} 
      />
      
      <Text style={styles.title}>เมนูหลัก SmartV3Plus</Text>
      <Text style={styles.subtitle}>หมู่บ้านอัมรินทร์นิเวศน์ 2</Text>

      <View style={styles.buttonGrid}>
        <Pressable style={[styles.btn, {backgroundColor: '#1E90FF'}]} onPress={() => router.push('/view')}>
          <Text style={styles.btnText}>VIEW (ดูไฟล์)</Text>
        </Pressable>

        <Pressable style={[styles.btn, {backgroundColor: '#32CD32'}]} onPress={() => router.push('/(tabs)/new_project')}>
          <Text style={styles.btnText}>NEW PROJECT</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.info}>ผู้พัฒนา: นายมนตรี วชิรัคคเมธี</Text>
        <Text style={styles.info}>รหัสบันทึก: 04092569</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 220, height: 220, marginTop: 20, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 18, color: '#666' },
  buttonGrid: { flexDirection: 'row', marginTop: 30, gap: 10 },
  btn: { padding: 15, borderRadius: 10, width: 150, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30 },
  info: { color: '#888' }
});