import { View, Text } from 'react-native';
import React from 'react';

interface InputFormErrorsProps {
    message: string
}

export default function InputFormErrors({message}: InputFormErrorsProps) {
    return (
        <View className='mt-1'>
            <Text className='text-red-500'>{message}</Text>
        </View>
    );
}