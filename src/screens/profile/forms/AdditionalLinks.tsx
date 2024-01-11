// import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, View, Text, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootState } from '../../../store/store';
import { useAppSelector } from '../../../hooks';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import Screen from '../../../components/common/Screen';
import SubmitButton from '../../../components/common/SubmitButton';
import { dismissKeyboard, IS_ANDROID, showErrorToast, showSuccessToast } from '../../../utils';
import { IconAdd } from '../../../assets/icons';
import DynamicTextInput from '../../../components/common/input/DynamicTextInput';
import { queryClient } from '../../../App';
import { useEmployerProfile, useUpdateAdditionalLinks } from '../hooks';
import server from '../../../API';
import { httpHeaders } from '../../../constants/httpHeaders';

const socialPlatform = [
  { id: 1, value: 'Facebook' },
  { id: 2, value: 'Instagram' },
  { id: 3, value: 'Behance' },
  { id: 4, value: 'Youtube' },
  { id: 5, value: 'TikTok' },
  { id: 6, value: 'LinkedIn' },
  { id: 7, value: 'Pinterest' },
]

export default function AdditionalLinks() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { ...methods } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const payload = {
    token: token
  }
  const { data, isSuccess } = useEmployerProfile(payload);
  const [additionalText, setAdditionalText] = useState('');
  const [numAdditionals, setNumAdditionals] = useState(1);
  const refAdditionals = useRef<string[]>([additionalText]);
  const { mutateAsync: updateAdditionalLinks } = useUpdateAdditionalLinks();

  useEffect(() => {
    if (!data?.additionalLinksList) return;

    refAdditionals.current.splice(0, 1)[0];

    data?.additionalLinksList.map(item => {
      let newItem = item;
      const isHttps = newItem.includes('http://');

      if (!isHttps) {
        newItem = `https://${newItem}`
      }

      // refAdditionals.current.push(item);
      refAdditionals.current.push(newItem);
    });
  }, [isSuccess]);

  const setAdditionalValue = useCallback((index: number, value: string) => {
    const inputs = refAdditionals.current;
    inputs[index] = value;
    setAdditionalText(value);
  }, []);

  const addAdditional = useCallback(() => {
    refAdditionals.current.push('https://');
    setNumAdditionals(value => value + 1);
  }, []);

  const removeAdditional = useCallback((index: number) => {
    refAdditionals.current.splice(index, 1)[0];
    setNumAdditionals(value => value - 1);
  }, []);

  const submitHandler = async () => {
    try {
      setIsLoading(true);

      const payload = {
        token: token,
        params: {
          additionalLinks: refAdditionals.current
        }
      }

      await updateAdditionalLinks(payload);
      
      showSuccessToast(t('promptTitle.success'), 'Links updated');
      setIsLoading(false);
      navigation.navigate('Drawer', {
        screen: 'Home',
        params: {
          screen: 'ProfileTab',
        }
      });
    } catch (error: any) {
      setIsLoading(false);
      showErrorToast(t('promptTitle.error'), error.message);
    }
  }

  return (
    // <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
        <Screen>
          <FormProvider {...methods}>
            <View className='flex-1 justify-between'>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View onStartShouldSetResponder={dismissKeyboard}>
                  <View className='flex-row justify-between items-center'>
                    <Text className='text-base font-semibold dark:text-white'>My Links</Text>
                    <TouchableOpacity
                      onPress={addAdditional}
                      disabled={
                        refAdditionals.current.some(item => item === '')
                      }
                    >
                      <IconAdd size={24} color={`${colorScheme === 'dark' && colors.white}`} />
                    </TouchableOpacity>
                  </View>
                {refAdditionals.current.map((item, i) =>
                    <View key={i} className='flex-row items-center space-x-3'>
                      <DynamicTextInput
                        key={i}
                        index={i}
                        value={refAdditionals.current[i]}
                        placeholder='https://www.additional.com'
                        onChangeText={(value) => setAdditionalValue(i, value)}
                        onRemove={() => removeAdditional(i)}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            
              <SubmitButton
                label={`${t('editProfileScreen.actions.save')}`}
                onPress={submitHandler}
                isProcessing={isLoading}
                isDisable={isLoading}
              />
            </View>
          </FormProvider>
          <View className='my-4' />
        </Screen>
      </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}