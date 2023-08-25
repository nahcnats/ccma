import { SafeAreaView, View, Text, useColorScheme, Linking } from 'react-native';
import React, { useState } from 'react';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../store/store';
import Screen from '../../components/common/Screen';
import SubmitButton from '../../components/common/SubmitButton';
import { useDebounce, useAppDispatch, useAppSelector } from '../../hooks';
import { removeUser } from './services';
import { showErrorToast, showSuccessToast } from '../../utils';
import * as authActions from '../../store/actions/auth';

const DeleteProfileScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(0);

    const removeRemarks = [
        { value: 1, label: "Opps! I have a duplicate account" },
        { value: 2, label: "I'm receiving unwanted contact" },
        { value: 3, label: "I have safety / privacy concerns" },
        { value: 4, label: "I don't have a use fot the app anymore" },
        { value: 5, label: "Others, please share your feedback " },
    ]

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const payload = {
                token: token
            }
            await removeUser(payload);

            showSuccessToast(t('promptTitle.success'), 'Account removed');
            setIsLoading(false);
            dispatch(authActions.logout());
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <View>
                    <Text className='text-lg font-[400] dark:text-white'>{t('deleteProfile.question')}</Text>
                </View>
                <View className='my-2' />
                <View className='flex-1 justify-between'>
                    <View>
                        <View className='border border-gray-200 rounded-lg p-2'>
                            <RadioForm
                                animation={true}
                            >
                                {
                                    removeRemarks.map(item => 
                                        <View key={item.value} className='flex-row my-2 items-center space-x-3'>
                                            <RadioButtonInput
                                                obj={item}
                                                index={item.value}
                                                isSelected={selected === item.value}
                                                onPress={() => setSelected(item.value)}
                                                // @ts-ignore
                                                borderWidth={.9}
                                                buttonInnerColor={colors.amber[500]}
                                                buttonOuterColor={selected === item.value ? colors.amber[500] : colors.gray[300]}
                                                buttonSize={18}
                                                buttonOuterSize={25}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 10 }}
                                            />
                                            <Text className='dark:text-white'>
                                                {item.label}
                                                { item.value === 5 && <Text 
                                                    className='text-sky-700'
                                                    onPress={() => Linking.openURL("https://airtable.com/shrFbAXa14tqlWAUI")}
                                                >{t('deleteProfile.here')}</Text>}
                                            </Text>
                                        </View>    
                                    )
                                }
                            </RadioForm>
                        </View>
                        <View className='my-4' />
                        <View>
                            <Text className='dark:text-white'>
                                {t('deleteProfile.text1')}
                            </Text>
                            <View className='my-1' />
                            <Text className='dark:text-white'>
                                {t('deleteProfile.text2')}
                            </Text>
                        </View>
                    </View>
                    <SubmitButton 
                        label='Delete Account'
                        onPress={() => debounce(handleSubmit)}
                        isProcessing={isLoading}
                        isDisable={isLoading}
                    />
                </View>
            </Screen>
        </SafeAreaView>
    );
}

export default DeleteProfileScreen;