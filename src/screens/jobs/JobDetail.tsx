import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import { RootState } from '../../store/store';
import { useDebounce, useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useBookmarkJobById, useJobById, useUpdateBookmarkJobById } from './hooks';
import { showErrorToast } from '../../utils';

type Props = StackScreenProps<MainNavigationParams, 'ShowJob'>;

const JobDetailScreen = ({route}: Props) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const {token, role} = useAppSelector((state: RootState) => state.auth);
    const { debounce } = useDebounce();
    const { jobId } = route.params;
    const [isUpdating, setIsUpdating] = useState(false);

    const payload = {
        token: token,
        params: {
            jobId: jobId
        }
    }

    const { data, isLoading, isSuccess, isError, error: rqError, refetch } = useJobById(jobId);
    const { data: bookmark, isLoading: bookmarkIsLoading, isError: bookmarkIsError, error: bookmarkError, refetch: bookmarkRefetch } = useBookmarkJobById(payload);
    const { mutateAsync: updateBookmarkJobById } = useUpdateBookmarkJobById();

    useRefreshOnFocus(refetch);
    useRefreshOnFocus(bookmarkRefetch);

    if (isLoading || bookmarkIsLoading) {
        return (
            <Loading />
        );
    }

    if (isError || bookmarkIsError) {
        const errorMessage = isError ? rqError : bookmarkError;

        if (!errorMessage) {
            return null;
        }

        showErrorToast(t('promptTitle.error'), errorMessage.message);
        navigation.goBack();
    }

    const ago = () => {
        if (data?.publishedMonthsAgo && data?.publishedMonthsAgo > 0) {
            return `${data?.publishedMonthsAgo} ${t('feedScreen.monthsAgo')}`;
        }

        if (data?.publishedWeeksAgo && data?.publishedWeeksAgo > 0) {
            return `${data?.publishedWeeksAgo} ${t('feedScreen.weeksAgo')}`;
        }

        if (data?.publishedDaysAgo && data?.publishedDaysAgo > 0) {
            return `${data?.publishedDaysAgo} ${t('feedScreen.daysAgo')}`;
        }

        if (data?.publishedHoursAgo && data?.publishedHoursAgo > 0) {
            return `${data?.publishedHoursAgo} ${t('feedScreen.hoursAgo')}`;
        }

        if (data?.publishedMinutesAgo && data?.publishedMinutesAgo > 0) {
            return `${data?.publishedMinutesAgo} ${t('feedScreen.minutesAgo')}`;
        }

        return `${t('feedScreen.aMomentAgo')}`;
    }

    const saveJobHandler = async () => {
        setIsUpdating(true);

        try {
            await updateBookmarkJobById(payload);
            setIsUpdating(false);
        } catch (error: any) {
            setIsUpdating(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const CreativeActions = () => {
        return (
            <View className='flex-row space-x-3 mt-6'>
                <TouchableOpacity
                    className={`py-2 px-4 rounded-md ${data?.jobPostingStatus === 'Open' ? 'bg-amber-500' : 'bg-gray-400'}`}
                    onPress={() => navigation.navigate('ApplyJob', { jobId: jobId, title: data?.title || '', companyName: data?.companyName || '' })}
                    disabled={data?.jobPostingStatus !== 'Open'}
                >
                    <Text className='text-white font-semibold'>{t('jobScreen.actions.applyNow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`border ${isUpdating ? 'bg-gray-300' : 'border-amber-500'}  py-2 px-4 rounded-md`}
                    onPress={() => debounce(saveJobHandler)}
                    disabled={isUpdating}
                >
                    <Text className='text-black font-semibold dark:text-gray-100'>
                        {
                            bookmark ? t('jobScreen.actions.unsaveJob') : t('jobScreen.actions.saveJob')
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const EmployerActions = () => {
        return (
            <View className='flex-row space-x-3 mt-6'>
                <TouchableOpacity
                    className='bg-amber-500 py-2 px-4 rounded-md'
                    onPress={() => navigation.navigate('Applicants', { jobId: jobId, title: data?.title || '', companyName: data?.companyName || '' })}
                >
                    <Text className='text-white font-semibold'>{t('jobScreen.actions.viewApplicants')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`py-2 px-4 rounded-md ${`py-2 px-4 rounded-md ${data?.jobPostingStatus !== 'Closed' ? 'bg-red-500' : 'bg-gray-400'}`}`}
                    onPress={() => navigation.navigate('CloseJob', { jobId: jobId })}
                    disabled={data?.jobPostingStatus === 'Closed'}
                >
                    <Text className='text-white font-semibold'>{t('jobScreen.actions.closeJob')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const EmployerInfo = () => {
        return (
            <>
                <View className='my-3 h-[0.3] w-full bg-gray-400' />
                <View className='mt-3'>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.aboutMyCompany')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EmployerProfileView', { userId: data?.companyId || 0})} className='flex-row items-start space-x-3 py-4 mt-3'>
                        <Avatar image={data?.profileImageUrl} size={60} />
                        <View className='flex-1'>
                            <View>
                                <Text className='flex-1 font-bold dark:text-gray-100' numberOfLines={1} ellipsizeMode='tail'>{data?.companyName}</Text>
                                <Text className='text-gray-700 mt-1 dark:text-gray-300'>{data?.employerIndustry}</Text>
                                {/* <Text className='flex-1 flex-wrap text-blue-600 mt-1'>www.abc.com</Text> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='mt-6'>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.companySize')}</Text>
                    <Text className='mt-2 text-gray-900 dark:text-gray-100'>{data?.employerCompanySize}</Text>
                </View>
                <View className='mt-6'>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.companyOverview')}</Text>
                    <Text className='mt-2 text-gray-900 dark:text-gray-100'>{data?.companyOverview}</Text>
                </View>
            </>
        );
    }

    return (
        <ScrollView className='mb-20' showsVerticalScrollIndicator={false}>
            <Screen>
                <View>
                    <Text className='font-semibold text-base py-[0.5] dark:text-white'>{data?.title}</Text>
                    <Text className='text-blue-600 font-semibold dark:text-white'>{data?.companyName}</Text>
                    <View className='mt-2'>
                        <View className='flex-1 flex-row space-x-2'>
                            {
                                data?.workModes?.map((item, index) => <Text key={index} className='text-gray-700 py-[0.5] dark:text-gray-200'>{item}</Text>)
                            }
                        </View>
                        <View className='flex-row space-x-2'>
                            <Text className='text-gray-700 dark:text-gray-200'>{ago()}</Text>
                            <Text className='dark:text-gray-100'>|</Text>
                            <Text className='text-gray-700 dark:text-gray-200'>{t('jobScreen.applicants', { applicantsNum: data?.applicantsCount })}</Text>
                        </View>
                    </View>
                </View>
                {
                    role === 'CREATIVE' ? <CreativeActions /> : <EmployerActions />
                }
                <View className='mt-6'>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.theRole')}</Text>
                    <Text className='mt-2 text-gray-900 dark:text-gray-100'>{data?.descriptionCleaned}</Text>
                </View>
                <View className='mt-6'>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.responsibilites')}</Text>
                    <Text className='mt-2 text-gray-900 dark:text-gray-100'>{data?.dutiesCleaned}</Text>
                </View>

                <View className='my-6 h-[0.3] w-full bg-gray-400' />

                <View>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.jobDetails')}</Text>
                    <View className='flex-row space-x-2 mt-4'>
                        <Text className='text-blue-900 font-[600] dark:text-blue-400'>{t('jobScreen.employmentType')}</Text>
                        <View className='flex-1 flex-row space-x-2'>
                            {
                                data?.employmentTypes?.map((item, index) => <Text key={index} className='text-gray-900 dark:text-gray-100'>{item}</Text>)
                            }
                        </View>
                    </View>
                    <View>
                        <Text className='text-blue-900 font-[600] mt-2 dark:text-blue-400'>{t('jobScreen.experienceLevel')}</Text>
                        <View className='flex-row flex-wrap space-x-2 w-full'>
                            {
                                data?.experienceLevels?.map((item, index) => 
                                    <View key={index} className='rounded-lg p-2 bg-pink-200 mt-2'>
                                        <Text>{item}</Text>
                                    </View>    
                                )
                            }
                        </View>
                    </View>
                    <View>
                        <Text className='text-blue-900 font-[600] mt-2 dark:text-blue-400'>{t('jobScreen.educationLevel')}</Text>
                        <View className='flex-row flex-wrap space-x-2 w-full'>
                            {
                                data?.educationLevels?.map((item, index) => 
                                    <View key={index} className='rounded-lg p-2 bg-green-200 mt-2'>
                                        <Text>{item}</Text>
                                    </View>   
                                )
                            }
                        </View>
                    </View>
                    <View className='flex-row space-x-2 mt-4'>
                        <Text className='text-blue-900 font-[600] dark:text-blue-400'>{t('jobScreen.salaryRange')}</Text>
                        <Text className='dark:text-gray-100'>{data?.salaryRange}</Text>
                    </View>
                    <View className='flex-row space-x-2 mt-2'>
                        <Text className='text-blue-900 font-[600] dark:text-blue-400'>{t('jobScreen.workingDays')}</Text>
                        <View className='flex-1 flex-row space-x-2'>
                            {
                                data?.workingDays?.map((item, index) => <Text key={index} className='dark:text-gray-100'>{item}</Text>)
                            }
                        </View>
                    </View>
                </View>

                <View className='my-6 h-[0.3] w-full bg-gray-400' />

                <View>
                    <Text className='text-blue-900 font-bold dark:text-blue-400'>{t('jobScreen.thePerks')}</Text>
                    <Text className='mt-2 text-gray-900 dark:text-gray-100'>{data?.benefitsCleaned}</Text>
                </View>
                {
                    role == 'CREATIVE' ? <EmployerInfo /> : null
                }
            </Screen>
        </ScrollView>
    );
}

export default JobDetailScreen;