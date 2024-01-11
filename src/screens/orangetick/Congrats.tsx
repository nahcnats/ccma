import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { queryClient } from '../../App';
import { RootState } from '../../store/store';
import { useAppSelector, useDebounce } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import SubmitButton from '../../components/common/SubmitButton';
import Illustraton from '../../assets/images/Illustration.svg'
import { IconCheckCircle } from '../../assets/icons';
import { IS_ANDROID } from '../../utils';
import { showErrorToast } from '../../utils';
import { OrangeTickProps, postOrangeTick } from './services';
import { OrangeTickType } from '../../types/orangeTick';

export default function CongratsScreen() {
    const { t } = useTranslation()
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce()
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const {
        dateOfBirth,
        educationLevel,
        nationality,
        aboutMe,
        country,
        state,
        employmentType,
        jobTitle,
        company,
        jobType,
        salaryRange,
        portfolioUrls,
        websiteUrls,
    } = useAppSelector((state: RootState) => state.orangeTick) as OrangeTickType;

    const completionHandler = async () => {
        try {
            setIsLoading(true);

            let userlinks: object[] = [];
            let websitelinks: object[] = [];

            websiteUrls?.map((item: string) => {
                websitelinks.push({
                    value: item,
                    userLinkType: "WEBSITE"
                });
            });

            portfolioUrls?.map((item: string) => {
                userlinks.push({
                    value: item,
                    userLinkType: "PORTFOLIO"
                });
            });

            const payload: OrangeTickProps = {
                token: token,
                params: {
                    dateOfBirth: dateOfBirth,
                    educationLevelId: educationLevel,
                    nationalityId: nationality,
                    bio: aboutMe,
                    countryId: country,
                    stateId: state,
                    creativesEmploymentPosition: {
                        employmentTypeId: jobType,
                        positionTitle: jobTitle,
                        positionCompany: company,
                    },
                    creativesEmploymentTypes: employmentType,
                    creativesSalaryRanges: [salaryRange],
                    userLinks: userlinks,
                    websiteLinks: websitelinks,
                }
            }

            await postOrangeTick(payload);
            await queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });

            setIsLoading(false);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'ProfileTab'
                }
            });
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-1 justify-between'>
                <Illustraton width='100%' height={400} />
                <Screen>
                    <View className='flex-row w-full justify-center items-center space-x-2'>
                        <Text className='text-2xl font-bold dark:text-white'>{t('orangeTick.congratulations')}</Text>
                        <IconCheckCircle size={24} color={colors.amber[500]} />
                    </View>
                    <View className='mt-6'>
                        <View>
                            <Text className='self-center dark:text-white'>
                                {t('orangeTick.congratsText')}
                            </Text>
                        </View>
                        <View className='mt-6'>
                            <Text className='self-center dark:texy-white'>{t('orangeTick.goodLuck')}</Text>
                        </View>
                    </View>
                </Screen>
            </View>
            <View className={`mx-4 ${IS_ANDROID && 'pb-4'}`}>
                <SubmitButton 
                    label='Awesome! Get me a badge!'
                    onPress={() => debounce(completionHandler)}
                    isProcessing={isLoading}
                />
            </View>
        </SafeAreaView>
    );
}