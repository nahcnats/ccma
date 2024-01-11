import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Image, useColorScheme, Pressable } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthNavigationParams } from "../../navigators/AuthNavigation";
import { useAppDispatch } from '../../hooks';
import Screen from '../../components/common/Screen';
import { IconLeft, IconRight } from '../../assets/icons';
import { IS_ANDROID } from '../../utils';
import * as onBoardingActions from '../../store/actions/onboarding';
import { showErrorToast } from '../../utils';

const OnboardingScreen = () => {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();

    const registerCreativeHandler = async () => {
        try {
            const action = onBoardingActions.userRole('CREATIVE');

            await dispatch(action);
            navigation.navigate('RegisterUsername');    
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message); 
        }
    }

    const registerEmployerHandler = async () => {
        try {
            const action = onBoardingActions.userRole('EMPLOYER');

            await dispatch(action);
            navigation.navigate('RegisterUsername');    
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message); 
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <View>
                    <Text className='self-center text-xl font-bold dark:text-white'>{t('onboarding.chooseYourSide')}</Text>
                    <View className='my-2' />
                    <Text 
                        className='self-center text-base dark:text-white'
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        {t('onboarding.sideDesc')}
                    </Text>
                </View>
                <View className='my-2' />
                <View className='flex-row flex-1 space-x-2 justify-between'>
                    <Pressable
                        className='bg-[#100F35] flex-1 rounded-md items-center justify-between p-3'
                        onPress={registerCreativeHandler}
                    >
                        <View>
                            <Image
                                source={require('../../assets/images/creatives.png')}
                                style={{
                                    height: 235,
                                    width: 160
                                }}
                                resizeMode='contain'
                            />
                            <View className='my-4' />
                            <Text className='self-center text-white text-3xl font-bold'>{t('onboarding.creative')}</Text>
                            <View className='my-2' />
                            <Text className='text-white'>{t('onboarding.creativeBody')}</Text>
                        </View>
                        <View>
                            <View className='flex-row space-x-3 items-center justify-end'>
                                <IconLeft size={16} color={colors.white} />
                                <Text className='text-white text-lg'>{t('onboarding.imcreative')}</Text>
                            </View>
                            
                        </View>
                    </Pressable>
                    <Pressable
                        className='bg-[#FFA800] flex-1 rounded-md items-center justify-between p-3'
                        onPress={registerEmployerHandler}
                    >
                        <View>
                            <Image
                                source={require('../../assets/images/employer.png')}
                                style={{
                                    height: 235,
                                    width: 160
                                }}
                                resizeMode='contain'
                            />
                            <View className='my-4' />
                            <Text className='self-center text-white text-3xl font-bold'>{t('onboarding.employer')}</Text>
                            <View className='my-2' />
                            <Text className='text-white'>{t('onboarding.hiringBody')}</Text>
                        </View>
                        <View>
                            <View className='flex-row space-x-3 items-center justify-start'>
                                <Text className='text-white text-lg'>{t('onboarding.imhiring')}</Text>
                                <IconRight size={18} color={colors.white} />
                            </View>
                            
                        </View>
                    </Pressable>
                </View>
            </Screen>
        </SafeAreaView>
    );
}

export default OnboardingScreen;