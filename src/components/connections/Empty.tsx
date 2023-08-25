import React from 'react';
import { View, Text } from 'react-native';
import colors from 'tailwindcss/colors';

import { IconTelescope } from '../../assets/icons';

function Empty({ label }: { label:string }) {
    return (
        <View className='flex-1 justify-center mx-auto'>
            <View className='flex-1 justify-center items-center'>
                <IconTelescope size={60} color={colors.gray[400]} />
                <View className='my-4' />
                <Text className='self-center text-gray-700'>{label}</Text>
            </View>
        </View>
    );
}

export default Empty;