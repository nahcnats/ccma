import { 
    SafeAreaView,
    View, 
    Text, 
    KeyboardAvoidingView,
    useColorScheme,
} from 'react-native';
import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { RootState } from '../../store/store';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import Screen from '../../components/common/Screen';
import { TextInput, DropdownSearch, DropdownPhone, InputFormErrors } from '../../components/common/input';
import SubmitButton from '../../components/common/SubmitButton';
import { IS_ANDROID, dismissKeyboard, showErrorToast, showSuccessToast } from '../../utils';
import { useAppSelector, useDebounce } from '../../hooks';
import { maxLength, minHeight } from '../../constants/others';
import { useReportPost } from './hooks';

interface FormValues {
    remark: string
}

type Props = StackScreenProps<MainNavigationParams, 'ReportPost'>;

const ReportPostScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const { ...methods } = useForm<FormValues>();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { postId } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const { mutateAsync: reportPost } = useReportPost();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        dismissKeyboard();

        if (isLoading) return;

        

        try {
            setIsLoading(true);

            const payload = {
                token: token,
                params: {
                    postId: postId,
                    remarks: data.remark
                }
            }

            await reportPost(payload);

            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Report sent');
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
                    <View onStartShouldSetResponder={dismissKeyboard}>
                        <Text className='text-lg font-bold dark:text-white'>Why are you concerned with this post?</Text>
                        <View className='my-4' />
                        <FormProvider {...methods}>
                            <TextInput
                                name='remark'
                                placeholder={`${t('feedScreen.forms.remarkPlaceholder')}`}
                                multiline
                                numberOfLines={6}
                                textAlignVertical='top'
                                maxLength={maxLength}
                                style={{
                                    minHeight: minHeight
                                }}
                                minHeight={minHeight}
                                rules={{
                                    required: `${t('formErrors.remark')}`
                                }}
                            />
                            {methods.formState.errors.remark && <InputFormErrors message={`${errorMessage?.aboutme?.message}`} />}
                            <View className='mt-1'>
                                <Text className='self-end text-xs dark:text-white'>
                                    {`${methods.watch('remark') ? (methods.watch('remark').length) : 0} / ${maxLength}`}
                                </Text>
                            </View>

                            <View className='my-4' />
                            <SubmitButton
                                label={`${t('editProfileScreen.actions.save')}`}
                                onPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                                isProcessing={isLoading}
                                isDisable={isLoading}
                            />
                        </FormProvider>
                    </View>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
        
    );
}

export default ReportPostScreen;