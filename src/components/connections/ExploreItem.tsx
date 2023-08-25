import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Avatar from '../common/Avatar';
import { useDebounce, useAppSelector } from '../../hooks';
import { CreativeExploreType } from '../../types/network';
import { useRequestConnection } from '../../screens/connections/hooks';
import { showErrorToast } from '../../utils';

function ExploreItem({ data }: { data: CreativeExploreType }) {
    const { t } = useTranslation()
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const { mutateAsync } = useRequestConnection();

    const payload = {
        token: token,
        params: {
            userId: data.id
        }
    }

    const requestConnectionHandler = async () => {
        try {
            setIsLoading(true);
            await mutateAsync(payload);
            setIsLoading(false);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'ConnectionsTab', 
                    params: {
                        screen: 'SentRequests'
                    }
                }
            });
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('ConnectionsProfile', {userId: data.id})} 
            className='flex-row items-center space-x-3 p-4 rounded-lg bg-white dark:bg-colors-new_2'
        >
            <Avatar image={data.profileImageUrl} size={50} />
            <View className='flex-1'>
                <View>
                    <Text className='flex-1 font-bold dark:text-white' numberOfLines={1} ellipsizeMode='tail'>{data.name}</Text>
                    <Text className='text-gray-600 dark:text-gray-300'>{data.username}</Text>
                    {/* <Text className='flex-1 flex-wrap text-gray-600 mt-1 dark:text-gray-400'>Other stuff</Text> */}
                </View>
            </View>
            <Pressable 
                onPress={() => debounce(requestConnectionHandler)}
                disabled={isLoading}
                className='z-[80]'
            >
                <Text className={`text-3xl dark:text-white ${isLoading && 'text-gray-300'}`}>+</Text>
            </Pressable>
        </TouchableOpacity>
    );
}

export default ExploreItem;