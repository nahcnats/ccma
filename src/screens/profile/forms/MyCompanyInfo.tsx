import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { queryClient } from '../../../App';
import { RootState } from '../../../store/store';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import Screen from '../../../components/common/Screen';
import { TextInput, DropdownSearch, DropdownPhone, InputFormErrors } from '../../../components/common/input';
import SubmitButton from '../../../components/common/SubmitButton';
import { IS_ANDROID, dismissKeyboard, showErrorToast, showSuccessToast } from '../../../utils';
import { IconDown, IconCalendar } from '../../../assets/icons';
import { minHeight, maxLength } from '../../../constants/others';
import { useUtilties, useAppSelector, useDebounce, useRefreshOnFocus } from '../../../hooks';
import { useEmployerProfile } from '../hooks';
import { postOrangeTick } from '../../orangetick/services';
import { editEmployer } from '../services';

interface FormValues {
    companyName: string
    ssm: string
    businessAddress: string
    website: string
    companyOverview: string
    phone: string
}

export default function MyCompanyForm() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const { ...methods } = useForm<FormValues>();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data: dropdown } = useUtilties();
    const { data } = useEmployerProfile(payload);
    const [employerIndustries, setEmployerIndustries] = useState(data?.employerIndustryId || 0)
    const [employerIndustriesError, setEmployerIndustriesError] = useState('');
    const [companySize, setCompanySize] = useState(data?.employerCompanySizeId || 0)
    const [companySizeError, setCompanySizeError] = useState('');
    const [phoneId, setPhoneId] = useState(data?.phoneNumberDataId || 0);
    const [phoneIdError, setPhoneIdError] = useState('');

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isLoading) return;
        
        if (employerIndustries === 0) {
            const errTxt = 'Please select an industry';
            setEmployerIndustriesError(errTxt);
            return;
        }

        if (companySize === 0) {
            const errTxt = 'Please select a company size';
            setCompanySizeError(errTxt);
            return;
        }

        if (phoneId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setPhoneIdError(errTxt);
            return;
        }

        try {
            setIsLoading(true);

            const profilePayload = {
                token: token,
                params: {
                    companyName: data.companyName,
                    businessAddress: data.businessAddress,
                    industryId: employerIndustries,
                    companySizeId: companySize,
                    companyOverview: data.companyOverview,
                    websiteUrl: data.website,
                    phoneNumber: data.phone,
                    phoneNumberDataId: phoneId
                }
            }

            await editEmployer(profilePayload);
            await queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
            
            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Company Info saved');
            navigation.goBack();
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View onStartShouldSetResponder={dismissKeyboard}>
                            <FormProvider {...methods}>
                                <TextInput
                                    name='companyName'
                                    label={`${t('editProfileScreen.myProfileForm.companynameLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.companynamePlaceholder')}`}
                                    defaultValue={data?.name || ''}
                                    rules={{
                                        required: `${t('formErrors.companyname')}`
                                    }}
                                    autoCapitalize='sentences'
                                />
                                {methods.formState.errors.companyName && <InputFormErrors message={`${errorMessage?.companyName?.message}`} />}
                                <View className='my-4' />
                                <TextInput
                                    name='ssm'
                                    label={`${t('editProfileScreen.myProfileForm.ssmLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.ssmPlaceholder')}`}
                                    defaultValue={data?.ssm || ''}
                                    // rules={{
                                    //     required: `${t('formErrors.ssm')}`
                                    // }}
                                    autoCapitalize='none'
                                />
                                {/* {methods.formState.errors.ssm && <InputFormErrors message={`${errorMessage?.ssm?.message}`} />} */}
                                <View className='my-4' />
                                <TextInput
                                    name='businessAddress'
                                    label={`${t('editProfileScreen.myProfileForm.emailLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.emailPlaceholder')}`}
                                    defaultValue={data?.businessAddress || ''}
                                    rules={{
                                        required: `${t('formErrors.businessAddress')}`,
                                    }}
                                    autoCapitalize='sentences'
                                />
                                {methods.formState.errors.businessAddress && <InputFormErrors message={`${errorMessage?.businessAddress?.message}`} />}
                                <View className='my-4' />
                                <TextInput
                                    name='website'
                                    label={`${t('editProfileScreen.myProfileForm.websiteLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.websitePlaceholder')}`}
                                    defaultValue={data?.websiteUrl || ''}
                                    autoCapitalize='none'
                                />
                                {/* {methods.formState.errors.businessAddress && <InputFormErrors message={`${errorMessage?.businessAddress?.message}`} />} */}
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myProfileForm.employerIndustryLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.employerIndustryPlaceholder')}`}
                                    value={employerIndustries}
                                    data={dropdown?.employerIndustries || []}
                                    onSelected={(id: number) => {
                                        employerIndustriesError !== '' && setEmployerIndustriesError('')
                                        setEmployerIndustries(id)
                                    }}
                                />
                                {employerIndustries === 0 && employerIndustriesError !== '' && <InputFormErrors message={employerIndustriesError} />}
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myProfileForm.companySizeLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.companySizePlaceholder')}`}
                                    value={companySize}
                                    useCode
                                    data={dropdown?.employerCompanySizes || []}
                                    onSelected={(id: number) => {
                                        companySizeError !== '' && setCompanySizeError('')
                                        setCompanySize(id)
                                    }}
                                />
                                {companySize === 0 && companySizeError !== '' && <InputFormErrors message={companySizeError} />}
                                <View className='my-4' />
                                <Text
                                    className={`font-bold border-gray-300 rounded-lg ${colorScheme === 'dark' && 'text-white'}`}
                                >
                                    {t('onboarding.form.phone')}</Text>
                                <View className='flex-row space-x-2'>
                                    <View className='w-[100]'>
                                        <DropdownPhone
                                            data={dropdown?.phoneNumbersData || []}
                                            value={phoneId}
                                            onSelected={(id: number) => {
                                                phoneIdError !== '' && setPhoneIdError('')
                                                setPhoneId(id)
                                            }}
                                        />
                                    </View>
                                    <View className='flex-1'>
                                        <TextInput
                                            name='phone'
                                            // label={`${t('editProfileScreen.myProfileForm.phoneLabel')}`}
                                            placeholder={`${t('editProfileScreen.myProfileForm.phonePlaceholder')}`}
                                            defaultValue={data?.phoneNumber || ''}
                                            rules={{
                                                required: `${t('formErrors.phone')}`,
                                            }}
                                        />
                                        {phoneId == 0 && phoneIdError !== '' && <InputFormErrors message={phoneIdError} />}
                                        {methods.formState.errors.phone && <InputFormErrors message={`${errorMessage?.phone?.message}`} />}
                                    </View>
                                </View>
                                <View className='my-4' />
                                <TextInput
                                    name='companyOverview'
                                    label={`${t('editProfileScreen.myProfileForm.companyOverviewLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.companyOverviewPlaceholder')}`}
                                    defaultValue={data?.bio || ''}
                                    // onChangeText={(e) => setLongText(e)}
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical='top'
                                    maxLength={maxLength}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                    rules={{
                                        required: `${t('formErrors.companyOverview')}`
                                    }}
                                />
                                {methods.formState.errors.companyOverview && <InputFormErrors message={`${errorMessage?.companyOverview?.message}`} />}
                                <View className='mt-1'>
                                    <Text className='self-end text-xs dark:text-white'>
                                        {`${methods.watch('companyOverview') ? (methods.watch('companyOverview').length) : 0} / ${maxLength}`}
                                    </Text>
                                </View>
                                <View className='my-4' />
                                <SubmitButton 
                                    label={`${t('editProfileScreen.actions.save')}`}
                                    onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                                    isProcessing={isLoading}
                                    isDisable={isLoading}
                                />
                            </FormProvider>
                        </View>
                    </ScrollView>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}