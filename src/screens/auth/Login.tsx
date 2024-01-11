import { View, KeyboardAvoidingView, Text, TouchableOpacity, ActivityIndicator, Alert, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthNavigationParams } from "../../navigators/AuthNavigation";
import { 
    appleSignIn,
    dismissKeyboard, 
    facebookSignIn, 
    googleSignIn, 
    IS_ANDROID, 
    showErrorToast, 
    silentFacebookSignIn, 
    silentGoogleSignIn 
} from '../../utils';
import Screen from '../../components/common/Screen';
import SubmitButton from '../../components/common/SubmitButton';
import { TextInput, InputFormErrors } from '../../components/common/input';
import { IconEmail, IconShowPassword, IconFacebook, IconGoogle, IconApple } from '../../assets/icons';
import * as authActions from '../../store/actions/auth';
import { useAppDispatch, useDebounce } from '../../hooks';
import { SUPPORT_APPLE_LOGIN } from '../../constants/apple';

const iconSize = 18;

interface FormValues {
    email: string
    password: string
}

export default function LoginScreen() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const {...methods} = useForm<FormValues>();
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => { 
        dismissKeyboard();
        
        try {
            setLoading(true);

            const actionForToken = authActions.login({
                email: data.email,
                password: data.password
            });

            await dispatch(actionForToken);

            setLoading(false);    
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.error'), error.message); 
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    const providerSignInHandler = async (provider: string) => {
        try {
            switch (provider) {
                case 'GOOGLE': {
                    const userInfo = await googleSignIn();

                    const payload = {
                        provider: provider,
                        email: userInfo.user.email,
                        token: userInfo.token,
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }
                case 'FACEBOOK': {
                    const userInfo = await facebookSignIn();
                    const payload = {
                        provider: provider,
                        email: userInfo.email || '',
                        token: userInfo.token || ''
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }
                case 'APPLE': {
                    const userInfo = await appleSignIn(true);

                    const payload = {
                        provider: provider,
                        email: userInfo?.email || '',
                        token: userInfo?.token || ''
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }
                default: {
                    return;
                }
            }
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.error'), error.message); 
        }
    }

    return (
        <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
            <Screen>
                <View className='flex-1' onStartShouldSetResponder={dismissKeyboard}>
                    <View>
                        <Text 
                            className={`text-xl font-bold self-center ${colorScheme === 'dark' && 'text-white'}`}
                        >
                            {t('login.welcomeBack')}
                        </Text>
                    </View>
                    <View className='my-4' />
                    <FormProvider {...methods}>
                        <View>
                            <TextInput
                                name='email'
                                label={`${t('login.yourEmailAddress')}`}
                                placeholder={`${t('login.yourEmailAddressPlaceholder')}`}
                                autoCapitalize='none'
                                autoFocus={true}
                                keyboardType='email-address'
                                rules={{
                                    required: `${t('formErrors.email') }`,
                                    pattern: {
                                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
                                        message: `${t('formErrors.invalidEmail')}`
                                    }
                                }}
                                leftIcon={<IconEmail size={iconSize} color={colors.black} />}
                            />
                            {methods.formState.errors.email && <InputFormErrors message={`${errorMessage?.email?.message}`} />}
                        </View>
                        <View className='my-2' />
                        <View>
                            <TextInput
                                name='password'
                                label={`${t('login.yourPassword')}`}
                                placeholder={`${t('login.yourPasswordPlaceholder')}`}
                                secureTextEntry={secure}
                                rules={{
                                    required: `${t('formErrors.password') }`,
                                    minLength: 6
                                }}
                                leftIcon={<IconEmail size={iconSize} color={colors.black} />}
                                rightIcon={<TouchableOpacity onPress={() => setSecure(v => !v)}><IconShowPassword size={iconSize} color={colors.black} /></TouchableOpacity>}
                            />
                            {methods.formState.errors.password && <InputFormErrors message={`${errorMessage?.password?.message}`} />}
                        </View>
                        <View className='my-4' />
                        <SubmitButton
                            label={t('login.login')}
                            onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                            isProcessing={loading}
                            isDisable={loading}
                        />
                    </FormProvider>
                    <View className='my-4' />
                    <View>
                        <Text className={`${colorScheme === 'dark' && 'text-white'}`}>{t('login.orLoginWith')}</Text>
                        <View className='flex-row space-x-3 mt-6'>
                            {
                                SUPPORT_APPLE_LOGIN && 
                                <TouchableOpacity
                                    onPress={() => providerSignInHandler('APPLE')}
                                >
                                    <IconApple size={48} color={colorScheme === 'dark' ? colors.white : colors.black} />
                                </TouchableOpacity>        
                            }
                            {/* <TouchableOpacity
                                onPress={() => providerSignInHandler('FACEBOOK')}
                            >
                                <IconFacebook size={48} color={colorScheme === 'dark' ? colors.white : colors.black} />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={() => providerSignInHandler('GOOGLE')}
                            >
                                <IconGoogle size={48} color={colorScheme === 'dark' ? colors.white : colors.black} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='my-4' />
                    <View className='flex-row space-x-1'>
                        <View><Text className={`${colorScheme === 'dark' && 'text-white'}`}>{t('login.uhOh')}</Text></View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text 
                                className={`underline font-semibold ${colorScheme === 'dark' ? 'text-blue-600' : 'text-blue-900'}`}
                            >
                                {t('login.forgotPassword')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Screen>
        </KeyboardAvoidingView>
    );
}