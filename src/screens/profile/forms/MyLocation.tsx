import { SafeAreaView, View, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { queryClient } from '../../../App';
import { RootState } from '../../../store/store';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import Screen from '../../../components/common/Screen';
import { DropdownSearch } from '../../../components/common/input';
import SubmitButton from '../../../components/common/SubmitButton';
import { dismissKeyboard, IS_ANDROID, showErrorToast, showSuccessToast } from '../../../utils';
import { useAppSelector, useRefreshOnFocus, useDebounce } from '../../../hooks';
import { useCountriesDropdowns, useNationalitiesDropdowns } from '../../jobs/hooks';
import { getCitiesDropdowns } from '../../jobs/services';
import { GenericDropDownsType } from '../../../types/jobs';
import { useCreativeProfile } from '../hooks';
import { postOrangeTick } from '../../orangetick/services';

interface FormValues {
    title: string
    description: string
    responsibilities: string
    benefits: string
    manager: string
}

export default function MyLocationForm() {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const { ...methods } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [isLoading, setIsLoading] = useState(false);
    const payload = {
        token: token
    }
    const { data: nationalities, refetch: nationalitiesRefetch } = useNationalitiesDropdowns(payload);
    const { data: countries, refetch: countriesRefetch } = useCountriesDropdowns(payload);
    const { data, isSuccess } = useCreativeProfile(payload);
    const [nationality, setNationality] = useState(data?.nationalityId || 0);
    const [country, setCountry] = useState(data?.countryId || 0);
    const [city, setCity] = useState(data?.cityId || 0);
    const [cities, setCities] = useState<GenericDropDownsType[]>([]);
    useRefreshOnFocus(nationalitiesRefetch);
    useRefreshOnFocus(countriesRefetch);

    useEffect(() => {
        const countryId = data?.countryId || 0
        handleCountryChange(countryId);
    }, [isSuccess]);

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
        dismissKeyboard();

        if (isLoading) return;

        try {
            setIsLoading(true);

            const payload = {
                token: token,
                params: {
                    nationalityId: nationality,
                    countryId: country,
                    cityId: city
                }
            }

            await postOrangeTick(payload);
            await queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });

            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Location saved');
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
                    <FormProvider {...methods}>
                        <View onStartShouldSetResponder={dismissKeyboard} className='flex-1 justify-between'>
                            <View>
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myLocationForm.nationalityLabel')}`}
                                    placeholder={`${t('editProfileScreen.myLocationForm.nationalityPlaceholder')}`}
                                    value={nationality}
                                    data={nationalities || []}
                                    onSelected={(id: number) => setNationality(id)}
                                />
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myLocationForm.countryLabel')}`}
                                    placeholder={`${t('editProfileScreen.myLocationForm.countryPlaceholder')}`}
                                    value={country}
                                    data={countries || []}
                                    onSelected={(id: number) => handleCountryChange(id)}
                                />
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myLocationForm.cityLabel')}`}
                                    placeholder={`${t('editProfileScreen.myLocationForm.cityPlaceholder')}`}
                                    value={city}
                                    data={cities || []}
                                    onSelected={(id: number) => setCity(id)}
                                    disable={country === 0}
                                />
                            </View>
                            <SubmitButton
                                label={`${t('editProfileScreen.actions.save')}`}
                                isProcessing={isLoading}
                                isDisable={isLoading}
                                onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                            />
                        </View>
                    </FormProvider>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}