import { SafeAreaView, View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Screen from '../../components/common/Screen';
import JobsActivityTabNavigation from './navigation/JobActivityTabNavigation';

const BookmarkJobsScreen = () => {
    const { t } = useTranslation();

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <Text className='text-lg font-bold dark:text-white'>{t('jobscreen.bookmarkDesc')}</Text>
                <View className='my-4' />
                <JobsActivityTabNavigation />
            </Screen>
        </SafeAreaView>
    );
}

export default BookmarkJobsScreen;