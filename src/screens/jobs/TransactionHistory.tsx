import { SafeAreaView, View, Text, Image, FlatList, useColorScheme } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import Loading from '../../components/common/Loading';
import Empty from "../../components/common/Empty";
import { TransactionHistoryType } from '../../types/jobs';
import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useTransactioHistory } from './hooks';
import { showErrorToast } from '../../utils';

interface CardHeaderTagProps {
    tokenCount: number
    status: string
}

const availableStatus = [
    'SUCCESS',
    'IN_PROGRESS',
    'FAILED',
]

const TransactionHistoryScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const payload = {
        token: token
    }
    const { data, isLoading, isError, error: rqError, refetch } = useTransactioHistory(payload);
    useRefreshOnFocus(refetch);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    const cardHeader = [
        { 
            status: availableStatus[0], 
            value: t('transactionHistoryScreen.statuses.topUpTitle'), 
            desc: t('transactionHistoryScreen.statuses.topUpDesc') 
        },
        { 
            status: availableStatus[1], 
            value: t('transactionHistoryScreen.statuses.inProgressTitle'), 
            desc: t('transactionHistoryScreen.statuses.inProgressDesc') 
        },
        { 
            status: availableStatus[2], 
            value: t('transactionHistoryScreen.statuses.failedTitle'), 
            desc: t('transactionHistoryScreen.statuses.failedDesc') 
        },
    ];

    const CardHeaderTag = ({tokenCount, status} : CardHeaderTagProps) => {
        let bgColor;

        if (status === availableStatus[0]) {
            bgColor = '#00AD30';
        }

        if (status === availableStatus[2]) {
            bgColor = '#C7684E';
        }

        if (status === availableStatus[1]) {
            bgColor = '#FFA800';
        }

        return (
            <View 
                className='rounded-2xl py-2 px-4 flex-row justify-center items-center space-x-3'
                style={{
                    backgroundColor: bgColor
                }}
            >
                <View><Text className='text-white font-[500]'>{tokenCount}</Text></View>
                <Image source={require('../../assets/images/token.png')} resizeMode='contain' className='rounded-full w-[20] h-[20]' />
            </View>
        );
    }

    const TransactionItem = ({data}: {data: TransactionHistoryType}) => {
        const titleData = cardHeader.find(item => item.status === data.status);

        return (
            <View className='rounded-md border border-gray-300 p-2 dark:bg-colors-new_2'>
                <View className='flex-row justify-between items-center'>
                    <View className='w-[70%]'>
                        <Text className='text-lg font-bold dark:text-white'>{titleData?.value}</Text>
                        <View className='h-[0.5]' />
                        <Text className='dark:text-white'>{titleData?.desc}</Text>
                    </View>
                    <CardHeaderTag status={data.status} tokenCount={data.tokensCount} />
                </View>
                <View className='my-3' />
                <View className='flex-row justify-between items-center space-x-2 mx-2'>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex-1'>
                            <Text className='font-bold dark:text-white'>{t('transactionHistoryScreen.totalDiscount')}</Text>
                            <View className='h-[2]' />
                            <Text className='dark:text-white'>RM {data.totalDiscount}</Text>
                        </View>
                        <View className='flex-1'>
                            <Text className='font-bold dark:text-white'>{t('transactionHistoryScreen.totalAmountPaid')}</Text>
                            <View className='h-[2]' />
                            <Text className='dark:text-white'>RM {data.totalAmountPaid}</Text>
                        </View>
                    </View>
                </View>
                <View className='my-2' />
                <View className='flex-row justify-between items-center space-x-2 mx-2'>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex-1'>
                            <Text className='font-bold dark:text-white'>{t('transactionHistoryScreen.paymentMethod')}</Text>
                            <View className='h-[2]' />
                            <Text className='dark:text-white'>{data.paymentMethod}</Text>
                        </View>
                        <View className='flex-1'>
                            <Text className='font-bold dark:text-white'>{t('transactionHistoryScreen.transactionDate')}</Text>
                            <View className='h-[2]' />
                            <Text className='dark:text-white'>{data.transactionDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <ScreenTitle title={t('transactionHistoryScreen.title')} />
                <View className='my-3' />
                <FlatList 
                    data={data}
                    keyExtractor={(item, index) => `${item.id}`}
                    renderItem={({ item }) => <TransactionItem data={item} />}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='my-2' />}
                    ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                />
            </Screen>
        </SafeAreaView>
    );
}

export default TransactionHistoryScreen;