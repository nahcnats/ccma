import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

export async function requestNotificationPermission() {
    const result = await messaging().requestPermission();
    const enabled = result === messaging.AuthorizationStatus.AUTHORIZED
        || result === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
}

export async function getInitialRemoteNotification() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initialRemoteNotification = await messaging().getInitialNotification();

    if (!initialRemoteNotification) return;

    const { data } = initialRemoteNotification;

    if (data) {
        //  TODO open notification
    }
}

export async function getInitialLocalNotification() {
    // eslint-disable-next-line react-hooks/rules-of-hooks

    const initialRemoteNotification = await notifee.getInitialNotification();
    // if (!initialRemoteNotification) return;
    //
    // const { data } = initialRemoteNotification;
    //
    // report("Initial Notification Data", data, initialRemoteNotification);
    // if (data) {
    //   //  TODO open notification
    // }
}

export async function getInitialNotification() {
    const local = getInitialLocalNotification();
    const remote = getInitialRemoteNotification();
}

export const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    
    return fcmToken;
}

export const NotificationListener = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    messaging().onMessage(async remoteMessage => {
        console.log('notification on foreground state...', remoteMessage);
    });
}