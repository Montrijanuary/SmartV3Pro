import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Image, Alert, SafeAreaView, StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { StorageAccessFramework } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";

export default function NewProject() {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [detail, setDetail] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const AMARIN_PERMISSION_KEY = "AMARIN_FOLDER_PERMISSION";

  useEffect(() => { resetForm(); }, []);

  const resetForm = () => {
    const today = new Date();
    const thaiYear = today.getFullYear() + 543;
    setTitle(""); setAuthor(""); setDetail(""); setImages([]); setSelectedImage(null);
    setDate(`${today.getDate()}-${today.getMonth() + 1}-${thaiYear}`);
  };

  const getAmarinPermission = async () => {
    let permission = await AsyncStorage.getItem(AMARIN_PERMISSION_KEY);
    if (!permission) {
      const result = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!result.granted) {
        Alert.alert("ต้องอนุญาตโฟลเดอร์ Amarin ก่อนใช้งาน");
        return null;
      }
      permission = result.directoryUri;
      await AsyncStorage.setItem(AMARIN_PERMISSION_KEY, permission);
    }
    return permission;
  };

  const goToMain = () => navigation.navigate("main" as never);

  const makeBold = () => {
    if (selection.start === selection.end) return Alert.alert("แจ้งเตือน", "กรุณาไฮไลท์ข้อความก่อน");
    const before = detail.substring(0, selection.start);
    const selected = detail.substring(selection.start, selection.end);
    const after = detail.substring(selection.end);
    setDetail(`${before}<b>${selected}</b>${after}`);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("ต้องอนุญาตเข้าถึงรูปก่อน");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) setImages(prev => [...prev, result.assets[0].uri]);
  };

  const removeImage = () => {
    if (!selectedImage) return Alert.alert("เลือกรูปก่อนลบ");
    setImages(prev => prev.filter(img => img !== selectedImage));
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("กรุณากรอกชื่อโครงการก่อน");

    try {
      const permissionUri = await getAmarinPermission();
      if (!permissionUri) return;

      const safeName = `${title}_${date}`.replace(/[\/\\?%*:|"<>]/g, "-");

      const headAsset = Asset.fromModule(require("../../assets/images/head.png"));
      await headAsset.downloadAsync();
      const headBase64 = await FileSystem.readAsStringAsync(headAsset.localUri!, { encoding: FileSystem.EncodingType.Base64 });

      const imageBlocks = await Promise.all(
        images.map(async (uri) => {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          return `<img src="data:image/jpeg;base64,${base64}" style="width:100%; margin-top:10px;" />`;
        })
      );

      const cleanDetail = detail.replace(/\n+/g, " "); // ✅ ไม่มีการเว้นบรรทัด

      const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 0; }
          .page1 { min-height: 100vh; display: flex; flex-direction: column; }
          .header { height: 30vh; text-align: center; }
          .header img { max-height: 100%; max-width: 100%; object-fit: contain; }
          .divider { border-bottom: 2px solid #000; margin: 5px 0; }
          .content { flex: 1; padding: 10px; font-size: 14px; line-height: 1.4; }
          h2, p { margin: 0; }
        </style>
      </head>
      <body>

        <div class="page1">
          <div class="header">
            <img src="data:image/png;base64,${headBase64}" />
          </div>
          <div class="divider"></div>
          <div class="content">
            <h2>${title}</h2>
            <p><b>วันที่:</b> ${date}</p>
            <p><b>ผู้จัดทำ:</b> ${author}</p>
            <p>${cleanDetail}</p>
          </div>
        </div>

        ${imageBlocks.join("")}

      </body>
      </html>`;

      const { uri: pdfTemp } = await Print.printToFileAsync({ html: htmlContent });
      const pdfBase64 = await FileSystem.readAsStringAsync(pdfTemp, { encoding: FileSystem.EncodingType.Base64 });

      const pdfUri = await StorageAccessFramework.createFileAsync(permissionUri, safeName + ".pdf", "application/pdf");
      await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });

      const jsonData = { title, date, author, detail, images };
      const jsonBase64 = Buffer.from(JSON.stringify(jsonData), "utf8").toString("base64");

      const jsonUri = await StorageAccessFramework.createFileAsync(permissionUri, safeName + ".json", "application/json");
      await FileSystem.writeAsStringAsync(jsonUri, jsonBase64, { encoding: FileSystem.EncodingType.Base64 });

      Alert.alert("บันทึกงานเรียบร้อยแล้ว");
    } catch (e) {
      console.log("SAVE ERROR:", e);
      Alert.alert("เกิดข้อผิดพลาดตอนบันทึกไฟล์");
    }
  };

  const handleEdit = async () => {
    try {
      resetForm();
      const permissionUri = await getAmarinPermission();
      if (!permissionUri) return;

      const result = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true });
      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(uri);
      const data = JSON.parse(content);

      setTitle(data.title || "");
      setDate(data.date || "");
      setAuthor(data.author || "");
      setDetail(data.detail || "");
      setImages(data.images || []);

      Alert.alert("โหลดไฟล์สำเร็จ");
    } catch (e) {
      console.log(e);
      Alert.alert("เปิดไฟล์ไม่สำเร็จ");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={{ height: 20 }} />
        <View style={{ height: 20 }} />

        <View style={styles.row}>
          <View style={styles.titleBox}>
            <Text style={styles.label}>ชื่อโครงการ:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.label}>วัน/เดือน/ปี:</Text>
            <TextInput style={[styles.input, styles.centerText, styles.blackText]} value={date} editable={false} />
          </View>
        </View>

        <Text style={styles.label}>ระบุชื่อผู้สร้างงาน:</Text>
        <TextInput style={styles.input} value={author} onChangeText={setAuthor} />

        <Text style={styles.label}>รายละเอียด:</Text>
        <TextInput
          style={styles.detailInput}
          multiline
          value={detail}
          onChangeText={setDetail}
          onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        />

        <Text style={styles.label}>รูปภาพ:</Text>
        <View style={styles.imageOuterBox}>
          <ScrollView horizontal contentContainerStyle={styles.imageContainer}>
            {images.map((uri) => (
              <TouchableOpacity key={uri} onPress={() => setSelectedImage(uri)}>
                <Image source={{ uri }} style={[styles.image, selectedImage === uri && styles.selectedImage]} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
        <View style={{ height: 20 }} />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.purpleBtn} onPress={makeBold}><Text style={styles.btnText}>ตัวหนา</Text></TouchableOpacity>
          <TouchableOpacity style={styles.brownBtn} onPress={pickImage}><Text style={styles.btnText}>เพิ่มรูป</Text></TouchableOpacity>
          <TouchableOpacity style={styles.redBtn} onPress={removeImage}><Text style={styles.btnText}>ลบรูป</Text></TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.orangeBtn} onPress={goToMain}><Text style={styles.btnText}>Main</Text></TouchableOpacity>
          <TouchableOpacity style={styles.greenBtn} onPress={handleSave}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={styles.darkRedBtn} onPress={handleEdit}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 15 },
  row: { flexDirection: "row", gap: 10 },
  titleBox: { flex: 0.6 },
  dateBox: { flex: 0.4 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 10, color: "#000" },
  blackText: { color: "#000" },
  centerText: { textAlign: "center" },
  detailInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, fontSize: 13, height: 110, textAlignVertical: "top", marginBottom: 10, color: "#000" },
  imageOuterBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, height: 200, marginBottom: 10, overflow: "hidden" },
  imageContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  image: { width: 160, height: 120, borderRadius: 8, marginRight: 10 },
  selectedImage: { borderWidth: 3, borderColor: "red" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  purpleBtn: { backgroundColor: "#7e57c2", padding: 12, borderRadius: 12, flex: 1, marginRight: 5 },
  brownBtn: { backgroundColor: "#8d6e63", padding: 12, borderRadius: 12, flex: 1, marginHorizontal: 5 },
  redBtn: { backgroundColor: "#e53935", padding: 12, borderRadius: 12, flex: 1, marginLeft: 5 },
  orangeBtn: { backgroundColor: "#f9a825", padding: 12, borderRadius: 12, flex: 1, marginRight: 5 },
  greenBtn: { backgroundColor: "#43a047", padding: 12, borderRadius: 12, flex: 1, marginHorizontal: 5 },
  darkRedBtn: { backgroundColor: "#b71c1c", padding: 12, borderRadius: 12, flex: 1, marginLeft: 5 },
});
