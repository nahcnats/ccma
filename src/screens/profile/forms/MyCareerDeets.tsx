import { 
    SafeAreaView,
    KeyboardAvoidingView,
    View, 
    ScrollView,
    Text, 
    TouchableOpacity,
    useColorScheme
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { queryClient } from '../../../App';
import { RootState } from '../../../store/store';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import Screen from '../../../components/common/Screen';
import { TextInput, DropdownSearch } from '../../../components/common/input';
import SubmitButton from '../../../components/common/SubmitButton';
import { dismissKeyboard, IS_ANDROID, showErrorToast, showSuccessToast } from '../../../utils';
import GOOGLE_KEY from '../../..//constants/google';
import { useUtilties, useAppSelector, useDebounce } from '../../../hooks';
import { useCreativeProfile } from '../hooks';
import { postOrangeTick } from '../../orangetick/services';

interface FormValues {
    position: string
    company: string
}

export default function MyCareerDeetsForm() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const ref = useRef<GooglePlacesAutocompleteRef>(null);
    const { ...methods } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [companyAddress, setCompanyAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data: dropdown } = useUtilties();
    const { data } = useCreativeProfile(payload);
    const [employmentTypeId, setEmploymentTypeId] = useState(data?.preferredEmploymentTypeIds[0] || 0);
    const [employmentTypeError, setEmploymentTypeError] = useState('');

    useEffect(() => {
        ref.current?.setAddressText(data?.currentPositionCompanyName || '')
    }, []);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isLoading) return;        

        try {
            setIsLoading(true);

            const payload = {
                token: token,
                params: {
                    creativesEmploymentPosition: 
                    {
                        employmentTypeId: 1,
                        positionTitle: data.position,
                        positionCompany: data.company,
                    },
                }
            }

            await postOrangeTick(payload);            
            await queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });

            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Career details saved');
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
                        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                            <View>
                                <TextInput
                                    name='position'
                                    label={`${t('editProfileScreen.myCareerDeetsForm.positionLabel')}`}
                                    placeholder={`${t('editProfileScreen.myCareerDeetsForm.positionPlaceholder')}`}
                                    defaultValue={data?.currentPositionTitle}
                                />
                                <View className='my-4' />
                                <DropdownSearch
                                    label={`${t('editProfileScreen.myCareerDeetsForm.jobLabel')}`}
                                    placeholder={`${t('editProfileScreen.myCareerDeetsForm.jobPlaceholder')}`}
                                    value={data?.currentPositionEmploymentTypeId}
                                    data={dropdown?.employmentTypes || []}
                                    onSelected={(id: number) => {
                                        employmentTypeError !== '' && setEmploymentTypeError('')
                                        setEmploymentTypeId(id)
                                    }}
                                />
                                <View className='my-4' />
                                    <TextInput
                                        name='company'
                                        label={`${t('editProfileScreen.myCareerDeetsForm.companyLabel')}`}
                                        placeholder={`${t('editProfileScreen.myCareerDeetsForm.companyPlaceholder')}`}
                                        defaultValue={data?.currentPositionCompanyName}
                                    />
                                {/* <DropdownSearch
                                    label={`${t('editProfileScreen.myCareerDeetsForm.companyLabel')}`}
                                    placeholder={`${t('editProfileScreen.myCareerDeetsForm.companyPlaceholder')}`}
                                    data={[]}
                                    onSelected={() => null}
                                /> */}
                                {/* <ScrollView horizontal={true} style={{ flex: 1 }}>
                                    <View className='flex-1'>
                                            <Text className='font-bold dark:text-white'>{t('editProfileScreen.myCareerDeetsForm.companyLabel')}</Text>
                                        <View className='my-1' />
                                        <GooglePlacesAutocomplete
                                            placeholder={`${t('vacancyFormScreen.addressPlaceholder')}`}
                                            ref={ref}
                                            textInputProps={{
                                                placeholderTextColor: colorScheme === 'dark' && colors.gray[300]
                                            }}
                                            onPress={(data, details = null) => {
                                                setCompanyAddress(data.description)
                                            }}
                                            query={{
                                                key: GOOGLE_KEY,
                                                language: 'en'
                                            }}
                                            styles={{
                                                textInputContainer: {
                                                    flex: 1,
                                                    backgroundColor: colors.white,
                                                    borderStyle: 'solid',
                                                    borderWidth: 1,
                                                    borderColor: colors.gray[300],
                                                    borderRadius: 6,
                                                },
                                                textInput: {
                                                    flex: 1,
                                                    width: 355,
                                                    height: IS_ANDROID ? 40 : 30,
                                                    paddingHorizontal: IS_ANDROID ? 8 : 6,
                                                }
                                            }}
                                        />
                                    </View>
                                </ScrollView> */}
                            </View>
                        </ScrollView>
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