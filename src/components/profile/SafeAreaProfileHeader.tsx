import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from 'tailwindcss/colors';

import SubmitButton from '../common/SubmitButton';
import { IS_ANDROID } from '../../utils';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { IconUserEdit, IconBars, IconBack } from '../../assets/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BadgeSelector } from '../../store/reducers/notifications';
import { useAppSelector } from '../../hooks';
import HamburgerIcon from '../../assets/icons/svgs/Hamburger.svg';

interface SafeAreaProfileHeaderProps {
  isPrimary: boolean
  onButtonPress?: () => void
  onDeletePress?: () => void
  isProcessing?: boolean
  isDisable?: boolean
}

const SafeAreaProfileHeader = ({ isPrimary, onButtonPress, onDeletePress, isProcessing, isDisable }: SafeAreaProfileHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
  const badge = useAppSelector(BadgeSelector);

  const toggleDrawer = async () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }

  const Primary = () => {
    return (
      <View className='flex-1 justify-end items-end'>
        {/* <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <IconUserEdit size={24} color={colors.black} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={toggleDrawer} className='flew-row' >
          {/* <IconBars size={24} color={colors.black} /> */}
          <View className='p-2 bg-white rounded-md'>
            <HamburgerIcon width={24} height={24} />
          </View>
          {
            badge && badge > 0 ?
              <View className='rounded-full bg-red-500 h-5 w-5 absolute top-0 right-[34] items-center justify-center'>
                <Text className='self-center text-white text-xs'>{badge || 0}</Text>
              </View> : null
          }
        </TouchableOpacity>
      </View>
    );
  }

  const Secondary = () => {
    return (
      <View className='flex-row flex-1 justify-between items-center'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack size={24} color={colors.black} />
        </TouchableOpacity>
        <View className='flex-row space-x-3'>
          {
            onDeletePress &&
            <View className={isProcessing ? 'w-[90]' : 'w-[80]'}>
              <SubmitButton
                label='Delete'
                onPress={onDeletePress}
                isProcessing={isProcessing}
                isDisable={isDisable}
                isSecondary
              />
            </View>
          }
          {
            onButtonPress &&
            <View className={isProcessing ? 'w-[90]' : 'w-[80]'}>
              <SubmitButton
                label='Save'
                onPress={onButtonPress}
                isProcessing={isProcessing}
                isDisable={isDisable}
              />
            </View>
          }
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-row justify-between items-center mx-4 ${IS_ANDROID && 'mt-6'}`}>
      { isPrimary ? <Primary /> : <Secondary />}
    </View>
  );
}

export default SafeAreaProfileHeader;