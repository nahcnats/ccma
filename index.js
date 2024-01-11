/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import notifee from '@notifee/react-native';
import { setCustomText} from 'react-native-global-props'
import {name as appName} from './app.json';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async (event) => {
    console.log("Local Message handled in the background!", event);
});

// setCustomText({
//     style: {
//         fontFamily: 'TrapRegular'
//     }
// })

AppRegistry.registerComponent(appName, () => App);
