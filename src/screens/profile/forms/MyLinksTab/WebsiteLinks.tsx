import { SafeAreaView, ScrollView, KeyboardAvoidingView, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainNavigationParams } from '../../../../navigators/MainNavigation';
import { RootState } from '../../../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../../../hooks';
import Screen from '../../../../components/common/Screen';
import SubmitButton from '../../../../components/common/SubmitButton';
import { dismissKeyboard, IS_ANDROID } from '../../../../utils';
import { IconAdd } from '../../../../assets/icons';
import DynamicTextInput from '../../../../components/common/input/DynamicTextInput';
import { showErrorToast, showSuccessToast } from '../../../../utils';
import { postOrangeTick } from '../../../orangetick/services';  
import { queryClient } from '../../../../App';
import { useCreativeProfile, useUpdateLinks } from '../../hooks';

export default function WebsiteLinks() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { ...methods } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const payload = {
    token: token
  }
  const { data, isSuccess, refetch } = useCreativeProfile(payload);
  useRefreshOnFocus(refetch);
  const [websiteText, setWebsiteText] = useState('');
  const [numWebsites, setNumWebsites] = useState(1);
  const refWebsites = useRef<string[]>([websiteText]);
  const { mutateAsync: updateLinks } = useUpdateLinks();

  useEffect(() => {
    if (!data?.websiteLinks) return;

    refWebsites.current.splice(0, 1)[0];
    for (const item of data.websiteLinks) {
      if (item.userLinkType !== 'WEBSITE') {
        continue;
      }

      let newValue = item.value;
      const isHttps = newValue.includes('http://');

      if (!isHttps) {
        newValue = `https://${newValue}`
      }

      // refWebsites.current.push(item.value);
      refWebsites.current.push(newValue);
    }
  }, [isSuccess]);

  const setWebsiteValue = useCallback((index: number, value: string) => {
    const inputs = refWebsites.current;
    inputs[index] = value;
    setWebsiteText(value);
  }, []);

  const addWebsite = useCallback(() => {
    refWebsites.current.push('https://');
    setNumWebsites(value => value + 1);
  }, []);

  const removeWebsite = (index: number) => {
    refWebsites.current.splice(index, 1)[0];
    setNumWebsites(value => value - 1);
  };

  const submitHandler = async () => {
    try {
      setIsLoading(true);

      let websiteLinks: any[] = [];
      refWebsites.current.map(item => {
        websiteLinks.push({
          value: item,
          userLinkType: 'WEBSITE'
        })
      });

      const payload = {
        token: token,
        params: {
          websiteLinks: websiteLinks
        }
      }

      await updateLinks(payload);
      showSuccessToast(t('promptTitle.success'), 'Portfolio links updated');
      setIsLoading(false);
      navigation.navigate('Drawer', {
        screen: 'Home',
        params: {
          screen: 'ProfileTab',
        }
      });
      showSuccessToast(t('promptTitle.success'), 'Website links updated');
      setIsLoading(false);
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
                    <View>
                      <Text className='text-base font-semibold dark:text-white'>{t('editProfileScreen.myLinksForm.addWebsite')}</Text>  
                    <Text className='text-xs dark:text-white'>{t('editProfileScreen.myLinksForm.addLinksDesc')}</Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={addWebsite}
                      disabled={
                        refWebsites.current.some(item => item === '')
                      }
                    >
                      <IconAdd size={24} color={`${colorScheme === 'dark' && colors.white}`} />
                    </TouchableOpacity>
                  </View>
                  {refWebsites.current.map((item, i) =>
                    <View key={i} className='flex-row items-center space-x-3'>
                      <DynamicTextInput
                        key={i}
                        index={i}
                        value={refWebsites.current[i]}
                        placeholder='https://www.website.com'
                        onChangeText={(value) => setWebsiteValue(i, value)}
                        onRemove={() => removeWebsite(i)}
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