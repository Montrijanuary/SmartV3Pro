import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
// เรียก ThemedView จากโฟลเดอร์เดียวกัน
import { ThemedView } from './ThemedView';

export default function ParallaxScrollView({ children }: PropsWithChildren) {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});