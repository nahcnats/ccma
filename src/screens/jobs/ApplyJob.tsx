import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    View, 
    Text, 
    FlatList,
    useColorScheme 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import SubmitButton from '../../components/common/SubmitButton';
import { ResumeListing } from '../../components/common/LWR';
import Loading from '../../components/common/Loading';
import { IconFilePDF } from '../../assets/icons';
import { ResumeItem } from '../../components/jobs/';
import { showSuccessToast, showErrorToast } from '../../utils';
import { useAppSelector, useDebounce } from '../../hooks';
import { RootState } from '../../store/store';
import { useCreativeCvs, useApplyJobById, useDeleteCreativeCv } from './hooks';
import { ApplyJobTypes, CVsType } from '../../types/jobs';
import EmptyResume from '../../components/jobs/EmptyResume';

type Props = StackScreenProps<MainNavigationParams, 'ApplyJob'>;

export default function ApplyJobScreen({ route }: Props) {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { jobId, title, companyName } = route.params;
    const [selected, setSelected] = useState<number>(0);
    const [canSubmit, setCanSubmit] = useState(false);
    const { data: cvData, isLoading, isSuccess, isError, error: rqError } = useCreativeCvs(token);
    const { mutateAsync: applyJob, status: applyJobByIdStatus, error: applyJobByIdError } = useApplyJobById();
    const { mutateAsync: deleteCv } = useDeleteCreativeCv();


    const deleteCvHandler = async (uploadId: number) => {
        try {
            console.log(uploadId)
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

    const submitHandler = async () => {
        try {
            if (selected === 0 || null) {
                return;
            }

            const selectedData = cvData?.filter(item => item.uploadId == selected) || [];

            if (!selected) {
                return;
            }

            const payload: ApplyJobTypes = {
                token: token,
                jobId: jobId,
                uploadId: selectedData[0].uploadId
            }

            const result = await applyJob(payload);

            if (!result) {
                return;
            }

            showSuccessToast(t('promptTitle.success'), result);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'JobsTab'
                }
            });
            
        } catch (error: any) {
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
            <Screen>
                <ScreenTitle title={t('applyJobScreen.header', { jobTitle: title, author: companyName })} />
                <View className='my-6 h-[0.3] bg-gray-500' />
                <View className='flex-1 justify-between'>
                    <ResumeListing title={t('applyJobScreen.actions.label')}>
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
                                showCheck
                                checked={selected === item.uploadId}
                                onItemChange={() => setSelected(item.uploadId)}
                                onDelete={() => debounce(() => deleteCvHandler(item.uploadId))}
                            />
                            }
                            ListEmptyComponent={<EmptyResume />}
                            showsVerticalScrollIndicator={false}
                        />
                    </ResumeListing>
                    <SubmitButton
                        label={t('applyJobScreen.actions.submit')}
                        onPress={() => debounce(submitHandler)}
                        isDisable={selected === 0}
                    />
                </View>
            </Screen>
        </SafeAreaView>
    );
}