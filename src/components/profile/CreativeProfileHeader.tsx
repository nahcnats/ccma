import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Avatar from '../common/Avatar';
import SubmitButton from '../common/SubmitButton';
import { IS_ANDROID } from '../../utils';
import { CreativeProfileType } from '../../types/profile';

interface CreativeProfileHeaderProps {
    data: CreativeProfileType | undefined
    showEdit: boolean
}

const CreativeProfileHeader = ({ data, showEdit }: CreativeProfileHeaderProps) => {
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    const CurrentPosition = () => {
        if (!data?.currentPositionCompanyName || !data?.currentPositionTitle) {
            return null;
        }

        return (
            <View className='my-3'>
                <Text className="text-base font-[500] dark:text-white">{data?.currentPositionTitle} at <Text className='text-blue-400'>{data?.currentPositionCompanyName}</Text></Text>
            </View>
        );
    }

    return (
        <View className={`mx-4 bg-transparent ${IS_ANDROID ? 'top-[270]' : 'top-[290]'}`}>
            <View className="flex-row flex-1 space-x-4">
                <View>
                    <Avatar image={data?.profileImageUrl} size={100} />
                </View>
                <View className="top-[40] flex-1">
                    <View>
                        <View className="flex-row space-x-2 items-center max-w-[180]">
                            <Text className="text-lg font-bold dark:text-white" numberOfLines={1} ellipsizeMode='tail'>
                                {data?.name}
                            </Text>
                            <Text className="text-xs text-gray-600 dark:text-gray-300">{data?.genderPreference}</Text>
                        </View>
                        <Text className='text-sm text-gray-700 dark:text-gray-300'>@{data?.username}</Text>
                    </View>
                    <CurrentPosition />
                </View>
            </View>
            {
                showEdit ? 
                <>
                        <View className="my-4" />
                        <SubmitButton label="Edit Profile" onPress={() => navigation.navigate('EditCreativeProfile')} />
                </> : null
            }
            <View className="my-3" />
        </View>
    )
}

export default CreativeProfileHeader;