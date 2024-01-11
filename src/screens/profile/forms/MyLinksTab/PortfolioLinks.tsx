// import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, View, Text, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
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
import { urlPattern } from '../../../../constants/others';

const socialPlatform = [
  { id: 1, value: 'Facebook' },
  { id: 2, value: 'Instagram' },
  { id: 3, value: 'Behance' },
  { id: 4, value: 'Youtube' },
  { id: 5, value: 'TikTok' },
  { id: 6, value: 'LinkedIn' },
  { id: 7, value: 'Pinterest' },
]

export default function PortfolioLinks() {
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
  const [portfolioText, setPortfolioText] = useState('');
  const [numPortfolios, setNumPortfolios] = useState(1);
  const refPortfolios = useRef<string[]>([portfolioText]);
  const { mutateAsync: updateLinks } = useUpdateLinks();

  useEffect(() => {
    if (!data?.userLinks) return;

    refPortfolios.current.splice(0, 1)[0];
    for (const item of data.userLinks) {
      if (item.userLinkType === 'WEBSITE') {
        continue;
      }

      let newValue = item.value;
      const isHttps = newValue.includes('http://');

      if (!isHttps) {
        newValue = `https://${newValue}`
      }
      
      // refPortfolios.current.push(item.value);
      refPortfolios.current.push(newValue);
    }
  }, [isSuccess]);

  const setPortfolioValue = useCallback((index: number, value: string) => {
    const inputs = refPortfolios.current;
    inputs[index] = value;
    setPortfolioText(value);
  }, []);

  const addPortfolio = useCallback(() => {
    refPortfolios.current.push('https://');
    setNumPortfolios(value => value + 1);
  }, []);

  const removePortfolio = useCallback((index: number) => {
    refPortfolios.current.splice(index, 1)[0];
    setNumPortfolios(value => value - 1);
  }, []);

  const submitHandler = async () => {
    try {
      setIsLoading(true);

      let portfolioLinks: any[] = [];
      refPortfolios.current.map(item => {
        portfolioLinks.push({
          value: item,
          userLinkType: ''
        })
      });

      const payload = {
        token: token,
        params: {
          userLinks: portfolioLinks
        }
      }

      await updateLinks(payload);
      // await postOrangeTick(payload);
      // await queryClient.invalidateQueries('creativeProfile');
      showSuccessToast(t('promptTitle.success'), 'Portfolio links updated');
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
                    <View>
                      <Text className='text-base font-semibold dark:text-white'>{t('editProfileScreen.myLinksForm.addPortFolio')}</Text>
                    <Text className='text-xs dark:text-white'>{t('editProfileScreen.myLinksForm.addLinksDesc')}</Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={addPortfolio}
                      disabled={
                        refPortfolios.current.some(item => item === '')
                      }
                    >
                      <IconAdd size={24} color={`${colorScheme === 'dark' && colors.white}`} />
                    </TouchableOpacity>
                  </View>
                  {refPortfolios.current.map((item, i) =>
                    <View key={i} className='flex-row items-center space-x-3'>
                      <DynamicTextInput
                        key={i}
                        index={i}
                        value={refPortfolios.current[i]}
                        placeholder='https://www.portfolio.com'
                        onChangeText={(value) => setPortfolioValue(i, value)}
                        onRemove={() => removePortfolio(i)}
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