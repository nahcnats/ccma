import { View, Text } from 'react-native';
import React from 'react';

export default function ScreenTitle({title}: {title: string}) {
    return (
        <View>
            <Text className='font-semibold text-xl dark:text-white'>{title}</Text>
        </View>
    );
}