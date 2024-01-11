import React, { useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RefreshControl } from 'react-native-gesture-handler';

import { MainNavigationParams } from '../../../navigators/MainNavigation';
import { RootState } from '../../../store/store';
import { HireItem } from '../../../components/jobs';
import { useOpenJobs } from '../hooks';
import { useAppSelector, useRefreshOnFocus } from '../../../hooks';
import { GetAllJobsStatusProps } from '../services';
import Loading from '../../../components/common/Loading';
import { showErrorToast } from '../../../utils';
import Empty from '../../../components/connections/Empty';
import Crash from '../../../components/common/Crash';

function OpenJobs() {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [page, setPage] = useState(0);
    const payload = {
        token: token,
        params: {
            pageSize: 10,
            jobPostingStatus: 'OPEN',
        }
    } as GetAllJobsStatusProps;
    const { data, isLoading, isError, error: rqError, refetch } = useOpenJobs(payload);

    useRefreshOnFocus(refetch);
    

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
        return (
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <Crash message={rqError.message} />
                <View className='my-2' />
            </ScrollView>
        );
    }

    return (
        <View className='flex-1'>
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={({ item }) => <HireItem data={item} />}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className='my-2' />}
                contentContainerStyle={{ 
                    flexGrow: 1,
                }}
                ListEmptyComponent={<Empty label={t('jobScreen.prompts.noOpen')} />}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
            />
        </View>
    );
}

export default OpenJobs;