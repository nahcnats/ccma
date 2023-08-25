import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import colors from 'tailwindcss/colors';

import { IconBars } from '../../../assets/icons';
import { BadgeSelector } from '../../../store/reducers/notifications';
import { useAppSelector } from '../../../hooks';

export default function PrimaryRight() {
    const navigation = useNavigation();
    const badge = useAppSelector(BadgeSelector);

    const toggleDrawer = async () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    }

    return (
        <View className='mr-4'>
            <TouchableOpacity 
                onPress={toggleDrawer}
                className='flew-row'
            >
                <IconBars size={24} color={colors.black} />
                { 
                    badge && badge > 0 ?
                        <View className='rounded-full bg-red-500 h-5 w-5 absolute top-0 right-[34] items-center justify-center'>
                            <Text className='self-center text-white text-xs'>{badge || 0}</Text>
                        </View> : null
                }
            </TouchableOpacity>
        </View>
    );
}