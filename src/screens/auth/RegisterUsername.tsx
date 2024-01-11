import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootState } from '../../store/store';
import { AuthNavigationParams } from "../../navigators/AuthNavigation";
import { IS_ANDROID, dismissKeyboard, showErrorToast } from '../../utils';
import Screen from '../../components/common/Screen';
import { TextInput, InputFormErrors } from '../../components/common/input';
import { OnboardingFooter } from '../../components/auth';
import { validateUsername } from './services'
import { IconCheckCircle, IconCloseCircle } from '../../assets/icons';
import colors from 'tailwindcss/colors';
import * as onBoardingActions from '../../store/actions/onboarding';
import { useDebounce, useAppDispatch, useAppSelector } from '../../hooks';


interface FormValues {
    username: string
}

const RegisterUsernameScreen = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { debounce } = useDebounce();
    const { ...methods } = useForm<FormValues>();
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const [invalid, setInvalid] = useState(false);
    const [validText, setValidText] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const { role } = useAppSelector((state: RootState) => state.onboarding);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();
        
        try {
            setLoading(true);

            const isUsernameValid = await validateUsername(data.username);

            if (!isUsernameValid) {
                setTimeout(() => {
                    setValidText('');
                    setLoading(false);
                }, 3000);
                setInvalid(true);
                const translated = t('onboarding.registerUserError', { username: data.username });
                setValidText(translated);
                return;
            }    

            const action = onBoardingActions.validUsername(data.username);

            await dispatch(action);

            setLoading(false);

            role === 'CREATIVE' ? navigation.navigate('CreativeInfo') : navigation.navigate('EmployerInfo');
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.error'), error.message); 
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    const ValidUsernameElement = () => {
        return (
            <>
                <View className='my-2' />
                <View className='flex-row space-x-3 items-center justify-center'>
                    <Text className='text-base dark:text-white'>{validText}</Text>
                    { invalid ? <IconCloseCircle size={24} color={colors.red[500]} /> : <IconCheckCircle size={20} color={colors.green[500]} /> }
                </View>

            </>
        );
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <FormProvider {...methods}>
                        <View className='flex-1 justify-between' onStartShouldSetResponder={dismissKeyboard}>
                            <View className='flex-1 justify-center'>
                                <TextInput 
                                    name='username'
                                    label={`${t('onboarding.form.username')}`}
                                    placeholder={`${t('onboarding.form.usernamePlaceholder')}`}
                                    autoFocus={true}
                                    autoCapitalize='none'
                                    rules={{
                                        required: `${t('formErrors.username')}`,
                                        pattern: {
                                            value: /^[a-zA-Z0-9.\_]{3,30}$/,
                                            message: `${t('onboarding.errorMessage.username')}`
                                        }
                                    }}
                                />
                                {/* {methods.formState.errors.username && <InputFormErrors message={t('formErrors.username')} />} */}
                                {methods.formState.errors.username && <InputFormErrors message={`${errorMessage?.username?.message}`} />}
                                {
                                    validText !== '' && 
                                    <ValidUsernameElement />
                                }
                            </View>
                            <View className={`${IS_ANDROID && 'pb-4'}`}>
                                {/* <OnboardingFooter isValid={methods.formState.isValid} isValid={methods.formState.isValid} onNext={() => navigation.navigate('CreativeInfo')} /> */}
                                <OnboardingFooter onNext={() => debounce(methods.handleSubmit(onSubmit, onError))} loading={loading} />
                            </View>
                        </View>
                    </FormProvider>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterUsernameScreen;