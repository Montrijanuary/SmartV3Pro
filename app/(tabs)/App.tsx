import React from 'react';
import { StyleSheet, View, Text, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const router = useRouter();

  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const handlePress = () => {
    console.log("START button pressed! Navigating to /main...");
    router.push('/main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* แก้ไขเป็น 1smartv3.png ตามที่พี่สั่ง */}
        <Image 
          style={styles.logo}
          source={require('../../assets/images/1smartv3.png')} 
        />
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1.0 }
          ]} 
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>START</Text>
        </Pressable>
        
        <Text style={styles.statusText}>SmartV3 - Victory for the Community</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: height * 0.1 },
  logo: { width: width * 0.65, height: width * 0.65, resizeMode: 'contain', marginBottom: 70 },
  button: { width: width * 0.7, height: 60, backgroundColor: '#007bff', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statusText: { marginTop: 20, color: '#666', fontSize: 12 }
});