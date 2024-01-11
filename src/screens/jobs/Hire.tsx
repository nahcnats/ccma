import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from 'tailwindcss/colors';
import { RefreshControl } from 'react-native-gesture-handler';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import { IconRight } from '../../assets/icons';
import { JobsTabNavigation } from './navigation';
import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useTokensCount } from './hooks';
import { showErrorToast } from '../../utils';
import themeColor from '../../constants/theme';

function HireScreen() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const iconColor = colorScheme === 'dark' ? colors.gray[300] : colors.black;
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [goldTokens, setGoldTokens] = useState(0);
    const [diamondTokens, setDiamondTokens] = useState(0);
    const payload = {
        token: token
    }
    const { data, isLoading, isSuccess, isError, error: rqError, refetch } = useTokensCount(payload);
    useRefreshOnFocus(refetch);

    useEffect(() => {
        const newGoldTokens = data?.find(item => item.tokenId === 1)?.totalTokens || 0;
        const newDiamondTokens = data?.find(item => item.tokenId === 2)?.totalTokens || 0;

        setGoldTokens(newGoldTokens);
        setDiamondTokens(newDiamondTokens);
    }, [isSuccess]);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <Screen>
            <TouchableOpacity 
                className='flex-row justify-between p-4 rounded-md bg-colors-new_1' 
                onPress={() => navigation.navigate('AddVacancy')}
            >
                <Text className='text-white font-semibold'>{t('jobScreen.actions.addYourVacancy')}</Text>
                <IconRight size={18} color={colors.white} />
            </TouchableOpacity>
            <View className='my-2' />
            <View>
                <View className='flex-row justify-between p-4'>
                    <View>
                        <Text className='font-bold text-black dark:text-white'>{t('jobScreen.basicToken')}</Text>
                        <View className='flex-row items-center space-x-2 mt-3'>
                            <Image source={require('../../assets/images/Basic_Token_Illustration-big.png')} resizeMode='contain' className='rounded-full w-[50] h-[50]' />
                            <Text className='text-black font-[500] dark:text-white'>{t('jobScreen.tokenCount', { tokenNum: goldTokens })}</Text>
                        </View>
                    </View>
                    <View>
                        <Text className='font-bold text-black dark:text-white'>{t('jobScreen.premiumToken')}</Text>
                        <View className='flex-row items-center space-x-2 mt-3'>
                            <Image source={require('../../assets/images/Premium_Token_Illustration-big.png')} resizeMode='contain' className='rounded-full w-[50] h-[50]' />
                            <Text className='text-black font-[500] dark:text-white'>{t('jobScreen.tokenCount', { tokenNum: diamondTokens })}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className={`my-3 rounded-lg p-2 bg-colors-new_1 dark:bg-gray-300 ${isError && 'bg-gray-300'}`}
                    onPress={() => navigation.navigate('TopUpTokenSelection')}
                >
                    <Text className={`self-center text-white text-base dark:text-black ${isError && 'text-gray-200'}`}>{t('jobScreen.addMoreToken')}</Text>
                </TouchableOpacity>
                <View className='h-[0.6px] mx-4 my-2 bg-gray-300 dark:bg-gray-500' />
                <TouchableOpacity 
                    onPress={() => navigation.navigate('TransactionHistory')}
                    className='flex-row justify-between p-4'
                >
                    <Text className='dark:text-white'>{t('jobScreen.transactionHistory')}</Text>
                    <IconRight size={18} color={iconColor} />
                </TouchableOpacity>
            </View>
            <View className='mt-4 flex-1'>
                <JobsTabNavigation />
            </View>
        </Screen>
    );
}

export default HireScreen;