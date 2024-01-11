import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IS_ANDROID } from '../../utils';
import { useDebounce } from '../../hooks';

interface OrangeTickFooterProps {
    onPreviousHandler: () => void
    onNextHandler: () => void
}

export default function OrangeTickFooter({ onPreviousHandler, onNextHandler }: OrangeTickFooterProps) {
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const { t } = useTranslation();

    return (
        <View className={`flex-row justify-between ${IS_ANDROID && 'pb-4'}`}>
            <TouchableOpacity 
                className='w-[160] py-2 rounded-lg bg-transparent border border-gray-300'
                onPress={onPreviousHandler}
            >
                <Text className={`self-center ${colorScheme === 'dark' && 'text-gray-300'}`}>{t('commonActions.previous')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className='w-[160] py-2 rounded-lg bg-amber-500'
                onPress={() => debounce(onNextHandler)}
            >
                <Text className="self-center text-white">{t('commonActions.next')}</Text>
            </TouchableOpacity>
        </View>
    )
}