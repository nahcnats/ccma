import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native-gesture-handler';

import Loading from '../../../components/common/Loading';
import { RootState } from '../../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../../hooks';
import { SentItem } from '../../../components/connections';
import { Empty } from '../../../components/connections';
import { useCreativeConnections } from '../hooks';
import { showErrorToast } from '../../../utils';
import Crash from '../../../components/common/Crash';

function SentRequests() {
    const { t } = useTranslation();
    const token = useAppSelector((state: RootState) => state.auth.token);

    const payload = {
        token: token
    }
    const { data, isLoading, isError, error: rqError, refetch } = useCreativeConnections(payload);

    if (isError) {
        return <Crash message={rqError.message} />
    }

    return (
        // <Empty label={t('networkScreen.prompts.noSentRequests')} />
        <View className='flex-1'>
            <FlatList
                scrollEventThrottle={16}
                data={data?.requestPendingConnections}
                keyExtractor={(item, index) => `${item.connectionId}`}
                renderItem={({ item }) => <SentItem data={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                ItemSeparatorComponent={() => <View className='my-2' />}
                ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
            />
        </View>
    );
}

export default SentRequests;