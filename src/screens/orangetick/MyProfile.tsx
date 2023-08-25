import { 
    ScrollView,
    SafeAreaView, 
    View, 
    Text, 
    TouchableOpacity, 
    useColorScheme, 
    KeyboardAvoidingView, 
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch, useUtilties, useDebounce } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import { OrangeTickFooter } from '../../components/orangetick';
import { IconCalendar, IconCheckCircle } from '../../assets/icons';
import { IS_ANDROID, dismissKeyboard, showErrorToast } from '../../utils';
import { TextInput, InputFormErrors, DropdownSearch } from '../../components/common/input';
import { minHeight } from '../../constants/others';
import OrangeTickProgress from '../../components/common/OrangeTickProgress';
import * as orangeTickActions from '../../store/actions/orangeTick';
import { maxLength } from '../../constants/others';

interface FormValues {
    aboutme: string
}

export default function MyProfileScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const { ...methods } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [selection, setSelection] = useState<number[]>([]);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dobError, setDobError] = useState('');
    const [educationLevel, setEducationLevel] = useState(0);
    const [educationLevelError, setEducationLevelError] = useState('');
    const [employmentTypeError, setEmploymentTypeError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const fDate = moment(date).format('YYYY-DD-MM');
    const { token } = useAppSelector((state: RootState) => state.auth);
    const { completionPercentage, completed } = useAppSelector((state: RootState) => state.orangeTick);
    const { data: dropdown, isSuccess: dropdownIsSuccess } = useUtilties();

    const resetCompleted = async () => {
        try {
            const payload = {
                completionPercentage: completionPercentage,
                completed: false,
            }
            const action = orangeTickActions.profileStep(payload);
            await dispatch(action);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    useFocusEffect(useCallback(() => {
        resetCompleted();
    }, [navigation]));

    const employmentTypeSelectionHandler = (id: number) => {
        if (selection.find(selected => selected === id)) {
            let newSelection = [...selection];

            const checkSelected = (item: number) => {
                return item === id;
            }

            const index = newSelection.findIndex(checkSelected);

            newSelection.splice(index, 1);

            setSelection(newSelection);

            return;   
        }

        setSelection(prev => [...prev, id]);
    }

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setShowPicker(!IS_ANDROID)
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isloading) return;

        if (!date) {
            const errTxt = t('formErrors.dob')
            setDobError(errTxt);
            return;
        }

        if (educationLevel === 0) {
            const errTxt = t('onboarding.form.educationLevelError');
            setEducationLevelError(errTxt);
            return;
        }

        if (!selection.length) {
            const errTxt = t('formErrors.employmentTypesError');
            setEmploymentTypeError(errTxt);
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                completionPercentage: completionPercentage + 25,
                completed: true,
                dateOfBirth: moment(date).format('YYYY-MM-DD'),
                educationLevel: educationLevel,
                employmentType: selection,
                aboutMe: data.aboutme,
            }
            const action = orangeTickActions.profileStep(payload);
            await dispatch(action);

            setIsLoading(false);
            navigation.navigate('CareerDetails');    
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
                        <FormProvider {...methods}>
                            <View className='flex-1 justify-between' onStartShouldSetResponder={dismissKeyboard}>
                                <View>
                                    <OrangeTickProgress height={30} />
                                    <View className='mt-4'>
                                        <TextInput 
                                            name='dob'
                                            value={fDate}
                                            label={`${t('editProfileScreen.myProfileForm.dobLabel')}`}
                                            placeholder={`${t('editProfileScreen.myProfileForm.dobPlaceholder')}`}
                                            rightIcon={<TouchableOpacity onPress={() => setShowPicker(v => !v)}><IconCalendar size={16} color={colors.black} /></TouchableOpacity>}
                                            // rules={{
                                            //     required: `${t('formErrors.dob')}`,
                                                // pattern: {
                                                //     value: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
                                                //     message: `${t('formErrors.invalidDate')}`
                                                // }
                                            // }}
                                        />
                                        {
                                            showPicker 
                                                ? 
                                                    <View className='mt-2 flex-row space-x-1 items-center justify-end'>
                                                    {/* { !IS_ANDROID && <Text className='text-xs dark:text-white'>Click button to open date selector</Text> } */}
                                                        <RNDateTimePicker
                                                            testID='DOB'
                                                            value={date}
                                                            mode='date'
                                                            // display='default'
                                                            display={IS_ANDROID ? 'default' : 'inline'}
                                                            onChange={onChangeDate}
                                                        />
                                                    </View>
                                            : null
                                        }
                                        {dobError !== '' && <InputFormErrors message={dobError} />}
                                    </View>
                                    <View className='mt-4'>
                                        <DropdownSearch 
                                            label={`${t('editProfileScreen.myProfileForm.educationLabel')}`}
                                            // placeholder='Select the employment type'  
                                            placeholder={`${t('editProfileScreen.myProfileForm.educationPlaceholder')}`}
                                            data={dropdown?.educationLevels || []} 
                                            onSelected={(id: number) => {
                                                educationLevelError !== '' && setEducationLevelError('')
                                                setEducationLevel(id);
                                            }}
                                        />
                                        {educationLevel == 0 && educationLevelError !== '' && <InputFormErrors message={educationLevelError} />}
                                    </View>
                                    <View className='mt-4'>
                                        <View>
                                            <Text className={`font-bold ${colorScheme === 'dark' && 'text-white'}`}>{t('editProfileScreen.myProfileForm.employmentLabel')}</Text>
                                            <View className='flex-row flex-wrap space-x-1 justify-center'>
                                                {
                                                    dropdown && dropdown?.employmentTypes.map((item, index) => 
                                                        <TouchableOpacity 
                                                            key={item.id} 
                                                            className={`rounded-md py-1 px-4 mt-4 ${selection.find(selected => selected === item.id) ? 'bg-amber-400' : 'bg-gray-200'}`}
                                                            onPress={() => {
                                                                employmentTypeError !== '' && setEmploymentTypeError('')
                                                                employmentTypeSelectionHandler(item.id)
                                                            }}
                                                        >
                                                            <View className='flex-row'>
                                                                <Text>{item.value}</Text>
                                                                {selection.find(selected => selected === item.id) ? <IconCheckCircle size={16} color={colors.black} style={{marginLeft: 10}} /> : null}
                                                            </View>
                                                        </TouchableOpacity>)
                                                }
                                            </View>
                                        </View>
                                        {!selection.length && employmentTypeError !== '' && <InputFormErrors message={employmentTypeError} />}
                                    </View>
                                    <View className='mt-4'>
                                        <View>
                                            <TextInput 
                                                name='aboutme'
                                                label='About Me'
                                                placeholder='Tell us about yourself'
                                                autoCapitalize='sentences'
                                                multiline 
                                                numberOfLines={6} 
                                                style={{
                                                    minHeight: minHeight
                                                }}
                                                minHeight={minHeight}
                                                maxLength={maxLength}
                                                rules={{
                                                    required: `${t('formErrors.aboutme')}`,
                                                }}
                                            />
                                            <View className='mt-1'>
                                                <Text className='self-end text-xs dark:text-white'>
                                                    { `${methods.watch('aboutme') ? (methods.watch('aboutme').length) : 0} / ${maxLength}` }
                                                </Text>
                                            </View>
                                            {methods.formState.errors.aboutme && <InputFormErrors message={`${errorMessage?.aboutme?.message}`} />}
                                        </View>
                                    </View>
                                </View>
                                <View className='my-4' />
                                <OrangeTickFooter onNextHandler={() => debounce(methods.handleSubmit(onSubmit, onError))} onPreviousHandler={() => navigation.goBack()} />
                            </View> 
                        </FormProvider>
                    </ScrollView>
                </Screen>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}