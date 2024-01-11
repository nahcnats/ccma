import { View, Text, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import StarRating from 'react-native-star-rating-widget';
import colors from 'tailwindcss/colors';

import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import ScreenTitle from '../../components/common/ScreenTitle';
import SubmitButton from '../../components/common/SubmitButton';
import { useAppSelector, useDebounce } from '../../hooks';
import { useCloseJobById } from './hooks';
import { showErrorToast, showSuccessToast } from '../../utils';
import { CloseJobByIdProps } from './services';

type Props = StackScreenProps<MainNavigationParams, 'CloseJob'>;

export default function CloseJobScreen({ route }: Props) {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { jobId } = route.params;
    const [isSelected, setIsSelected] = useState('');
    const [rating, setRating] = useState(0);
    const [canSubmit, setCanSubmit] = useState(false);
    const { mutateAsync: postCloseJobById } = useCloseJobById();
    

    const closeJobRemarks = [
        "I hired someone for this role",
        "I got enough applicants",
        "I did not receive enough quality",
        "I'm no longer hiring"
    ];

    useEffect(() => {
        if (isSelected !== '' && rating !== 0) {
            setCanSubmit(true);
        }
    }, [isSelected, rating]);

    const closeJobHandler = () => {
        Alert.alert('Warning', 'Please be aware that once a job is closed, it cannot be reopened. Are you sure you want to close this job?', [
            {
                text: 'Cancel',
                onPress: () => null,
                // style: "cancel"
            },
            {
                text: 'Delete',
                onPress: submitHandler
            }
        ]);
    }

    const submitHandler = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    jobId: jobId,
                    reviewRemarks: isSelected,
                }
            } as CloseJobByIdProps;

            const result = await postCloseJobById(payload);   
            
            // if (closeJobByIdStatus === 'error') {
            //     throw closeJobByIdError;
            // }

            showSuccessToast(t('promptTitle.success'), result);
            
            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'JobsTab',
                    params: {
                        screen: 'ClosedJobs'
                    }
                }
            });
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const RemarkItem = ({remark}: {remark: string}) => {
        return (
            <>
                <TouchableOpacity 
                    className={`rounded-lg p-4 bg-colors-new_4 dark:bg-colors-new_2 ${isSelected === remark && 'border border-amber-500'}`}
                    onPress={() => setIsSelected(remark)}
                >
                    <Text className='self-center dark:text-white'>{remark}</Text>
                </TouchableOpacity>
                <View className='my-2' />
            </>
        );
    }

    return (
        <View className='flex-1'>
            <Screen>
                <View>
                    <ScreenTitle title={t('closeJobScreen.satisfication')} />
                    <View className='mt-4 mb-6'>
                        <StarRating
                            rating={rating}
                            onChange={setRating}
                            maxStars={5}
                            color={colors.amber[500]}
                            enableHalfStar={false}
                        />
                    </View>
                </View>
                <View>
                    <Text className={`font-bold text-base ${colorScheme === 'dark' && 'text-white'}`}>{t('closeJobScreen.closeJobReasonTitle')}</Text>
                    <View className='mt-6'>
                        { closeJobRemarks.map((item, index) =>
                            <RemarkItem key={index} remark={item} />
                        )}
                    </View>
                </View>
                <SubmitButton 
                    label={t('closeJobScreen.confirmButtonLabel')}
                    onPress={() => debounce(closeJobHandler)}
                    isDisable={!canSubmit}
                />
            </Screen>
        </View>
    );
}