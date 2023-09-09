import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: "****",
    authDomain: "****",
    projectId: "****",
    storageBucket: "****",
    messagingSenderId: "****",
    appId: "****"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = (payload) => {
  return new Promise((resolve, reject) => {
    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification User Permission Granted.");
        return getToken(messaging, {
          vapidKey: `BBrvnIbVfQHc0-lPgBZvY0C6DqiHZVG-aw2spRtmKTcaM1pnpv33cCSYPKiXzKvvx6YDd--hEuduDh47tTjRsmQ`,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log('Client Token: ', currentToken);
              resolve(currentToken); // Resolve with the token
            } else {
              console.log('Failed to generate the app registration token.');
              reject(new Error('Failed to generate token'));
            }
          })
          .catch((err) => {
            console.log('An error occurred when requesting to receive the token.', err);
            reject(err);
          });
      } else {
        console.log("User Permission Denied.");
        reject(new Error('User Permission Denied'));
      }
    });
  });
};


requestPermission();

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

export const sendPushNotification = async (registrationToken, notification) => {
  const message = {
    token: registrationToken,
    notification: {
      title: notification.title,
      body: notification.body,
    },
  };

  try {
    const response = await messaging.sendPushNotification(message); // 수정된 부분
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};