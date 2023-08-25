import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Avatar from '../common/Avatar';
import { JobsTypes } from '../../types/jobs';

function JobItem({ data }: { data: JobsTypes }) {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

    const {
        jobId, 
        title,
        companyName,
        workModes,
        employmentTypes,
        applicantsCount,
        profileimageUrl
    } = data;
    
    return (
        <TouchableOpacity onPress={() => navigation.navigate('ShowJob', {jobId})} className='flex-row items-start space-x-3 p-4 rounded-md bg-white dark:bg-colors-new_2'>
            <Avatar image={profileimageUrl} size={60} />
            <View className='flex-1'>
                <View>
                    <Text className='flex-1 font-bold dark:text-white' numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                    <Text className='text-gray-600 dark:text-gray-300'>{ companyName }</Text>
                    <View className='flex-1 flex-wrap flex-row space-x-2'>
                        {
                            workModes.map((item, index) => <Text key={index} className='text-gray-600 mt-1 dark:text-gray-300'>{item}</Text>)
                        }
                    </View>
                </View>
                <View className='mt-1'>
                    <View className='flex-1 flex-wrap flex-row space-x-2'>
                        {
                            employmentTypes.map((item, index) => <Text key={index} className='text-gray-700 dark:text-white'>{item}</Text>)
                        }
                    </View>
                    <View className='my-2' />
                    <Text className='text-gray-700 dark:text-white'>{t('jobScreen.applicants', {applicantsNum: applicantsCount})}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default JobItem;