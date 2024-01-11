import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from 'tailwindcss/colors';

import { IconBack } from '../../../assets/icons';

export default function SecondaryLeft() {
    const navigation = useNavigation();

    return (
        <View className='ml-2'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconBack size={24} color={colors.black} />
            </TouchableOpacity>
        </View>
    );
}