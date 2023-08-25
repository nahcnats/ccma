import { View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

export default function Loading() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();

    return (
        <View className="flex-1 justify-center mx-auto">
            <ActivityIndicator size='large' color={colors.amber[500]} />
            <View className='my-2'>
                <Text className={`${colorScheme === 'dark' && 'text-white'}`}>{t('loading')}</Text>
            </View>
        </View>
    );
}