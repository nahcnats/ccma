import { View, Text, useColorScheme } from 'react-native';
import React from 'react';

interface EmptyProps {
    label: string
}

export default function Empty({label} : EmptyProps) {
    const colorScheme = useColorScheme();
    return (
        <View className='flex-1 justify-center mx-auto mt-6'>
            <Text className={`${colorScheme === 'dark' && 'text-white'}`}>{label}</Text>
        </View>
    )
}