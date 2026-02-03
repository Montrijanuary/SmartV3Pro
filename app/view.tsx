import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

export default function ViewScreen() {
  const [files, setFiles] = useState<{ name: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // โฟลเดอร์เป้าหมายตามโจทย์ Amarin2
  const folderPath = `${FileSystem.documentDirectory}Amarin2/`;

  const loadFiles = async () => {
    try {
      setLoading(true);
      const folderInfo = await FileSystem.getInfoAsync(folderPath);
      
      if (folderInfo.exists && folderInfo.isDirectory) {
        const fileNames = await FileSystem.readDirectoryAsync(folderPath);
        // กรองเอาเฉพาะไฟล์ .pdf [cite: 2025-12-19]
        const pdfFiles = fileNames
          .filter(name => name.toLowerCase().endsWith('.pdf'))
          .map(name => ({
            name,
            uri: folderPath + name
          }));
        setFiles(pdfFiles);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอ่านข้อมูลในโฟลเดอร์ Amarin2 ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const openFile = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('แจ้งเตือน', 'เครื่องของพี่ไม่รองรับการเปิดไฟล์นี้ครับ');
      }
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดไฟล์ได้');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ไฟล์ในโฟลเดอร์ Amarin2</Text>
        <Pressable onPress={loadFiles} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={24} color="#28a745" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 50 }} />
      ) : files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>ยังไม่มีไฟล์ PDF ในโฟลเดอร์นี้ครับพี่</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <Pressable style={styles.fileItem} onPress={() => openFile(item.uri)}>
              <Ionicons name="document-text" size={30} color="#ff4444" />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.fileDate}>แตะเพื่อเปิดหรือแชร์ไฟล์</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  refreshBtn: { padding: 5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#999' },
  fileItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    elevation: 2
  },
  fileName: { fontSize: 16, fontWeight: '600', color: '#333' },
  fileDate: { fontSize: 12, color: '#888', marginTop: 2 }
});