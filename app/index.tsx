import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* โลโก้หน้าแรกตามโจทย์ 1smartv3.png ขนาด 300x300 */}
        <Image 
          source={require('../assets/images/1smartv3.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>ยินดีต้อนรับสู่ SmartV3Plus</Text>
        <Text style={styles.subtitle}>หมู่บ้านอัมรินทร์นิเวศน์ 2</Text>

        <View style={styles.buttonContainer}>
          {/* ปุ่มเริ่มทำงาน สีเขียว ตามโจทย์ */}
          <Pressable 
            style={styles.startButton} 
            onPress={() => router.push('/main')}
          >
            <Text style={styles.buttonText}>เริ่มทำงาน</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Victory Version 2025</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 300, height: 300, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 18, color: '#666', marginTop: 10 },
  buttonContainer: { marginTop: 50, width: '100%', alignItems: 'center' },
  startButton: { 
    backgroundColor: '#28a745', 
    paddingVertical: 15, 
    paddingHorizontal: 60, 
    borderRadius: 30,
    elevation: 5 // เพิ่มเงาให้ดูสวยงาม
  },
  buttonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12 }
});