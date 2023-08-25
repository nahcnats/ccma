import React from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native-gesture-handler';

import { RootState } from '../../../store/store';
import { useAppSelector } from '../../../hooks';
import { RequestItem } from '../../../components/connections/'
import { Empty } from '../../../components/connections';
import { useCreativeConnections } from '../hooks';
import Crash from '../../../components/common/Crash';

function PendingRequests() {
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
        // <Empty label={t('networkScreen.prompts.noConnectionRequests')} />
        <View className='flex-1'>
            <FlatList
                scrollEventThrottle={16}
                data={data?.connectedConnections}
                keyExtractor={(item, index) => `${item.connectionId}`}
                renderItem={({ item }) => <RequestItem data={item} />}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className='my-2' />}
                ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
            />
        </View>
    );
}

export default PendingRequests;