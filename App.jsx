import React from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function App() {
  if (Platform.OS === 'web') {
    const WebApp = require('./src/App.jsx').default;
    return <WebApp />;
  }

  // Native mobile app container for Expo Go / iOS / Android APK
  const targetUrl = 'http://74.208.149.57:9191';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView
        source={{ uri: targetUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
