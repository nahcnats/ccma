import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
    Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
import { useCreativeProfile } from '../hooks';
import { postOrangeTick } from '../../orangetick/services';
import { editCreative } from '../services';

interface FormValues {
    username: string
    fullname: string
    email: string
    phone: string
    dob: string
    aboutme: string
}

export default function MyProfileForm() {
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
    const { data, isSuccess, refetch } = useCreativeProfile(payload);
    useRefreshOnFocus(refetch);

    const [dob, setDob] = useState(data?.dateOfBirth || new Date());
    const fDate = moment(dob).format('YYYY-DD-MM');
    const [phoneId, setPhoneId] = useState(data?.phoneNumberDataId || 0);
    const [genderPreferenceId, setGenderPreferenceId] = useState(data?.genderPreferenceId);
    const [educationLevelId, setEducationLevelId] = useState(data?.educationLevelId);
    const [salaryRangeId, setSalaryRangeId] = useState(0);
    const [employmentTypeId, setEmploymentTypeId] = useState(0);
    const [dobError, setDobError] = useState('');
    const [phoneIdError, setPhoneIdError] = useState('');
    const [genderIdError, setGenderIdError] = useState('');
    const [educationLevelError, setEducationLevelError] = useState('');
    const [salaryRangeError, setSalaryRangeError] = useState('');
    const [employmentTypeError, setEmploymentTypeError] = useState('');

    useEffect(() => {
        if (data?.preferredSalaryRangeIds && data?.preferredSalaryRangeIds.length) {
            setSalaryRangeId(2);
        }

        if (data?.preferredEmploymentTypeIds) {
            setEmploymentTypeId(data?.preferredEmploymentTypeIds[0]);
        }
        
    }, [isSuccess]);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || dob;
        setDob(currentDate);
        setShowPicker(!IS_ANDROID)
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isLoading) return;

        if (!dob) {
            const errTxt = t('formErrors.dob');
            setDobError(errTxt);
            return;
        }
        
        if (genderPreferenceId === 0) {
            const errTxt = t('onboarding.form.addressYouError');
            setGenderIdError(errTxt);
            return;
        }

        if (phoneId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setPhoneIdError(errTxt);
            return;
        }

        if (educationLevelId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setEducationLevelError(errTxt);
            return;
        }

        if (salaryRangeId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setSalaryRangeError(errTxt);
            return;
        }

        if (employmentTypeId === 0) {
            const errTxt = t('onboarding.form.phoneError');
            setEmploymentTypeError(errTxt);
            return;
        }

        try {
            setIsLoading(true);

            const profilePayload = {
                token: token,
                params: {
                    email: data.email,
                    // username: data.username,
                    name: data.fullname,
                    phoneNumber: data.phone,
                    phoneNumberDataId: phoneId
                }
            }

            const orangeTickPayload = {
                token: token,
                params: {
                    dateOfBirth: fDate,
                    educationLevelId: educationLevelId,
                    creativesSalaryRanges: [salaryRangeId],
                    creativesEmploymentPosition: {
                        employmentTypeId: employmentTypeId,
                    },
                    creativesEmploymentTypes:[employmentTypeId],
                    bio: data.aboutme
                }
            }
            
            await postOrangeTick(orangeTickPayload);
            await editCreative(profilePayload);
            await queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });
            
            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Profile saved');
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
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Screen>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View onStartShouldSetResponder={dismissKeyboard}>
                            <FormProvider {...methods}>
                                {/* <TextInput
                                    name='username'
                                    label={`${t('editProfileScreen.myProfileForm.usernameLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.usernamePlaceholder')}`}
                                    defaultValue={data?.username || ''}
                                    rules={{
                                        required: `${t('formErrors.username')}`
                                    }}
                                />
                                {methods.formState.errors.username && <InputFormErrors message={`${errorMessage?.username?.message}`} />}
                                <View className='my-4' /> */}
                                <TextInput
                                    name='fullname'
                                    label={`${t('editProfileScreen.myProfileForm.fullnameLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.fullnamePlaceholder')}`}
                                    defaultValue={data?.name || ''}
                                    rules={{
                                        required: `${t('formErrors.fullname')}`
                                    }}
                                />
                                {methods.formState.errors.fullname && <InputFormErrors message={`${errorMessage?.fullname?.message}`} />}
                                <View className='my-4' />
                                <TextInput
                                    name='email'
                                    label={`${t('editProfileScreen.myProfileForm.emailLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.emailPlaceholder')}`}
                                    keyboardType='email-address'
                                    defaultValue={data?.email || ''}
                                    rules={{
                                        required: `${t('formErrors.email')}`,
                                        pattern: {
                                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
                                            message: `${t('formErrors.invalidEmail')}`
                                        }
                                    }}
                                    autoCapitalize='none'
                                />
                                {methods.formState.errors.email && <InputFormErrors message={`${errorMessage?.email?.message}`} />}
                                <View className='my-4' />
                                <DropdownSearch 
                                    label={`${t('editProfileScreen.myProfileForm.addressYouLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.addressYouPlaceholder')}`}
                                    value={genderPreferenceId}
                                    data={dropdown?.genderPreferences || []}
                                    onSelected={(id: number) => {
                                        genderIdError !== '' && setGenderIdError('')
                                        setGenderPreferenceId(id)
                                    }}
                                />
                                {genderPreferenceId === 0 && genderIdError !== '' && <InputFormErrors message={genderIdError} />}
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
                                            keyboardType='number-pad'
                                        />
                                        {phoneId == 0 && phoneIdError !== '' && <InputFormErrors message={phoneIdError} />}
                                        {methods.formState.errors.phone && <InputFormErrors message={`${errorMessage?.phone?.message}`} />}
                                    </View>
                                </View>
                                <View className='my-4' />
                                <TextInput
                                    name='dob'
                                    label={`${t('editProfileScreen.myProfileForm.dobLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.dobPlaceholder')}`}
                                    value={fDate}
                                    // onChangeText={() => null}
                                    rightIcon={<TouchableOpacity onPress={() => setShowPicker(v => !v)}><IconCalendar size={16} color={colors.black} /></TouchableOpacity>}
                                    // rules={{
                                    //     required: `${t('formErrors.dob')}`,
                                    //     pattern: {
                                    //         value: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
                                    //         message: `${t('formErrors.invalidDate')}`
                                    //     }
                                    // }}
                                />
                                {
                                    showPicker
                                        ? 
                                            <View className='mt-2 flex-row space-x-1 items-center justify-end'>
                                            {/* {!IS_ANDROID && <Text className='text-xs dark:text-white'>Click button to open date selector</Text>} */}
                                                <RNDateTimePicker
                                                    testID='dob'
                                                    value={new Date(dob)}
                                                    mode='date'
                                                    // display='default'
                                                    display={IS_ANDROID ? 'default' : 'inline'}
                                                    onChange={onChangeDate}
                                                />
                                            </View>
                                        : null
                                }
                                {dobError !== '' && <InputFormErrors message={dobError} />}
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myProfileForm.educationLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.educationPlaceholder')}`}
                                    value={educationLevelId}
                                    data={dropdown?.educationLevels || []}
                                    onSelected={(id: number) => {
                                        educationLevelError !== '' && setEducationLevelError('')
                                        setEducationLevelId(id)
                                    }}
                                />
                                {educationLevelId == 0 && educationLevelError !== '' && <InputFormErrors message={educationLevelError} />}
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myProfileForm.salaryLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.salaryPlaceholder')}`}
                                    useCode
                                    value={salaryRangeId}
                                    data={dropdown?.salaryRanges || []}
                                    onSelected={(id: number) => {
                                        salaryRangeError !== '' && setSalaryRangeError('')
                                        setSalaryRangeId(id)
                                    }}
                                />
                                {salaryRangeId == 0 && salaryRangeError !== '' && <InputFormErrors message={salaryRangeError} />}
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myProfileForm.employmentLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.employmentPlaceholder')}`}
                                    value={employmentTypeId}
                                    data={dropdown?.employmentTypes || []}
                                    onSelected={(id: number) => {
                                        employmentTypeError !== '' && setEmploymentTypeError('')
                                        setEmploymentTypeId(id)
                                    }}
                                />
                                {employmentTypeId == 0 && employmentTypeError !== '' && <InputFormErrors message={employmentTypeError} />}
                                <View className='my-4' />
                                <TextInput
                                    name='aboutme'
                                    label={`${t('editProfileScreen.myProfileForm.aboutMeLabel')}`}
                                    placeholder={`${t('editProfileScreen.myProfileForm.aboutMePlaceholder')}`}
                                    defaultValue={data?.bio || ''}
                                    // onChangeText={(e) => setLongText(e)}
                                    multiline
                                    numberOfLines={6}
                                    maxLength={maxLength}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                    rules={{
                                        required: `${t('formErrors.aboutme')}`,
                                    }}
                                />
                                {methods.formState.errors.aboutme && <InputFormErrors message={`${errorMessage?.aboutme?.message}`} />}
                                <View className='mt-1'>
                                    <Text className='self-end text-xs dark:text-white'>
                                        {`${methods.watch('aboutme') ? (methods.watch('aboutme').length) : 0} / ${maxLength}`}
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}