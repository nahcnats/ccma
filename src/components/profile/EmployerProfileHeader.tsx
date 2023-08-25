import { View, Text } from 'react-native';
import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { IS_ANDROID } from '../../utils';
import Avatar from '../common/Avatar';
import SubmitButton from '../common/SubmitButton';
import { EmployerProfileType } from '../../types/profile';

interface EmployerProfileHeaderProps {
    data: EmployerProfileType | undefined
    showEdit: boolean
}

const EmployerProfileHeader = ({ data, showEdit }: EmployerProfileHeaderProps) => {
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    return (
        <View className={`mx-4 bg-transparent ${IS_ANDROID ? 'top-[270]' : 'top-[290]'}`}>
            <View className="flex-row space-x-4">
                <View>
                    <View>
                        <Avatar image={data?.profileImageUrl} size={100} />
                    </View>
                </View>
                <View className="top-[40]">
                    <View>
                        <View className="flex-row space-x-4">
                            <Text className="text-lg font-bold dark:text-white">{data?.name}</Text>
                        </View>
                        <Text className='text-sm text-gray-700 dark:text-gray-300'>@{data?.username}</Text>
                    </View>
                </View>
            </View>
            {
                showEdit ?
                    <>
                        <View className="my-2" />
                        <SubmitButton label="Edit Profile" onPress={() => navigation.navigate('EditEmployerProfile')} />
                        
                    </> : null
            }
            <View className="my-3" />
        </View>
    )
}

export default EmployerProfileHeader;