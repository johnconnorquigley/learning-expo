import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, ScrollView } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.flipContainer}>
          <Text style={styles.flipTitle}>Just Do It!</Text>
          <Text style={styles.basicText}>Get Motivated!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Push Yourself!"
            onPress={async () => {
              await sendPushNotification(expoPushToken);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}


// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Congratulations!!',
    body: 'You have pushed yourself to new limits!'
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  coinImageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 150,
    height: 124,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  flipContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  flipTitle: {
    fontSize: 25,
    color: '#000',
    marginVertical: 8,
    paddingTop: 10,
    paddingHorizontal: 10,
    lineHeight: 24,
    textAlign: 'center',
  },
  basicText: {
    fontSize: 15,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 18,
    textAlign: 'center',
  },
  flipResultText: {
    fontSize: 35,
    color: '#FF0000',
    textAlign: 'center',
    fontWeight: "700"
  },
  buttonContainer: {
    backgroundColor: "#1a1aff",
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 5,
  }
});
