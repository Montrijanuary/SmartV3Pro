import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* รูป Welcome */}
        <Image
          source={require('../../assets/images/1smartv3.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* ปุ่ม Start */}
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push('/main')}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: '100%',
    height: 380,
    marginBottom: 60,
  },

  startButton: {
    backgroundColor: '#2e9e4f',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 16,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
