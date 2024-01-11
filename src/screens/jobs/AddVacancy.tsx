import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LottieView from 'lottie-react-native';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import { TokenSelector } from '../../components/jobs';
import SubmitButton from '../../components/common/SubmitButton';
import Loading from '../../components/common/Loading';
import ActionSheet from '../../components/common/ActionSheet';
import AnimatedImage from '../../components/animated-image/Animated-image';
import { IconCheckCircle } from '../../assets/icons';
import { useDebounce, useAppSelector, useRefreshOnFocus } from '../../hooks';
import { RootState } from '../../store/store';
import { useJobDropdowns, useTokensCount, useCountriesDropdowns, useCitiesDropdowns } from './hooks';
import { showErrorToast, showWarnToast } from '../../utils';
import { JobDropdownsType } from '../../types/jobs';
import { isError } from 'react-query';

const AddVacancyScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [selected, setSelected] = useState<number>(0);
    const [isSelectedPaidJob, setIsSelectedPaidJob] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [goldTokens, setGoldTokens] = useState(0);
    const [diamondTokens, setDiamondTokens] = useState(0);
    const [tokenType, setTokenType] = useState('BASIC');
    const { debounce } = useDebounce();
    const animationRef = useRef<LottieView>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const payload = {
        token: token
    }
    const { data: tokensCount, isLoading: tokensCountIsLoading, isSuccess: tokenCountIsSuccess, isError: tokensCountIsError, error: tokensCountError, refetch: tokensCountRefetch } = useTokensCount(payload);
    const { data: dropDowns, isLoading: dropDownsIsLoading, isError: dropDownsIsError, error: dropDownsError, refetch: dropDownsRefetch } = useJobDropdowns(payload);
    useRefreshOnFocus(dropDownsRefetch);

    useEffect(()=> {
        const newGoldTokens = tokensCount?.find(item => item.tokenId === 1)?.totalTokens || 0;
        const newDiamondTokens = tokensCount?.find(item => item.tokenId === 2)?.totalTokens || 0;

        setGoldTokens(newGoldTokens);
        setDiamondTokens(newDiamondTokens);
    }, [tokenCountIsSuccess]);

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef.current?.dismiss();
    }, [isOpen]);

    const handleSheetChanges = useCallback(() => {
        setIsOpen(v => !v);

        if (isOpen) {
            bottomSheetModalRef.current?.dismiss();
        } else {
            bottomSheetModalRef.current?.present();
        }
    }, [isOpen]);

    const tokenChangeHandler = (value: string) => {
        setTokenType(value);
    }

    if (tokensCountIsLoading || dropDownsIsLoading) {
        return <Loading />
    }

    if (tokensCountIsError || dropDownsIsError) {
        let message;

        if (tokensCountError) {
            message = tokensCountError.message;
        }

        if (dropDownsError) {
            message = dropDownsError.message;
        }

        if (message) {
            showErrorToast(t('promptTitle.error'), message);
        }
        
        navigation.goBack();
    }

    const selectedEmploymentTypeJobHandler = (id: number) => {
        setSelected(id);
        
        const picked = dropDowns?.employmentTypes.find(item => item.id === id);

        setIsSelectedPaidJob(picked?.isPaidJob || false)
    }

    const jtImage = (value: string) => {
        let image;

        if (value === 'fulltime') {
            image = require('../../assets/images/fullTime.png');
        }

        if (value === 'parttime') {
            image = require('../../assets/images/partTime.png');
        }

        if (value === 'freelance') {
            image = require('../../assets/images/freelancer.png');
        }

        if (value === 'internship') {
            image = require('../../assets/images/internship.png');
        }

        if (value === 'contract') {
            image = require('../../assets/images/contract.png');
        }

        return image;
    }

    const confirmHandler = () => {
        closeBottomSheet();

        if (!tokensCount) return;

        if (tokenType === 'BASIC') {
            if (isSelectedPaidJob) {
                if (goldTokens <= 0) {
                    showWarnToast(t('promptTitle.attention'), t('jobScreen.prompts.insufficientToken'));
                    return;
                }
            }
        } else {
            if (isSelectedPaidJob) {
                if (diamondTokens <= 0) {
                    showWarnToast(t('promptTitle.attention'), t('jobScreen.prompts.insufficientToken'));
                    return;
                }
            }
        }

        const tokenId = tokenType === 'BASIC' 
            ? tokensCount.find(item => item.tokenId === 1)?.tokenId
            : tokensCount.find(item => item.tokenId === 2)?.tokenId

        navigation.navigate('VacancyForm', { 
            employmentTypeId: selected, 
            isPaidJob: isSelectedPaidJob, 
            tokenId: tokenId || 0,
            tokenName: tokenType === 'BASIC' ? 'BASIC' : 'PREMIUM',
        });
    }

    const JobItem = ({ id, value }: JobDropdownsType['employmentTypes'][0] ) => {
        return (
            <View key={id}>
                <TouchableOpacity
                    className='relative overflow-hidden rounded-lg'
                    onPress={() => selectedEmploymentTypeJobHandler(id)}
                >
                    <FastImage
                        source={jtImage(value.trim().toLowerCase().replace(/\s/g, ""))}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{ width: 400, height: 160 }}
                    />
                    <View className='flex-row space-x-2 px-2 py-4 bg-gray-100'>
                        <IconCheckCircle size={15} color={selected === id ? colors.green[500] : colors.slate[400]} />
                        <Text className={selected === id ? 'text-green-500' : 'text-slate-400'}>{t(`jobScreen.availableJobs.${value.trim().toLowerCase().replace(/\s/g, "")}`)}</Text>
                    </View>
                </TouchableOpacity>
                <View className='my-2' />
            </View>
        );
    }

    const PaidJobs = () => {
        return (
            <>
                <View className='mb-6'>
                    <View>
                        <Text className='text-lg font-bold dark:text-white'>{t('jobScreen.paidJobPosting')}</Text>
                        <Text className='dark:text-white'>{t('jobScreen.requiredToken', { tokenNum: 1, tokenType: tokenType })}</Text>
                    </View>
                </View>

                {
                    dropDowns?.employmentTypes ? dropDowns.employmentTypes.map((item, index) => (
                        item.isPaidJob ? <JobItem key={item.id} id={item.id} value={item.value} /> : null
                    )) : null
                }
            </>
        );
    }

    const FreeJobs = () => {
        return (
            <>
                <View className='mb-6'>
                    <View>
                        <Text className='text-lg font-bold dark:text-white'>{t('jobScreen.freeJobPosting')}</Text>
                        <Text className='dark:text-white'>{t('jobScreen.noTokenRequired')}</Text>
                    </View>
                </View>

                {
                    dropDowns?.employmentTypes ? dropDowns.employmentTypes.map((item, index) => (
                        !item.isPaidJob ? <JobItem key={item.id} id={item.id} value={item.value} /> : null
                    )) : null
                }
            </>
        );
    }

    return (
        <SafeAreaView className='flex-1 justify-between'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Screen>
                    <ScreenTitle title={t('jobScreen.iWouldLikeToCreateA')} />
                    <View className='my-4' />
                    <TokenSelector selectedType={tokenType} onSelect={(value) => tokenChangeHandler(value)} />
                    <View className='mb-8' />
                    <PaidJobs />
                    <View className='my-3' />
                    <FreeJobs />
                </Screen>
            </ScrollView>
            <View className='mx-2'>
                <SubmitButton
                    label={t('jobScreen.actions.confirm')}
                    onPress={handleSheetChanges}
                    isDisable={selected === 0 || tokensCountIsError}
                />
            </View>
            <ActionSheet
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                onDismiss={closeBottomSheet}
            >
                <View className='flex-1 justify-between p-4 dark:bg-colors-new_2'>
                    <View>
                        <View className='items-center justify-center'>
                            <AnimatedImage forwardRef={animationRef} height={170} width={170} loop animation='warn' />
                        </View>
                        <View>
                            <Text className='font-bold text-xl self-center dark:text-white'>{t('jobScreen.actionSheet.title')}</Text>
                            <View className='my-2' />
                            <Text className='self-center text-base dark:text-white'>{t('jobScreen.actionSheet.bodyText')}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between space-x-5 mb-4'>
                        <TouchableOpacity
                            className='flex-1 justify-center h-10 rounded-lg mx-2 my-2 bg-amber-500'
                            onPress={() => debounce(confirmHandler)}
                        >
                            <Text className='self-center text-base font-bold text-white'>{t('jobScreen.actions.sure')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='flex-1 justify-center h-10 rounded-lg mx-2 my-2 border border-amber-500'
                            onPress={handleSheetChanges}
                        >
                            <Text className='self-center text-base dark:text-white'>{t('jobScreen.actions.goBack')}</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </ActionSheet>
        </SafeAreaView>
    );
}

export default AddVacancyScreen;