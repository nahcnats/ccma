import { 
    SafeAreaView,
    ScrollView,
    View, 
    Text, 
    KeyboardAvoidingView, 
    TouchableOpacity, 
    useColorScheme 
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthNavigationParams } from "../../navigators/AuthNavigation";
import { IS_ANDROID, dismissKeyboard, showErrorToast } from '../../utils';
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import { DropdownPhone, InputFormErrors } from '../../components/common/input';
import { IconShowPassword } from '../../assets/icons';
import { TextInput, DropdownSearch } from '../../components/common/input';
import { OnboardingFooter } from '../../components/auth';
import { useDebounce, useUtilties } from '../../hooks';
import * as onBoardingActions from '../../store/actions/onboarding';

const iconSize = 18;

interface FormValues {
    email: string
    password: string
    confirmPassword: string
    companyName: string
    phone: string
}

const EmployerInfoScreen = () => {
    const { t } = useTranslation();
    const { ...methods } = useForm<FormValues>();
    const colorScheme = useColorScheme();
    const [date, setDate] = useState(new Date());
    const navigation = useNavigation<StackNavigationProp<AuthNavigationParams>>();
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const { role, username, provider, email, name, token: providerToken } = useAppSelector((state: RootState) => state.onboarding);
    const [loading, setLoading] = useState(false);
    const [phoneId, setPhoneId] = useState(0);
    const [industryId, setIndustryId] = useState(0);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [secure, setSecure] = useState(true);
    const [phoneIdError, setPhoneIdError] = useState('');
    const [industryIdError, setIndustryIdError] = useState('');
    const { data, isLoading, isError, error: rqError } = useUtilties();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (loading) {
            return;
        }

        if (phoneId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setPhoneIdError(errTxt);
            return;
        }

        try {
            setLoading(true);

            const action = onBoardingActions.registerEmployer({
                email: data.email,
                password: data.password,
                name: data.companyName,
                username: username,
                phoneNumber: data.phone,
                phoneNumberDataId: phoneId,
                role: role,
                provider: provider ? provider : 'none',
                token: providerToken || ''
            });

            await dispatch(action)

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <FormProvider {...methods}>
                        <View className='flex-1 justify-between mt-4'>
                            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                                <View>
                                    <TextInput 
                                        name='email'
                                        label={`${t('onboarding.form.email')}`}
                                        placeholder={`${t('onboarding.form.emailPlaceholder')}`}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        rules={{
                                            required: `${t('formErrors.email')}`,
                                            pattern: {
                                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
                                                message: `${t('formErrors.invalidEmail')}`
                                            }
                                        }}
                                    />
                                    {methods.formState.errors.email && <InputFormErrors message={`${errorMessage?.email?.message}`} />}
                                    {
                                        provider == null &&
                                        <>
                                            <View className='my-2' />
                                            <TextInput
                                                name='password'
                                                label={`${t('onboarding.form.password')}`}
                                                placeholder={`${t('onboarding.form.passwordPlaceholder')}`}
                                                rules={{
                                                    required: provider == null ? `${t('formErrors.password')}` : false,
                                                    minLength: {
                                                        value: 6,
                                                        message: t('onboarding.passwordLengthText', { length: 6 })
                                                    },
                                                }}
                                                autoCapitalize='none'
                                                secureTextEntry={secure}
                                                rightIcon={<TouchableOpacity onPress={() => setSecure(v => !v)}><IconShowPassword size={iconSize} color={colors.black} /></TouchableOpacity>}
                                            />
                                            {methods.formState.errors.password && <InputFormErrors message={`${errorMessage?.password?.message}`} />}
                                            <View className='my-2' />
                                            <TextInput
                                                name='confirmPassword'
                                                label={`${t('onboarding.form.confirmPassword')}`}
                                                placeholder={`${t('onboarding.form.confirmPasswordPlaceholder')}`}
                                                rules={{
                                                    required: provider == null ? `${t('formErrors.confirmPassword')}` : false,
                                                    minLength: {
                                                        value: 6,
                                                        message: t('onboarding.passwordLengthText', { length: 6 })
                                                    },
                                                    validate: (value, formValues) => formValues.password === value || `${t('onboarding.passwordNotMatch')}`
                                                }}
                                                autoCapitalize='none'
                                                secureTextEntry={secure}
                                                rightIcon={<TouchableOpacity onPress={() => setSecure(v => !v)}><IconShowPassword size={iconSize} color={colors.black} /></TouchableOpacity>}
                                            />
                                            {methods.formState.errors.confirmPassword && <InputFormErrors message={`${errorMessage?.confirmPassword?.message}`} />}
                                        </>
                                    }
                                    <View className='my-2' />
                                    <TextInput
                                        name='companyName'
                                        label={`${t('onboarding.form.companyname')}`}
                                        placeholder={`${t('onboarding.form.companynamePlaceholder')}`}
                                        rules={{
                                            required: `${t('formErrors.companyname')}`,
                                        }}
                                    />
                                    {methods.formState.errors.companyName && <InputFormErrors message={`${errorMessage?.companyName?.message}`} />}
                                    {/* <View className='my-2' />
                                    <DropdownSearch
                                        label={`${t('onboarding.form.industry')}`}
                                        placeholder={`${t('onboarding.form.industryPlaceholder')}`}
                                        data={industry}
                                        onSelected={() => null}
                                    />
                                    {industryId == 0 && industryIdError !== '' && <InputFormErrors message={industryIdError} />} */}
                                    {/* <View className='my-2' />
                                    <DropdownSearch
                                        label='Company Size'
                                        placeholder='Choose company size'
                                        data={compsize}
                                        onSelected={() => null}
                                    /> */}
                                    <View className='my-2' />
                                    <Text 
                                        className={`font-bold border-gray-300 rounded-lg ${colorScheme === 'dark' && 'text-white'}`}
                                    >
                                        {t('onboarding.form.phone')}</Text>
                                    <View>
                                        <View className='flex-row space-x-2'>
                                            <View className='w-20'>
                                                <DropdownPhone
                                                    data={data?.phoneNumbersData || []}
                                                    onSelected={(id: number) => {
                                                        phoneIdError !== '' && setPhoneIdError('')
                                                        setPhoneId(id)
                                                    }}
                                                />
                                            </View>
                                            <View className='flex-1'>
                                                <TextInput
                                                    name='phone'
                                                    placeholder={`${t('onboarding.form.phonePlaceholder')}`}
                                                    rules={{
                                                        required: `${t('formErrors.phone')}`,
                                                    }}
                                                />
                                                {phoneId == 0 && phoneIdError !== '' && <InputFormErrors message={phoneIdError} />}
                                                {methods.formState.errors.phone && <InputFormErrors message={`${errorMessage?.phone?.message}`} />}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                            <View>
                                <OnboardingFooter onNext={() => debounce(methods.handleSubmit(onSubmit, onError))} loading={loading} />
                            </View>
                        </View>
                    </FormProvider>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default EmployerInfoScreen;