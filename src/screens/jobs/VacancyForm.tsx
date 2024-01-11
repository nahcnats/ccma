import { SafeAreaView, KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import colors from 'tailwindcss/colors';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import SubmitButton from '../../components/common/SubmitButton';
import { TokenSelector } from '../../components/jobs';
import Loading from '../../components/common/Loading';
import { InputFormErrors } from '../../components/common/input';
import { TextInput, DropdownSearch, MultiSelector } from '../../components/common/input';
import { IS_ANDROID, dismissKeyboard, showErrorToast, showSuccessToast } from '../../utils';
import { RootState } from '../../store/store';
import { useAppSelector, useDebounce, useAppDispatch } from '../../hooks';
import { useJobDropdowns, useCountriesDropdowns, useAddJob } from './hooks';
import * as authActions from '../../store/actions/auth';
import { minHeight } from '../../constants/others';
import GOOGLE_KEY from '../../constants/google';
import { GenericDropDownsType } from '../../types/jobs';
import { getCitiesDropdowns } from './services';
import { AddJobProps } from './services';

type Props = StackScreenProps<MainNavigationParams, 'VacancyForm'>;

interface FormValues {
    title: string
    description: string
    responsibilities: string
    benefits: string
    manager: string
}

export default function VacancyFormScreen({ route }: Props) {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { employmentTypeId, isPaidJob, tokenId, tokenName } = route.params;
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { ...methods } = useForm<FormValues>();
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const [salaryRange, setSalaryRange] = useState<number>(0);
    const [workType, setWorkType] = useState<number>(0);;
    const [workDays, setWorkDays] = useState<number>(0);;
    const [experience, setExperience] = useState<number[]>([]);
    const [education, setEducation] = useState<number[]>([]);
    const [country, setCountry] = useState<number>(0);
    const [cities, setCities] = useState<GenericDropDownsType[]>([]);
    const [city, setCity] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const payload = {
        token: token
    }

    const {data, isLoading, isError, error: rqError } = useJobDropdowns(payload);
    const { data: countries, isLoading: countriesIsLoading, isError: countriesIsError, error: countriesError, refetch: countriesRefetch } = useCountriesDropdowns(payload);
    const { mutateAsync: addJob } = useAddJob();

    if (isLoading || countriesIsLoading) {
        return <Loading />
    }

    if (isError || countriesIsError) {
        const errorMessage = isError ? rqError : countriesError;

        if (!errorMessage) {
            return null;
        }

        showErrorToast(t('promptTitle.error'), errorMessage.message);
        navigation.goBack();
    }

    const canSubmit = () => {
        if (salaryRange === 0 || workType === 0 || workDays === 0 || !experience.length || !education.length || city === 0) {
            return false;
        }

        return true;
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }

    const handleCountryChange = async (id: number) => {
        try {
            const payload = {
                token: token,
                params: {
                    id: id
                }
            }

            const res = await getCitiesDropdowns(payload);

            setCountry(id);
            setCities(res);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => { 
        setIsSubmitting(true);

        try {
            const payload = {
                token: token,
                params: {
                    title: data.title,
                    salaryRangeIds: [salaryRange],
                    workLocationIds: [city],
                    workModeIds: [workType],
                    workingDayIds: [workDays],
                    educationLevelIds: education,
                    employmentTypeIds: [employmentTypeId],
                    experienceLevelIds: experience,
                    description: data.description,
                    duties: data.responsibilities,
                    benefits: data.benefits,
                    hiringManager: data.manager,
                    publishingStatus: "PUBLISHED", // Todo, change in future.
                    isPaidJob: isPaidJob,
                    tokenId: tokenId
                }
            }

            await addJob(payload);

            setIsSubmitting(false);

            showSuccessToast(t('promptTitle.success'), t('vacancyFormScreen.prompts.jobAddedSuccess'));

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'JobsTab',
                    params: {
                        screen: 'OpenJobs'
                    }
                }
            });
        } catch (error: any) {
            setIsSubmitting(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Screen>
                        <View onStartShouldSetResponder={dismissKeyboard}>
                            <FormProvider {...methods}>
                                <ScreenTitle title={t('vacancyFormScreen.screenTitle')}/>
                                <View className='my-4' />
                                <Text>{t('jobScreen.tokenUsed', {tokenName: tokenName})}</Text>
                                <View className='my-4' />
                                <TextInput 
                                    name='title'
                                    placeholder={`${t('vacancyFormScreen.jobTitlePlaceholder')}`}
                                    label={`${t('vacancyFormScreen.jobTitleLabel')}`}
                                    rules={{
                                        required: `${t('vacancyFormScreen.jobTitleRuleText')}`
                                    }}
                                    height={IS_ANDROID ? 40 : undefined}
                                />
                                {methods.formState.errors.title && <InputFormErrors message={`${errorMessage?.title?.message}`} />}
                                <View className='my-2' />
                                <TextInput 
                                    name='description'
                                    placeholder={`${t('vacancyFormScreen.jobDescPlaceholder')}`}
                                    label={`${t('vacancyFormScreen.jobDescLabel')}`}
                                    rules={{
                                        required: `${t('vacancyFormScreen.jobDescRuleText')}`
                                    }}
                                    height={IS_ANDROID ? 40 : undefined}
                                />
                                <View className='my-2' />
                                <DropdownSearch 
                                    label={`${t('vacancyFormScreen.salaryRangeLabel')}`}
                                    placeholder={`${t('vacancyFormScreen.salaryRangePlaceholder')}`} 
                                    data={data?.salaryRanges || []} 
                                    onSelected={(id: number) => setSalaryRange(id)}
                                />
                                <View className='my-2' />
                                <DropdownSearch 
                                    label={`${t('vacancyFormScreen.workTypeLabel')}`} 
                                    placeholder={`${t('vacancyFormScreen.workTypePlaceholder')}`} 
                                    data={data?.workModes || []} 
                                    onSelected={(id: number) => setWorkType(id)}
                                />
                                <View className='my-2' />
                                <DropdownSearch
                                    label={`${t('vacancyFormScreen.countryLabel')}`} 
                                    placeholder={`${t('vacancyFormScreen.countryPlaceholder')}`}
                                    data={countries || []}
                                    onSelected={(id: number) => handleCountryChange(id)}
                                />
                                <View className='my-2' />
                                <DropdownSearch
                                    label={`${t('vacancyFormScreen.cityLabel')}`}
                                    placeholder={`${t('vacancyFormScreen.cityPlaceholder')}`}
                                    data={cities || []}
                                    onSelected={(id: number) => setCity(id)}
                                    disable={country === 0}
                                />
                                <View className='my-2' />
                                <DropdownSearch 
                                    label={`${t('vacancyFormScreen.workDaysLabel')}`} 
                                    placeholder={`${t('vacancyFormScreen.workDaysPlaceholder')}`}  
                                    data={data?.workingDays || []} 
                                    onSelected={(id: number) => setWorkDays(id)}
                                />
                                <View className='my-2' />
                                <TextInput
                                    name='responsibilities'
                                    placeholder={`${t('vacancyFormScreen.responsibilitiesPlaceholder')}`}
                                    label={`${t('vacancyFormScreen.responsibilitiesLabel')}`}
                                    multiline
                                    numberOfLines={6} 
                                    textAlignVertical='top'
                                    rules={{
                                        required: `${t('vacancyFormScreen.responsibilitiesRuleText')}`
                                    }}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                />
                                {methods.formState.errors.responsibilities && <InputFormErrors message={`${errorMessage?.responsibilities?.message}`} />}
                                <View className='my-2' />
                                <TextInput
                                    name='benefits'
                                    placeholder={`${t('vacancyFormScreen.benefitsPlaceholder')}`}
                                    label={`${t('vacancyFormScreen.benefitsLabel')}`}
                                    multiline 
                                    numberOfLines={6} 
                                    textAlignVertical='top'
                                    rules={{
                                        required: `${t('vacancyFormScreen.benefitsRuleText')}`
                                    }}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                />
                                {methods.formState.errors.benefits && <InputFormErrors message={`${errorMessage?.benefits?.message}`} />}
                                <View className='my-2' />
                                <MultiSelector
                                    label={`${t('vacancyFormScreen.experienceLabel')}`}
                                    placeholder={`${t('vacancyFormScreen.experiencePlaceholder')}`}
                                    data={data?.experienceLevels || []}
                                    onSelectedItems={(item: any) => setExperience(item)}
                                    dropdownPosition='top'
                                />
                                <View className='my-2' />
                                <MultiSelector
                                    label={`${t('vacancyFormScreen.educationLabel')}`}
                                    placeholder={`${t('vacancyFormScreen.educationPlaceholder')}`}
                                    data={data?.educationLevels || []}
                                    onSelectedItems={(item: any) => setEducation(item)}
                                    dropdownPosition='top'
                                />
                                <View className='my-2' />
                                <TextInput
                                    name='manager'
                                    placeholder={`${t('vacancyFormScreen.managerPlaceholder')}`}
                                    label={`${t('vacancyFormScreen.managerLabel')}`}
                                    rules={{
                                        required: `${t('vacancyFormScreen.managerRuleText')}`
                                    }}
                                    height={IS_ANDROID ? 40 : undefined}
                                />
                                {methods.formState.errors.manager && <InputFormErrors message={`${errorMessage?.manager?.message}`} />}
                                <View className='my-5' />
                                <SubmitButton 
                                    label={t('applyJobScreen.actions.submit')} 
                                    isDisable={!canSubmit() || isSubmitting}
                                    isProcessing={isSubmitting}
                                    onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                                />
                            </FormProvider>
                        </View>
                    </Screen>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}