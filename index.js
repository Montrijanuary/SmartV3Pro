import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// ฟังก์ชันสำหรับหาไฟล์ในโฟลเดอร์ app
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);