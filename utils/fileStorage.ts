import * as FileSystem from "expo-file-system";
import * as SAF from "expo-file-system/StorageAccessFramework";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FOLDER_KEY = "AMARIN_FOLDER_URI";

export async function getOrCreateAmarinFolder() {
  let folderUri = await AsyncStorage.getItem(FOLDER_KEY);
  if (folderUri) return folderUri;

  const permissions = await SAF.requestDirectoryPermissionsAsync();
  if (!permissions.granted) throw new Error("ไม่ได้รับสิทธิ์เข้าถึงโฟลเดอร์");

  folderUri = permissions.directoryUri;
  await AsyncStorage.setItem(FOLDER_KEY, folderUri);
  return folderUri;
}

export async function createFileInAmarin(
  fileName: string,
  mimeType: string,
  content: string | Uint8Array
) {
  const folderUri = await getOrCreateAmarinFolder();

  const fileUri = await SAF.createFileAsync(folderUri, fileName, mimeType);

  await FileSystem.writeAsStringAsync(fileUri, content as string, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}
