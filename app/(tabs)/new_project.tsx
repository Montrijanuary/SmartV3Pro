import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert, ScrollView, TextInput, Text } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function NewProjectScreen() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  
  // ล็อควันที่ตามโจทย์ 04092569
  const lockedDate = "04092569"; 
  const developerName = "นายมนตรี วชิรัคคเมธี";

  const saveAndSharePDF = async () => {
    try {
      if (!projectName) {
        Alert.alert('คำเตือน', 'กรุณาใส่ชื่อโครงการก่อนครับ');
        return;
      }

      const htmlContent = `
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1 style="text-align: center; color: green;">โครงการ: ${projectName}</h1>
            <p><b>วันที่:</b> ${lockedDate}</p>
            <p><b>โดย:</b> ${developerName}</p>
            <hr/>
            <p>${description || 'ไม่มีรายละเอียด'}</p>
          </body>
        </html>
      `;

      // สร้าง PDF ด้วยระบบ Expo
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // จัดการโฟลเดอร์ Amarin2
      const folderPath = `${FileSystem.documentDirectory}Amarin2/`;
      const fileName = `${projectName}.pdf`;
      const newPath = `${folderPath}${fileName}`;

      const folderInfo = await FileSystem.getInfoAsync(folderPath);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      }

      await FileSystem.moveAsync({ from: uri, to: newPath });

      Alert.alert('สำเร็จ', 'บันทึกไฟล์เข้า Amarin2 เรียบร้อย');
      await Sharing.shareAsync(newPath);

    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถสร้าง PDF ได้');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>ชื่อโครงการ:</Text>
      <TextInput style={styles.input} value={projectName} onChangeText={setProjectName} />
      
      <Text style={styles.label}>รายละเอียด:</Text>
      <TextInput style={[styles.input, {height: 100}]} value={description} onChangeText={setDescription} multiline />

      <View style={styles.infoBox}>
        <Text>วันที่: {lockedDate}</Text>
        <Text>ผู้พัฒนา: {developerName}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="SAVE PDF" color="#28a745" onPress={saveAndSharePDF} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 5 },
  infoBox: { marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 5 }
});