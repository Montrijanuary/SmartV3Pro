import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

// เรียกไฟล์จากโฟลเดอร์ components ที่อยู่ข้างนอก app
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Modal</ThemedText>
      <ThemedText>This is a modal screen.</ThemedText>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});