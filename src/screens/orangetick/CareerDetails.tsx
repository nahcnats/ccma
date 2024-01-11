import { 
    SafeAreaView, 
    View, 
    useColorScheme, 
    KeyboardAvoidingView 
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch, useDebounce, useUtilties } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import OrangeTickProgress from '../../components/common/OrangeTickProgress';
import { OrangeTickFooter } from '../../components/orangetick';
import { IS_ANDROID, dismissKeyboard, showErrorToast } from '../../utils';
import { TextInput, InputFormErrors, DropdownSearch, dummyOptions } from '../../components/common/input';
import * as orangeTickActions from '../../store/actions/orangeTick';

interface FormValues {
    jobTitle: string
    company: string
}

export default function CareerDetailsScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const dispatch = useAppDispatch();
    const { debounce } = useDebounce();
    const { ...methods } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [jobType, setJobType] = useState(0);
    const [salaryRange, setSalaryRange] = useState(0);
    const [jobTypeError, setJobTypeError] = useState('');
    const [salaryRangeError, setSalaryRangeError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const { completionPercentage, completed } = useAppSelector((state: RootState) => state.orangeTick);
    const { data: dropdown, isSuccess: dropdownIsSuccess } = useUtilties();

    const resetCompleted = async () => {
        try {
            const payload = {
                completionPercentage: completionPercentage,
                completed: false,
            }

            const action = orangeTickActions.careerDeetsStep(payload);
            await dispatch(action);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    useFocusEffect(useCallback(() => {
        resetCompleted();
    }, [navigation]));

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isloading) return;

        if (jobType === 0) {
            const errTxt = t('onboarding.form.educationLevelError');
            setJobTypeError(errTxt);
            return;
        }

        if (salaryRange === 0) {
            const errTxt = 'Please select expected salary range';
            setSalaryRangeError(errTxt);
            return;
        }   
        
        try {
            setIsLoading(true);

            const payload = {
                completionPercentage: completionPercentage + 25,
                completed: true,
                jobType: jobType,
                salaryRange: salaryRange,
                jobTitle: data.jobTitle,
                company: data.company,
            }
            const action = orangeTickActions.careerDeetsStep(payload);
            await dispatch(action);

            navigation.navigate('LocationLinks');   
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
                    <FormProvider {...methods}>
                        <View className='flex-1 justify-between' onStartShouldSetResponder={dismissKeyboard}>
                            <View>
                                <OrangeTickProgress height={30} />
                                <View className='mt-4'>
                                    <DropdownSearch 
                                        label={`${t('editProfileScreen.myCareerDeetsForm.jobLabel')}`} 
                                        placeholder={`${t('editProfileScreen.myCareerDeetsForm.jobPlaceholder')}`}  
                                        data={dropdown?.workModes || []} 
                                        onSelected={(id: number) => {
                                            jobTypeError !== '' && setJobTypeError('')
                                            setJobType(id);
                                        }}
                                    />
                                    {jobType == 0 && jobTypeError !== '' && <InputFormErrors message={jobTypeError} />}
                                </View>
                                <View className='mt-4'>
                                    <DropdownSearch 
                                        label={`${t('editProfileScreen.myProfileForm.currentSalaryLabel')}`} 
                                        placeholder={`${t('editProfileScreen.myProfileForm.salaryPlaceholder')}`}  
                                        useCode
                                        data={dropdown?.salaryRanges || []} 
                                        onSelected={(id: number) => {
                                            salaryRangeError !== '' && setSalaryRangeError('')
                                            setSalaryRange(id);
                                        }}
                                    />
                                    {salaryRange == 0 && salaryRangeError !== '' && <InputFormErrors message={salaryRangeError} />}
                                </View>
                                <View className='mt-4'>
                                    <TextInput 
                                        name='jobTitle'
                                        label={`${t('editProfileScreen.myCareerDeetsForm.positionLabel')}`}
                                        placeholder={`${t('editProfileScreen.myCareerDeetsForm.positionPlaceholder')}`}
                                        autoCapitalize='sentences'
                                        rules={{
                                            required: `Your title or position is required`,
                                        }}
                                    />
                                    {methods.formState.errors.jobTitle && <InputFormErrors message={`${errorMessage?.jobTitle?.message}`} />}
                                </View>
                                <View className='mt-4'>
                                    <TextInput
                                        name='company'
                                        label={`${t('onboarding.form.companyname')}`}
                                        placeholder={`${t('onboarding.form.companynamePlaceholder')}`}
                                        autoCapitalize='sentences'
                                        rules={{
                                            required: `${t('formErrors.companyname')}`,
                                        }}
                                    />
                                    {methods.formState.errors.company && <InputFormErrors message={`${errorMessage?.company?.message}`} />}
                                </View>
                            </View>
                            <OrangeTickFooter onNextHandler={() => debounce(methods.handleSubmit(onSubmit, onError))} onPreviousHandler={() => navigation.goBack()} />
                        </View> 
                    </FormProvider>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}