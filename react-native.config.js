module.exports = {
  project: {
    android: {
      sourceDir: './android',
      packageName: 'com.smartv3', // บังคับชื่อให้ตรงกับใน AndroidManifest
    },
  },
  dependencies: {
    'react-native-worklets': {
      platforms: {
        android: null,
      },
    },
    'expo': {
      platforms: {
        android: null,
      },
    },
    'expo-modules-core': {
      platforms: {
        android: null,
      },
    },
    'expo-keep-awake': {
      platforms: {
        android: null,
      },
    },
  },
};