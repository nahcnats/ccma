
import { SafeAreaView, View, Text } from 'react-native';
import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';

import SubmitButton from '../common/SubmitButton';
import { IS_ANDROID } from '../../utils';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { IconUserEdit, IconBars, IconBack } from '../../assets/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SafeAreaFeedHeaderProps {
  isPrimary: boolean
  onSave?: () => void
  onPost?: () => void
  deleteMediaWhenBack?: boolean | false
  isProcessing?: boolean
  isDisable?: boolean
  isEdit: boolean
}

const SafeAreaFeedHeader = ({ isPrimary, onSave, onPost, deleteMediaWhenBack, isProcessing, isDisable, isEdit }: SafeAreaFeedHeaderProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();

  const toggleDrawer = async () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }

  const PostButton = () => {
    return (
      <SubmitButton 
        label={t('feedScreen.actions.post')} 
        onPress={() => onPost ? onPost() : null} 
        isProcessing={isProcessing}
      />
      // <TouchableOpacity
      //   onPress={onPost}
      //   // className={`rounded-lg py-3 px-6 ${isDisable ? 'bg-gray-300' : 'bg-amber-500'} `}
      //   className={`${isDisable ? 'bg-gray-300' : 'bg-amber-500'} rounded-lg px-4 ${IS_ANDROID ? 'py-2 mt-1' : 'py-3'}`}
      //   disabled={isDisable}
      // >
      //   <Text className='font-semibold text-white'>{t('feedScreen.actions.post')}</Text>
      // </TouchableOpacity>
    );
  }

  const SaveButton = () => {
    return (
      <SubmitButton 
        label={t('feedScreen.actions.save')} 
        onPress={() => onSave ? onSave() : null} 
        isProcessing={isProcessing}
      />
      // <TouchableOpacity
      //   onPress={onSave}
      //   className={`${isDisable ? 'bg-gray-300' : 'bg-amber-500'} rounded-lg px-4 ${IS_ANDROID ? 'py-2 mt-1' : 'py-3'}`}
      //   disabled={isDisable}
      // >
      //   <Text className='text-white font-semibold'>{t('feedScreen.actions.save')}</Text>
      // </TouchableOpacity>
    );
  }

  const Primary = () => {
    return (
      <>
        <TouchableOpacity>
          <IconUserEdit size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDrawer}>
          <IconBars size={24} color={colors.black} />
        </TouchableOpacity>
      </>
    );
  }

  const Secondary = () => {
    return (
      <>
        <TouchableOpacity onPress={backHandler}>
          <IconBack size={24} color={colors.black} />
        </TouchableOpacity>
        <View className='w-20'>
          {isEdit ? <SaveButton /> : <PostButton />}
        </View>
        
      </>
    );
  }

  const backHandler = async () => {
    if (deleteMediaWhenBack) {
      await AsyncStorage.removeItem('media');
    }
    
    navigation.goBack() 
  }

  return (
    <SafeAreaView className={`flex-row justify-between items-center mx-4 ${IS_ANDROID && 'mt-6'}`}>
      { isPrimary ? <Primary /> : <Secondary />}
    </SafeAreaView>
  );
}

export default SafeAreaFeedHeader;