import React, { useEffect, useState } from "react";
import { BackHandler, Alert, View, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native";
import { WebView, WebViewNavigation  } from 'react-native-webview';
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import {Platform, DevSettings} from 'react-native';
import { fcmService } from './src/notificationService/FCMService'
import { localNotificationService } from './src/notificationService/LocalNotificationService'
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import CookieManager from '@react-native-cookies/cookies';

const App = () => {

  const [newURL, setNewURL] = useState('')
  const [callURL, setCallURL] = useState('')
  const [fcmToken, setFcmToken] = useState('')
  
  useEffect(() => {
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      // console.log("[App] onRegister: ", token)
    }

    function onNotification(notify) {
      console.log("[App] onNotification: ", notify)
      if(Platform.OS === 'android'){
        const options = {
          channelId: notify.android.channelId,
          largeIcon: 'null', // add icon large for Android (Link: app/src/main/mipmap)
          smallIcon: 'logo', // add icon small for Android (Link: app/src/main/mipmap)
          importance: Importance.HIGH,
          vibrate: true,
        }
        localNotificationService.showNotification(
          0,
          notify.title,
          notify.body,
          notify,
          options
        )
      }else{
        const options = {
          soundName: notify.sound,
          playSound: true ,
          largeIcon: 'null', // add icon large for Android (Link: app/src/main/mipmap)
          smallIcon: 'logo', // add icon small for Android (Link: app/src/main/mipmap),
          importance: Importance.HIGH,
        }
        localNotificationService.showNotification(
          0,
          notify.title,
          notify.body,
          notify,
          options
        )
      }
    }

    function onOpenNotification(notify) {
      console.log("[App] onOpenNotification : ", notify)
      // if(notify){
      //   AsyncStorageLib.setItem("url", 'https://www.youtube.com/')
      // }
    }

    return () => {
      // console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unregister()
    }

  }, [])

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    const url = navigationState.url;
  
    // parseURLParams is a pseudo function.
    // Make sure to write your own function or install a package
    AsyncStorageLib.setItem("url", url)

    CookieManager.get(url)
    .then((cookies) => {
      console.log('CookieManager.get =>', cookies);
    });
  };

  AsyncStorageLib.getItem("url")
  .then((value) => {
    setCallURL(value);
  })

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
      { fcmToken != '' ?
      <WebView 
        styles={{ flex: 1 }}
        source={{ 
          uri: newURL != null ? newURL : 'https://appchat.anbinhcredit.com/?' + fcmToken
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
      /> : <ActivityIndicator/>}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})