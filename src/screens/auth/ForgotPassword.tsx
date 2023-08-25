import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigationParams } from '../../navigators/AuthNavigation';
import Screen from '../../components/common/Screen';
import SubmitButton from '../../components/common/SubmitButton';
import { TextInput, InputFormErrors } from '../../components/common/input';
import { IconEmail } from '../../assets/icons';
import { IS_ANDROID, dismissKeyboard } from '../../utils';
import { showErrorToast } from '../../utils';
import { forgotPaswordRequestToken } from './services';
import { useDebounce } from '../../hooks';

const iconSize = 18;

interface FormValues {
    email: string
}

export default function ForgotPasswordScreen() {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const { ...methods } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [isLoading, setIsLoading] = useState(false);
    const [noti, setNoti] = useState('');

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            setIsLoading(true);

            await forgotPaswordRequestToken(data.email);

            setNoti(`Please check your email ${data.email} for further instructions.`);
            setTimeout(() => {
                setNoti('');

                navigation.navigate('Landing');
            }, 5000);

            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    return (
        <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
            <Screen>
                <View className='flex-1' onStartShouldSetResponder={dismissKeyboard}>
                    <View>
                        <Text className='text-xl font-bold'>{t('forgotPassword.forgotPassword')}</Text>
                    </View>
                    <View className='my-4' />
                    <FormProvider {...methods}>
                        <View>
                            <TextInput
                                name='email'
                                label={`${t('login.yourEmailAddress')}`}
                                placeholder={`${t('login.yourEmailAddressPlaceholder')}`}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoFocus={true}
                                rules={{
                                    required: true
                                }}
                                leftIcon={<IconEmail size={iconSize} color={colors.black} style={{ marginRight: 4 }} />}
                            />
                            {methods.formState.errors.email && <InputFormErrors message={`${t('forgotPassword.errorMessages.email')}`} />}
                        </View>
                        {
                            noti !== '' &&
                            <View className='my-2'>
                                <Text className='self-center dark:text-white'>{noti}</Text>
                            </View>
                        }
                        <View className='my-6' />
                        <SubmitButton
                            label={t('forgotPassword.submit')}
                            onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                            isProcessing={isLoading}
                            isDisable={isLoading}
                        />
                    </FormProvider>
                </View>
            </Screen>
        </KeyboardAvoidingView>
    );
}