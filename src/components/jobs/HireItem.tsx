import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { JobsStatusType } from '../../types/jobs';

function HireItem({data}: {data: JobsStatusType}) {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const {
        newApplicantsCount,
        jobPostingStatusId,
        shortlistedApplicantsCount,
        employmentTypeValue,
        id,
        totalApplicantsCount,
        title,
        userId,
        employmentTypeCode
    } = data;

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('ShowJob',{ jobId: id })} 
            className='flex-row items-start space-x-3 p-4 rounded-md bg-white dark:bg-colors-new_2'
        >
            <View className='flex-row space-x-3'>
                <View>
                    <Text className='text-black font-bold dark:text-white'>{title}</Text>
                    <Text className='mt-1 text-gray-700 dark:text-gray-400'>Remote</Text>
                    <View className='flex-row space-x-2 items-center justify-center'>
                        <Text className='mt-1 text-gray-700 dark:text-white'>{employmentTypeValue}</Text>
                        <Text className='text-black text-lg dark:text-gray-300'>|</Text>
                        <Text className='mt-1 text-gray-700 dark:text-white'>{t('jobScreen.applicants', { applicantsNum: totalApplicantsCount })}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default HireItem;