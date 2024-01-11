import { SafeAreaView, View, Text, FlatList, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import Loading from '../../components/common/Loading';
import ApplicantItem from '../../components/jobs/ApplicantItem';
import { IS_ANDROID } from '../../utils';
import { useAppSelector, useRefreshOnFocus, useDebounce } from '../../hooks';
import { showErrorToast, showSuccessToast } from '../../utils';
import { useJobByIdApplicants, useUpdateJobApplicantStatus } from './hooks';
import Empty from '../../components/connections/Empty';

type Props = StackScreenProps<MainNavigationParams, 'Applicants'>;

const warningMessage = " Modifying an applicant's status has lasting impacts. Double-check your decision before proceeding."

export default function ApplicantsScreen({route }: Props) {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { jobId, title, companyName } = route.params;
    const payload = {
        token: token,
        params: {
            jobId: jobId,
        }
    }
    const { data, isLoading, isError, error: rqError, refetch } = useJobByIdApplicants(payload);
    const { mutateAsync: postUpdateJobApplicantStatus } = useUpdateJobApplicantStatus();

    useRefreshOnFocus(refetch);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
        navigation.goBack();
    }

    const confirmShortList = (statusId: number, applicantId: number) => {
        Alert.alert('Warning', warningMessage, [
            {
                text: 'Cancel',
                onPress: () => null,
                // style: "cancel"
            },
            {
                text: 'Confirm',
                onPress: () => onShortListed(statusId, applicantId)
            }
        ]);
    }

    const onShortListed = async (statusId: number, applicantId: number) => {
        try {
            const payload = {
                token: token,
                params: {
                    jobId: jobId,
                    applicantId: applicantId,
                    applicantStatusId: statusId,
                }
            }   

            const result = await postUpdateJobApplicantStatus(payload);

            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const confirmUnSuccessful = (statusId: number, applicantId: number) => {
        Alert.alert('Warning', warningMessage, [
            {
                text: 'Cancel',
                onPress: () => null,
                // style: "cancel"
            },
            {
                text: 'Confirm',
                onPress: () => onUnSuccessful(statusId, applicantId)
            }
        ]);
    }

    const onUnSuccessful = async (statusId: number, applicantId: number) => {
        try {
            const payload = {
                token: token,
                params: {
                    jobId: jobId,
                    applicantId: applicantId,
                    applicantStatusId: statusId,
                }
            }    

            const result = await postUpdateJobApplicantStatus(payload);

            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    // shortListed code = 2
    // unSuccessful code = 6

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <ScreenTitle title={`Applying to ${title} by ${companyName}`} />
                <View className={`my-4 bg-gray-700 dark:bg-gray-100 ${IS_ANDROID ? 'h-[0.5]': 'h1'}`} />
                <FlatList 
                    data={data}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item }) => <ApplicantItem 
                        data={item} 
                        onShortListed={() => debounce(() => confirmShortList(2, item.id))}
                        onUnSuccessful={() => debounce(() => confirmUnSuccessful(6, item.id))}
                    />}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='my-2' />}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                />
            </Screen>
        </SafeAreaView>
    );
}