import { SafeAreaView, KeyboardAvoidingView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import DeviceCountry, { TYPE_TELEPHONY } from 'react-native-device-country';
import colors from 'tailwindcss/colors';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import SubmitButton from '../../components/common/SubmitButton';
import { TextInput } from '../../components/common/input';
import { IS_ANDROID, dismissKeyboard } from '../../utils';
import { useDebounce } from '../../hooks';
import { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks';
import { showErrorToast, showSuccessToast, showWarnToast } from '../../utils';
import { postStripePreBuy, BuyJobTokenProps, postValidateDiscount } from './services';
import { useBuyJobToken } from './hooks';
import { ValidateDiscountType } from '../../types/jobs';

interface FormValues {
    promoCode: string
}

export default function PurchaseTokenScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { ...methods } = useForm<FormValues>();
    const { debounce } = useDebounce();
    const [agree, setAgree] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discountData, setDiscountData] = useState<ValidateDiscountType | null>(null);
    const [countryCode, setCountryCode] = useState('MY');
    const { initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet()
    const { name, totalPrice, totalToken, tokenId } = useAppSelector((state: RootState) => state.topUpToken);
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { mutateAsync: postBuyJobToken } = useBuyJobToken();

    const checkoutWithStripe = async () => {
        setIsProcessingPayment(true);

        DeviceCountry.getCountryCode(TYPE_TELEPHONY)
        .then((result) => {
            setCountryCode(result.code);
        })
        .catch(() => null);

        try {
            const payload = {
                token: token,
                params: {
                    amount: discountData?.discountedAmount ? discountData?.discountedAmount : parseInt(totalPrice),
                    tokenId: tokenId,
                    discountId: discountData?.id || null,
                    tokensBought: totalToken,

                }
            }

            const res = await postStripePreBuy(payload);
            const { customerId, ephemeralKeySecret, paymentIntentSecret, ephemeralKey, paymentIntentId } = res;

            const { error: initError } = await initPaymentSheet(({
                customerId: customerId,
                customerEphemeralKeySecret: ephemeralKeySecret,
                paymentIntentClientSecret: paymentIntentSecret,
                merchantDisplayName: 'Cult Creative',
                customFlow: false,
                style: 'alwaysLight',
                defaultBillingDetails: {
                    address: {
                        country: countryCode
                    }
                }
            }));

            if (initError) throw new Error(`${t('purchaseTokenScreen.prompts.wentWrong')}`);

            const { error: paymentSheetError } = await presentPaymentSheet();

            if (paymentSheetError?.code === 'Canceled') {
                setIsProcessingPayment(false);
                showWarnToast(t('promptTitle.info'), t('purchaseTokenScreen.prompts.paymentCancel'));
                return;
            }

            if (paymentSheetError) throw new Error(`${t('purchaseTokenScreen.prompts.wentWrong')}`);
            
            updateBilling(paymentIntentId);
        } catch (error: any) {
            setIsProcessingPayment(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const updateBilling = async (paymentIntentId: string) => {
        try {
            const payload = {
                token: token,
                params: {
                    tokensBought: totalToken,
                    amount: discountData?.discountedAmount ? discountData?.discountedAmount * 100 : parseInt(totalPrice) * 100,
                    tokenId: tokenId,
                    discountId: discountData?.id || null,
                    transactionId: paymentIntentId
                }
            } as BuyJobTokenProps;

            await postBuyJobToken(payload);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'JobsTab',
                }
            });

            showSuccessToast(t('promptTitle.success'), t('purchaseTokenScreen.prompts.paymentSucceed'));
        } catch (error: any) {
            setIsProcessingPayment(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const validatePromoCode = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    discountCode: coupon,
                    amount: parseInt(totalPrice),
                    tokenTypeId: tokenId,
                }
            }

            const result = await postValidateDiscount(payload);

            if (!result) return;

            setDiscountData(result);
            
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }
    
    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <View onStartShouldSetResponder={dismissKeyboard}>
                        <FormProvider {...methods}>
                            <ScreenTitle title={t('purchaseTokenScreen.title')} />
                            <View className='my-2' />
                            <View>
                                <TextInput 
                                    name='promocode' 
                                    placeholder={`${t('purchaseTokenScreen.placeHolder')}`}
                                    autoCapitalize='none'
                                    onChangeText={(text) => setCoupon(text)}
                                    rightIcon={coupon !== '' ? <TouchableOpacity onPress={validatePromoCode}><Text className='text-blue-900 font-bold'>{t('purchaseTokenScreen.apply')}</Text></TouchableOpacity> : null}
                                />
                            </View>
                            <View className='my-4' />
                            <Text className='text-base font-bold dark:text-white'>{t('purchaseTokenScreen.summary')}</Text>
                            <View className='my-2' />
                            <View className='flex-row justify-between'>
                                <Text className='font-[400] dark:text-white'>{name} x {totalToken}</Text>
                                {/* <Text className='font-bold dark:text-white'>RM {totalPrice}</Text> */}
                            </View>
                            <View className='my-2' />
                            <View className='flex-row justify-between'>
                                <Text className='font-[600] dark:text-white'>{t('purchaseTokenScreen.totalLabel')}</Text>
                                <Text className='font-bold dark:text-white'>RM {totalPrice}</Text>
                            </View>
                            <View className='my-4' />
                            <View className='flex-row space-x-4'>
                                <CheckBox
                                    style={{ width: 24, height: 24 }} 
                                    boxType='square'
                                    value={agree} 
                                    onChange={() => setAgree(prev => !prev)} 
                                />
                                <View className='pr-4'>
                                    <Text className='dark:text-white'>{t('purchaseTokenScreen.terms1')} <Text onPress={() => null} className='text-blue-900 font-bold dark:text-blue-400'>{t('purchaseTokenScreen.terms2')}</Text> {t('purchaseTokenScreen.terms3')}</Text>
                                </View>
                            </View>
                            <View className='my-4' />
                            <SubmitButton 
                                label={t('purchaseTokenScreen.purchaseButton')}
                                onPress={() => debounce(checkoutWithStripe)}
                                isProcessing={isProcessingPayment}
                                isDisable={!agree || isProcessingPayment}
                            />
                        </FormProvider>
                    </View>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}