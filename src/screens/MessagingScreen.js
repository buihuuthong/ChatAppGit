import React, { useEffect, useState } from "react";
import { BackHandler, Alert, View, SafeAreaView, StyleSheet, ActivityIndicator} from "react-native";
import { WebView, WebViewNavigation  } from 'react-native-webview';
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { fcmService } from '../notificationService/FCMService'
import { localNotificationService } from '../notificationService/LocalNotificationService'
import { firebase } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

const MessagingScreen = () => {

  const [newURL, setNewURL] = useState('')
  const [fcmToken, setFcmToken] = useState('')

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    const url = navigationState.url;
  
    // parseURLParams is a pseudo function.
    // Make sure to write your own function or install a package
    AsyncStorageLib.setItem("url", url)

  };

  AsyncStorageLib.getItem("url")
  .then((value) => {
    setNewURL(value);
  })
  
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        setFcmToken(token)
      });
  }, [])

  return(
    <SafeAreaView style={styles.container}>
      {fcmToken != '' ?
        <WebView 
          styles={{ flex: 1 }}
          source={{ uri: 'https://appchat.anbinhcredit.com/user.html' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={onNavigationStateChange}
        /> : <ActivityIndicator size="small"/>}
    </SafeAreaView>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})