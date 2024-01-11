import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity,
    StatusBar, 
    StyleSheet, 
    Dimensions 
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthNavigationParams } from "../../navigators/AuthNavigation";
import * as onBoardingActions from '../../store/actions/onboarding';
import { IS_ANDROID, googleSignIn, facebookSignIn, appleSignIn } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { showErrorToast } from '../../utils';
import { SUPPORT_APPLE_LOGIN } from '../../constants/apple';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default function LandingScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const [videoStatus, toggleVideoStatus] = useState<boolean>(false);
    const [videoEnded, setVideoEnded] = useState(false);

    useFocusEffect(useCallback(() => {
        setVideoEnded(false);
        toggleVideoStatus(false);
    }, []));

    const signUpwithProvider = async (provider: string) => {
        try {
            switch (provider) {
                case 'GOOGLE': {
                    const userInfo = await googleSignIn();

                    if (!userInfo.token) {
                        throw new Error('Unable to sign in to Google');
                    }

                    const action = onBoardingActions.providerUserInfo({
                        email: `${userInfo?.user.email}`,
                        name: userInfo?.user.givenName + ' ' + userInfo?.user.familyName,
                        provider: provider,
                        token: userInfo.token || '',
                    });

                    await dispatch(action);
                    break;
                }
                case 'FACEBOOK': {
                    const userInfo = await facebookSignIn();

                    if (!userInfo.token) {
                        throw new Error('Unable to sign in to Facebook');
                    }

                    const action = onBoardingActions.providerUserInfo({
                        email: `${userInfo.email}`,
                        name: userInfo.name,
                        provider: provider,
                        token: `${userInfo.token}` || '',
                    });

                    await dispatch(action);
                    break;
                }
                case 'APPLE': {
                    const userInfo = await appleSignIn(true);

                    if (!userInfo?.token) {
                        throw new Error('Unable to sign in to Apple');
                    }

                    const action = onBoardingActions.providerUserInfo({
                        email: `${userInfo.email}`,
                        name: `${userInfo.name}`,
                        provider: provider,
                        token: `${userInfo.token}` || '',
                    });
                    
                    await dispatch(action);
                    break;
                }
                default: 
                    return;
            }

            navigation.navigate('Onboarding');
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <View className='flex-1 bg-black'>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            {
                !videoEnded 
                    ? <Video
                        source={require('../../assets/videos/landing.mp4')}
                        style={styles.backgroundVideo}
                        muted
                        // repeat
                        onLoadStart={() => toggleVideoStatus(true)}
                        onLoad={() => toggleVideoStatus(false)}
                        onEnd={() => {
                            setVideoEnded(true)
                            toggleVideoStatus(true)
                        }}
                        paused={videoStatus}
                        resizeMode='cover'
                        playWhenInactive
                        rate={1.0}
                        ignoreSilentSwitch='obey'
                    />
                    : <View className='flex-1 justify-center items-center'>
                        <Image 
                            source={require('../../assets/images/Logo.png')}
                            style={{
                                width: 220,
                            }}
                            resizeMode='contain'
                        />
                    </View>
            }
            
            <View className='absolute bottom-0 mb-20 w-full'>
                <View>
                    <Text className='text-white self-center'>{t('landing.createYourAccountWith')}</Text>
                    <View className='flex-row justify-center space-x-6 mt-6'>
                        {
                            SUPPORT_APPLE_LOGIN &&
                            <TouchableOpacity
                                onPress={() => signUpwithProvider('APPLE')}
                            >
                                <Image
                                    source={require('../../assets/social-icon/apple.png')}
                                    style={styles.buttonSize}
                                />
                            </TouchableOpacity>        
                        }
                        {/* <TouchableOpacity
                            onPress={() => signUpwithProvider('FACEBOOK')}
                        >
                            <Image
                                source={require('../../assets/social-icon/facebook.png')}
                                style={styles.buttonSize}
                            />        
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={()=> signUpwithProvider('GOOGLE')}
                        >
                            <Image
                                source={require('../../assets/social-icon/google.png')}
                                style={styles.buttonSize}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Onboarding')}
                        >
                            <Image
                                source={require('../../assets/social-icon/email.png')}
                                style={styles.buttonSize}
                            />
                        </TouchableOpacity>
                    </View>
                    <View className='mt-8'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text className='text-white text-base font-bold self-center'>{t('landing.alreadyHaveAnAccount')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundVideo: {
        height: WINDOW_HEIGHT + 30,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0,
    },
    buttonSize: {
        width: 48,
        height: 48,
    },
})