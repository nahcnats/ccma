import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { queryClient } from '../../../App';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import { RootState } from '../../../store/store';
import Screen from '../../../components/common/Screen';
import SubmitButton from '../../../components/common/SubmitButton';
import { useUtilties, useAppSelector, useDebounce } from '../../../hooks';
import { useCreativeProfile } from '../hooks';
import { showErrorToast, showSuccessToast } from '../../../utils';
import { updateCreativePreferences } from '../services';

export default function MyTopicsForm() {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const payload = {
        token: token
    }
    const { data: dropdown } = useUtilties();
    const { data } = useCreativeProfile(payload);
    const [selection, setSelection] = useState<number[]>(data?.preferredTopicIds || []);
    const [isLoading, setIsLoading] = useState(false);

    const topicSelectionHandler = (id: number) => {
        if (selection.find(selected => selected === id)) {
            let newSelection = [...selection];

            const checkSelected = (item: number) => {
                return item === id;
            }

            const index = newSelection.findIndex(checkSelected);

            newSelection.splice(index, 1);

            setSelection(newSelection);

            return;
        }

        setSelection(prev => [...prev, id]);
    }

    const submitHandler = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const newCreativePreferences: any[] = [];

            newCreativePreferences.push({
                preferenceType: 'topics',
                preferenceIds: selection,
            });

            const payload = {
                token: token,
                params: {
                    creativePreferences: newCreativePreferences
                }
            }

            await updateCreativePreferences(payload);
            await queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });

            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Topics saved');
            navigation.goBack();
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <View className='flex-1 justify-between'>
                    <View className='flex-row flex-wrap'>
                        {
                            dropdown && dropdown?.creativesTopics.map((item, index) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    className={
                                        `p-3 mr-4 my-2 rounded-lg 
                                        ${selection.find(selected => selected === item.id)
                                            ? 'bg-amber-300'
                                            : 'bg-slate-100'} 
                                        `
                                    }
                                    onPress={() => topicSelectionHandler(item.id)}
                                >
                                    <Text>{item.value}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View> 
                    <SubmitButton
                        label={`${t('editProfileScreen.actions.save')}`}
                        isProcessing={isLoading}
                        isDisable={isLoading}
                        onPress={() => debounce(submitHandler)}
                    />                   
                </View>
            </Screen>
        </SafeAreaView>
    );
}