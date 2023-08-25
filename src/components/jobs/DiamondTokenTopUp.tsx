import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import { TopUpTokenProps } from '../../screens/jobs/TopUpTokenSelection';


const DiamondTokenTopUp = ({ tokenToBuy, totalPrice, onDecreaseToken, onIncreaseToken } : TopUpTokenProps) => {
    const { t } = useTranslation();

    return (
        <View>
            <FastImage
                source={require('../../assets/images/Premium_Token_Illustration-big.png')}
                style={{ alignSelf: 'center', height: 160, width: 160 }}
                resizeMode={FastImage.resizeMode.contain}
            />
            <View className='my-4'>
                <Text className='self-center dark:text-white'>One token represents one job posting & search feature.</Text>
            </View>
            <View className='flex-row justify-between items-center mt-4'>
                <TouchableOpacity
                    disabled={tokenToBuy <= 0}
                    className={`w-[120] py-1 border-[0.9px] ${tokenToBuy >= 1 ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    onPress={onDecreaseToken}
                >
                    <Text className={`self-center text-2xl ${tokenToBuy > 0 ? 'text-black dark:text-white' : 'text-gray-300'}`}>-</Text>
                </TouchableOpacity>
                <View>
                    <Text className='text-xl font-semibold dark:text-white'>{tokenToBuy}</Text>
                </View>
                <TouchableOpacity
                    className='w-[120] py-1 border-[0.9px] border-green-500 rounded-lg'
                    onPress={onIncreaseToken}
                >
                    <Text className='self-center text-2xl dark:text-white'>+</Text>
                </TouchableOpacity>
            </View>
            <View className='mt-8 border-[0.8px] rounded-md p-2 dark:border-gray-600'>
                <Text className='dark:text-white'>{t('jobScreen.topUpTotal')}</Text>
                <Text className='self-center mt-1 text-lg font-semibold dark:text-white'>RM {totalPrice}</Text>
            </View>
        </View>
    );
}

export default DiamondTokenTopUp;