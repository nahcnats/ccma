import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from 'tailwindcss/colors';

import { IconClose } from '../../../assets/icons';

export default function DismissLeft() {
    const navigation = useNavigation();

    return (
        <View className='ml-2'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconClose size={24} color={colors.black} />
            </TouchableOpacity>
        </View>
    );
}