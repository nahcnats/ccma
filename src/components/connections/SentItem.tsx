import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { CreativeConnectionGenericType } from '../../types/network';
import Avatar from '../common/Avatar';
import { useDebounce, useAppSelector } from '../../hooks';
import { useCancelConnection } from '../../screens/connections/hooks';
import { showErrorToast } from '../../utils';
import themeColor from '../../constants/theme';

function SentItem({ data }: { data: CreativeConnectionGenericType }) {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const { mutateAsync: cancelRequest } = useCancelConnection();

    const payload = {
        token: token,
        params: {
            userId: data.connectionId
        }
    }

    const cancelRequestHandler = async () => {
        try {
            setIsLoading(true);
            await cancelRequest(payload);
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }
    
    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('ConnectionsProfile', { userId: data.connectionUserId })} 
            className='flex-row items-start space-x-3 p-4 rounded-lg bg-white dark:bg-colors-new_2'
        >
            <Avatar image={null} size={50} />
            <View className='flex-1'>
                <View>
                    <Text className='flex-1 font-bold dark:text-white' numberOfLines={1} ellipsizeMode='tail'>{data.connectionUserName}</Text>
                    <Text className='text-gray-600 dark:text-gray-300'>{data.connectionUserUsername}</Text>
                    <Text className='flex-1 flex-wrap text-gray-600 mt-1 dark:text-gray-400'>{data.connectionPosition}</Text>
                </View>
                <TouchableOpacity 
                    className='p-2 rounded-md mt-4 z-10 bg-colors-new_1'
                    onPress={() => debounce(cancelRequestHandler)}
                >
                    <Text className='text-white font-semibold self-center'>{t('networkScreen.actions.cancelRequest')}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default SentItem;