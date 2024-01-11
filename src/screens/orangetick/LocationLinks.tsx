import { 
    SafeAreaView,
    ScrollView, 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
    useColorScheme,
    KeyboardAvoidingView,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import DocumentPicker, {
    isInProgress,
    types
} from 'react-native-document-picker';

import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch, useUtilties, useDebounce, useNationalities } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import OrangeTickProgress from '../../components/common/OrangeTickProgress';
import { OrangeTickFooter } from '../../components/orangetick';
import { IconDelete, IconFile, IconCheckCircle } from '../../assets/icons';
import { showErrorToast, showSuccessToast, showWarnToast } from '../../utils';
import { queryClient } from '../../App';
import * as orangeTickActions from '../../store/actions/orangeTick';
import { useCreativeProfile } from '../profile/hooks';
import { minHeight } from '../../constants/others';
import { IS_ANDROID } from '../../utils';
import { TextInput, InputFormErrors, DropdownSearch, dummyOptions } from '../../components/common/input';
import { LocationDataType } from '../../types/common';
import { convertFileToBase64 } from '../../utils';
import { UploadCvProps, getCitiesDropdowns } from '../jobs/services';
import { useAddCreativeCv, useCreativeCvs, useDeleteCreativeCv } from '../jobs/hooks';
import { ResumeItem } from '../../components/jobs';
import EmptyResume from '../../components/jobs/EmptyResume';
import DynamicTextInput from '../../components/common/input/DynamicTextInput';
import { urlPattern } from '../../constants/others';
import { useCountriesDropdowns, useNationalitiesDropdowns } from '../jobs/hooks';
import { GenericDropDownsType } from '../../types/jobs';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormValues {
    portfolio: string
    website: string
}

export default function LocationLinksScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const dispatch = useAppDispatch()
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { ...methods } = useForm<FormValues>();
    // const [nationalities, setNationalities] = useState<LocationDataType[]>([]);
    const [countries, setCountries] = useState<LocationDataType[]>([]);
    const [states, setStates] = useState<LocationDataType[]>([]);
    const [nationality, setNationality] = useState(0);
    const [country, setCountry] = useState(0);
    const [state, setState] = useState(0);
    const [cities, setCities] = useState<GenericDropDownsType[]>([]);
    const [city, setCity] = useState(0);
    const [nationalityError, setNationalityError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [stateError, setStateError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [urlErrorText, setUrlErrorText] = useState('');

    const [portfolioText, setPortfolioText] = useState('https://');
    const [numPortfolios, setNumPortfolios] = useState(1);
    const refPortfolios = useRef<string[]>([portfolioText]);

    const [websiteText, setWebsiteText] = useState('https://');
    const [numWebsites, setNumWebsites] = useState(1);
    const refWebsites = useRef<string[]>([websiteText]);

    const [selectedCV, setSelectedCv] = useState<number>(0);

    const { token } = useAppSelector((state: RootState) => state.auth);
    const { completionPercentage, completed, resumeUrls } = useAppSelector((state: RootState) => state.orangeTick);
    const { data: dropdown, isSuccess: dropdownIsSuccess } = useUtilties();
    const { data: nationalities, isSuccess: nationalitiesIsSuccess } = useNationalities();
    const { mutateAsync: addCv } = useAddCreativeCv();
    const { mutateAsync: deleteCv } = useDeleteCreativeCv();
    const { data: cvData, isError, error: rqError } = useCreativeCvs(token);
    
    useEffect(() => {
        // const newNationalities = dropdown?.locationsData && dropdown?.locationsData.filter(item => item.type === 'NATIONALITY');
        const newCountries = dropdown?.locationsData && dropdown?.locationsData.filter(item => item.type === 'COUNTRY');
        // const newStates = dropdown?.locationsData && dropdown?.locationsData.filter(item => item.type === 'STATE');
        
        // if (newNationalities?.length) {
        //     setNationalities(newNationalities);
        // }

        if (newCountries?.length) {
            setCountries(newCountries);
        }



    }, [dropdownIsSuccess])

    const resetCompleted = async () => {
        try {
            const payload = {
                completionPercentage: completionPercentage,
                completed: false
            }
            const action = orangeTickActions.linksStep(payload);
            await dispatch(action);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    useFocusEffect(useCallback(() => {
        resetCompleted();
    }, [navigation]));

    const handleError = (err: any) => {
        if (DocumentPicker.isCancel(err)) {
            // console.warn('cancelled');
            showWarnToast(t('promptTitle.info'), t('applyJobScreen.prompts.cancelPicker'));
        } else if (isInProgress(err)) {
            // console.warn('multiple pickers were opened, only the last will be considered');
            showWarnToast(t('promptTitle.info'), t('applyJobScreen.prompts.multiplePickerOpened'));
        } else {
            // throw err;
            showErrorToast(t('promptTitle.error'), err.message);
        }
    }

    const documentPickerHandler = useCallback(async () => {
        setIsLoading(true);

        const storedNationality = await AsyncStorage.getItem('storedNationality');
        const storedCountry = await AsyncStorage.getItem('storedCountry');
        const storedCity = await AsyncStorage.getItem('storedCity');

        console.log(storedNationality, storedCountry, storedCity)


        try {
            const pickerResult = await DocumentPicker.pickSingle({
                type: types.pdf,
                mode: 'import',
            });

            if (!pickerResult) {
                return;
            }

            const path = pickerResult.uri;

            if (!path) {
                return;
            }

            const convertedFile = await convertFileToBase64(path);

            if (!convertFileToBase64) {
                return;
            }

            let fileName = '';

            if (pickerResult.name) {
                fileName = pickerResult?.name.split('.pdf')[0]
            }

            const payload: UploadCvProps = {
                token: token,
                params: {
                    fileData: convertedFile || '',
                    fileName: fileName,
                }

            }
            const uploadResult = await addCv(payload);

            if (!uploadResult) {
                setIsLoading(false);
                return;
            }

            uploadResult

            const action = orangeTickActions.linksStep({
                completionPercentage: completionPercentage,
                completed: false,
                resumeUrls: []
            });

            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), t('applyJobScreen.fileUploadSuccess'));
        } catch (error: unknown) {
            setIsLoading(false);
            // handleError(error);
            handleError(new Error('Ensure filename have no spaces and try again'));
        }
    }, []);

    const deleteCvHandler = async (uploadId: number) => {
        try {
            const payload = {
                token: token,
                params: {
                    uploadId: uploadId
                }
            }

            await deleteCv(payload);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const setPortfolioValue = useCallback((index: number, value: string) => {
        const inputs = refPortfolios.current;
        inputs[index] = value;
        setPortfolioText(value);
    }, []);
    
    const addPortfolio = useCallback(() => {
        refPortfolios.current.push('https://');
        setNumPortfolios(value => value + 1);
    }, []);

    const removePortfolio = useCallback((index: number) => {
        refPortfolios.current.splice(index, 1)[0];
        setNumPortfolios(value => value - 1);
    }, []);

    const setWebsiteValue = useCallback((index: number, value: string) => {
        const inputs = refWebsites.current;
        inputs[index] = value;
        setWebsiteText(value);
    }, []);
    
    const addWebsite = useCallback(() => {
        refWebsites.current.push('https://');
        setNumWebsites(value => value + 1);
    }, []);

    const removeWebsite = useCallback((index: number) => {
        refWebsites.current.splice(index, 1)[0];
        setNumWebsites(value => value - 1);
    }, []);

    const handleNationalityChange = async (id: number) => {
        nationalityError !== '' && setNationalityError('');
        setNationality(id);
        // await AsyncStorage.setItem('storeNationality', id.toString());
    };

    const handleCountryChange = async (id: number) => {
        countryError !== '' && setCountryError('')

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
    };

    const handleCityChange = async (id: number) => {
        stateError !== '' && setStateError('')
        setCity(id);
    };

    const onNextHandler = async () => {
        if (isLoading) return;

        if (nationality === 0) {
            const errTxt = 'Nationality is required';
            setNationalityError(errTxt);
            return;
        }

        if (country === 0) {
            const errTxt = 'Country is required';
            setCountryError(errTxt);
            return;
        }

        if (city === 0) {
            const errTxt = 'City is required';
            setStateError(errTxt);
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                completionPercentage: completionPercentage + 25,
                completed: true,
                nationality: nationality,
                country: country,
                // state: state,
                city: city,
                portfolioUrl: refPortfolios.current,
                websiteUrls: refWebsites.current,
            }

            const action = orangeTickActions.linksStep(payload);
            await dispatch(action);    
            
            setIsLoading(false);
            navigation.navigate('Congrats');
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Screen>
                        <View className='flex-1 justify-between'>
                            <View>
                                <OrangeTickProgress height={30} />
                                <View className='mt-4'>
                                    <DropdownSearch 
                                        label={`${t('editProfileScreen.myLocationForm.nationalityLabel')}`} 
                                        data={nationalities?.locationsData || []} 
                                        value={nationality}
                                        onSelected={(id: number) => handleNationalityChange(id)}
                                    />
                                    {nationality == 0 && nationalityError !== '' && <InputFormErrors message={nationalityError} />}
                                </View>
                                <View className='mt-4 flex-row justify-between space-x-2'>
                                    <View className='flex-1'>
                                        <DropdownSearch 
                                            label={`${t('editProfileScreen.myLocationForm.countryLabel')}`}  
                                            data={countries} 
                                            value={country}
                                            // onSelected={(id: number) => {
                                            //     countryError !== '' && setCountryError('')
                                            //     setCountry(id);
                                            // }}
                                            onSelected={(id: number) => handleCountryChange(id)}
                                        />
                                        {country == 0 && countryError !== '' && <InputFormErrors message={countryError} />}
                                    </View>
                                    <View className='flex-1'>
                                        <DropdownSearch 
                                            label={`${t('editProfileScreen.myLocationForm.stateLabel')}`}  
                                            // data={cities} 
                                            // onSelected={(id: number) => {
                                            //     stateError !== '' && setStateError('')
                                            //     setCity(id);
                                            // }}
                                            data={cities || []}
                                            value={city}
                                            onSelected={(id: number) => handleCityChange(id)}
                                            disable={country === 0}
                                        />
                                        {state == 0 && stateError !== '' && <InputFormErrors message={stateError} />}
                                    </View>
                                </View>
                                <View className='h-[0.3] my-12 bg-gray-500 w-full' />

                                <View>
                                    <View className='flex-row justify-between items-center mr-3'>
                                        <View>
                                            <Text className={`font-bold ${colorScheme === 'dark' && 'text-white'}`}>{t('editProfileScreen.myLinksForm.addPortFolio')}</Text>
                                            <Text className='text-xs dark:text-white'>{t('editProfileScreen.myLinksForm.addLinksDesc')}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={addPortfolio}
                                            disabled={
                                                refPortfolios.current.some(item => item === '')
                                            }
                                        >
                                            <Text className={`text-2xl ${refPortfolios.current.some(item => item === '') && 'text-gray-300'} ${colorScheme === 'dark' && 'text-white'}`}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {refPortfolios.current.map((item, i) => 
                                        <View key={i} className='flex-row items-center space-x-3'>
                                            <DynamicTextInput
                                                key={i}
                                                index={i}
                                                value={refPortfolios.current[i]}
                                                placeholder='https://www.portfolio.com'
                                                onChangeText={(value) => setPortfolioValue(i, value)}
                                                onRemove={() => removePortfolio(i)}
                                            />
                                        </View>
                                    )}
                                </View>

                                <View className='mt-4'>
                                    <View className='flex-row justify-between items-center mr-3'>
                                        <View>
                                            <Text className={`font-bold ${colorScheme === 'dark' && 'text-white'}`}>{t('editProfileScreen.myLinksForm.addWebsite')}</Text>
                                            <Text className='text-xs dark:text-white'>{t('editProfileScreen.myLinksForm.addLinksDesc')}</Text>
                                        </View>
                                        
                                        <TouchableOpacity
                                            onPress={addWebsite}
                                            disabled={
                                                refWebsites.current.some(item => item === '')
                                            }
                                        >
                                            <Text className={`text-2xl ${refPortfolios.current.some(item => item === '') && 'text-gray-300'} ${colorScheme === 'dark' && 'text-white'}`}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {refWebsites.current.map((item, i) =>
                                        <View key={i} className='flex-row items-center space-x-3'>
                                            <DynamicTextInput
                                                key={i}
                                                index={i}
                                                value={refWebsites.current[i]}
                                                placeholder='https://www.website.com'
                                                onChangeText={(value) => setWebsiteValue(i, value)}
                                                onRemove={() => removeWebsite(i)}
                                            />
                                        </View>
                                    )}
                                </View>
                                
                                <View className='mt-4'>
                                    <View className='flex-row justify-between items-center mr-3'>
                                        <Text className={`font-bold ${colorScheme === 'dark' && 'text-white'}`}>Add Resume</Text>
                                        <TouchableOpacity
                                            onPress={documentPickerHandler}
                                            // disabled={disableResume}
                                        >
                                            <Text className={`text-2xl ${colorScheme === 'dark' && 'text-white'}`}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className='my-2' />
                                    <SafeAreaView>
                                        <ScrollView 
                                            horizontal={true} 
                                            contentContainerStyle={{
                                                flex: 1
                                            }}
                                            scrollEnabled={false} 
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            <FlatList
                                                data={cvData}
                                                contentContainerStyle={{
                                                    flexGrow: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                                renderItem={({ item, index }) => <ResumeItem
                                                    key={item.uploadId}
                                                    data={item}
                                                    // showCheck
                                                    checked={selectedCV === item.uploadId}
                                                    onItemChange={() => setSelectedCv(item.uploadId)}
                                                    onDelete={() => debounce(() => deleteCvHandler(item.uploadId))}
                                                />
                                                }
                                                ListEmptyComponent={<EmptyResume />}
                                                showsVerticalScrollIndicator={false}
                                            />
                                            <View className='pb-12' />
                                        </ScrollView>
                                    </SafeAreaView>
                                </View>
                            </View>
                        </View> 
                    </Screen>
                </ScrollView>
                <View className='mx-4 mt-4'>
                    <OrangeTickFooter onNextHandler={onNextHandler} onPreviousHandler={() => navigation.goBack()} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}