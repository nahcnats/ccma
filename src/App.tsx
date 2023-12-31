import 'react-native-gesture-handler';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, StatusBar, useColorScheme } from 'react-native';
import RootNavigation from './navigators/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';
import colors from 'tailwindcss/colors';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as Sentry from "@sentry/react-native";


import { IS_ANDROID } from './utils';
import './translations';
import { store } from './store/store';
import STRIPE_KEY from './constants/stripe';
import * as NotificationsHelpers from './utils/pushnotification_helper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Settings as Facebook } from 'react-native-fbsdk-next';
import { checkToken } from './utils/pushnotification_helper';
import CustomToast, { CustomToastProps } from './components/common/CustomToast';

SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient();

const toastConfig = {
  // success: (props: ToastProps) => (
    // <BaseToast
    //   {...props}
    //   style={{ 
    //     borderLeftColor: colors.green[400], 
        
    //   }}
    //   contentContainerStyle={{
    //     width: '100%',
    //   }}
    //   text1Style={{
    //     fontSize: 17
    //   }}
    //   text2Style={{
    //     fontSize: 15
    //   }}
    //   text2NumberOfLines={2}
    // />
  // ),
  // error: (props: ToastProps) => (
  //   <ErrorToast
  //     {...props}
  //     style={{ 
  //       borderLeftColor: colors.red[500] ,
  //     }}
  //     contentContainerStyle={{
  //       width: '100%'
  //     }}
  //     text1Style={{
  //       fontSize: 17,
  //       fontWeight: 'bold'
  //     }}
  //     text2Style={{
  //       fontSize: 15
  //     }}
  //     text2NumberOfLines={2}
  //   />
  // ),
  // warning: (props: ToastProps) => (
  //   <BaseToast
  //     {...props}
  //     style={{ borderLeftColor: colors.yellow[400] }}
  //     contentContainerStyle={{
  //       width: '100%'
  //     }}
  //     text1Style={{
  //       fontSize: 17,
  //       fontWeight: 'bold'
  //     }}
  //     text2Style={{
  //       fontSize: 15
  //     }}
  //     text2NumberOfLines={2}
  //   />
  // ),
  success: ({ text1, text2, props }: CustomToastProps) => (
    <CustomToast props={{
        config: undefined,
        type: undefined,
        position: undefined,
        visibilityTime: undefined,
        autoHide: undefined,
        topOffset: undefined,
        bottomOffset: undefined,
        keyboardOffset: undefined,
        onShow: undefined,
        onHide: undefined,
        onPress: undefined
      }} 
      type='success'
      text1={text1} 
      text2={text2} 
      {...props} 
    />
  ),
  error: ({ text1, text2, props }: CustomToastProps) => (
    <CustomToast props={{
      config: undefined,
      type: undefined,
      position: undefined,
      visibilityTime: undefined,
      autoHide: undefined,
      topOffset: undefined,
      bottomOffset: undefined,
      keyboardOffset: undefined,
      onShow: undefined,
      onHide: undefined,
      onPress: undefined
    }}
      type='error'
      text1={text1}
      text2={text2}
      {...props}
    />
  ),
  warning: ({ text1, text2, props }: CustomToastProps) => (
    <CustomToast props={{
      config: undefined,
      type: undefined,
      position: undefined,
      visibilityTime: undefined,
      autoHide: undefined,
      topOffset: undefined,
      bottomOffset: undefined,
      keyboardOffset: undefined,
      onShow: undefined,
      onHide: undefined,
      onPress: undefined
    }}
      type='warning'
      text1={text1}
      text2={text2}
      {...props}
    />
  )
}

const App = () => {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    'StretchPro': require('./assets/fonts/StretchPro/StretchPro.otf'),
    'TrapRegular': require('./assets/fonts/TrapFonts/Trap-Regular.ttf'),
    'TrapBold': require('./assets/fonts/TrapFonts/Trap-Bold.ttf'),
  });

  //Sentry.init({
    //dsn: "",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    //tracesSampleRate: 1.0,
  //});

  const init = async () => {
    try {
      Facebook.initializeSDK();
      NotificationsHelpers.requestNotificationPermission();
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    init();
    // onLayoutView();
  }, []);

  // const onLayoutView = useCallback(async () => {
  //   if (isReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [isReady]);

  // if (!isReady) {
  //   return null;
  // }

  if (!fontsLoaded) return null;

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <GestureHandlerRootView className='flex-1'>
              <StripeProvider
                publishableKey={STRIPE_KEY}
              >
                <BottomSheetModalProvider>
                    {
                      IS_ANDROID && <StatusBar translucent backgroundColor={'transparent'} barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
                    }
                    <RootNavigation />
                </BottomSheetModalProvider>
              </StripeProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>   
      {/* @ts-ignore */}
      <Toast config={toastConfig} position='bottom' bottomOffset={90} />
    </>
  );
};

// export default App;
export default Sentry.wrap(App);
