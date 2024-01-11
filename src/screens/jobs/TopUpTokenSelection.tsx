import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import SubmitButton from '../../components/common/SubmitButton';
import Loading from '../../components/common/Loading';
import { TokenSelector, GoldTokenTopUp, DiamondTokenTopUp } from '../../components/jobs';
import { showErrorToast } from '../../utils';
import * as topUpTokenActions from '../../store/actions/tokenTopUp';
import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch, useDebounce, useRefreshOnFocus } from '../../hooks';
import { useTokenDetails } from './hooks';

const tokenImage = require('../../assets/images/token.png');

export interface TopUpTokenProps {
    tokenToBuy: number
    totalPrice: number
    onDecreaseToken: () => void
    onIncreaseToken: () => void
}

const TopUpTokenSelectionScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [tokenToBuy, setTokenToBuy] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [tokenType, setTokenType] = useState('BASIC');
    const [tokenId, setTokenId] = useState(0);
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { data, isLoading, isError, error: rqError, refetch} = useTokenDetails(token);
    useRefreshOnFocus(refetch);

    const typeChangeHandler = (value: string) => {
        setTokenToBuy(0);
        setTotalPrice(0);
        setTokenType(value);
    }

    const tokenPriceHandler = (type: string) => {
        let tokenPrice = 0;
        let tokenId = 0;

        if (type === 'BASIC') {
            if (data?.length) {
                tokenPrice = data.filter(item => item.tokenCode === 'BASIC')[0].tokenPrice;
                tokenId = data.filter(item => item.tokenCode === 'BASIC')[0].tokenId;
            }

            const newTotalPrice = tokenToBuy * tokenPrice;

            setTotalPrice(newTotalPrice);
            setTokenId(tokenId);
        } else {
            if (data?.length) {
                tokenPrice = data.filter(item => item.tokenCode === 'PREMIUM')[0].tokenPrice;
                tokenId = data.filter(item => item.tokenCode === 'PREMIUM')[0].tokenId;
            }

            const newTotalPrice = tokenToBuy * tokenPrice;

            setTotalPrice(newTotalPrice);
            setTokenId(tokenId);
        }
    }

    const increaseTokenToBuyHandler = () => {
        setTokenToBuy(prev => prev + 1);
    }

    const decreaseTokenToBuyHandler = () => {
        setTokenToBuy(prev => prev - 1); 
    }

    const nextHandler = async () => {
        const action = topUpTokenActions.tokenTopUp({
            name: tokenType === 'BASIC' ? 'BASIC' : tokenType,
            totalToken: tokenToBuy,
            totalPrice: totalPrice,
            tokenId: tokenId,
        });

        await dispatch(action);

        navigation.navigate('PurchaseToken');
    }

    useEffect(() => {
        tokenPriceHandler(tokenType);
    }, [tokenToBuy]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <Screen>
            <SafeAreaView className='flex-1 justify-between'>
                <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                    <View>
                        <ScreenTitle title={t('jobScreen.topUpTitle')} />
                        <View className='mt-4'>
                            <Text className='leading-5 dark:text-white'>{t('jobScreen.topUpDescription')} <Text onPress={() => null} className='text-blue-900 dark:text-blue-400 font-bold'>{t('jobScreen.topUpClickHere')}</Text></Text>
                        </View>
                        <View className='my-8 h-[0.3] bg-gray-300' />
                        <TokenSelector onSelect={(value) => typeChangeHandler(value)} selectedType={tokenType} />
                        <View className='my-4' />
                        {
                            tokenType === 'BASIC' 
                                ? <GoldTokenTopUp onDecreaseToken={decreaseTokenToBuyHandler} onIncreaseToken={increaseTokenToBuyHandler} tokenToBuy={tokenToBuy} totalPrice={totalPrice} />
                                : <DiamondTokenTopUp onDecreaseToken={decreaseTokenToBuyHandler} onIncreaseToken={increaseTokenToBuyHandler} tokenToBuy={tokenToBuy} totalPrice={totalPrice} />
                        }       
                    </View>
                    <View className='my-4' />
                    <SubmitButton
                        label={t('commonActions.next')}
                        onPress={() => debounce(nextHandler)}
                        isDisable={(tokenToBuy > 0 && !isError) ? false : true}
                    />
                </ScrollView>
            </SafeAreaView>
        </Screen>
    );
}

export default TopUpTokenSelectionScreen;