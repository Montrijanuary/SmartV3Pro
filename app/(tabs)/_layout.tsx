import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,   // ❌ ปิดหัวด้านบนทุกหน้า
        tabBarShowLabel: false // (ถ้าไม่อยากให้มีชื่อใต้ไอคอนด้วย)
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="main" />
      <Tabs.Screen name="new_project" />
      <Tabs.Screen name="view" />
    </Tabs>
  );
}
