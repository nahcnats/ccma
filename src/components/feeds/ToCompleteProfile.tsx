import React from 'react';
import { View, TouchableOpacity, Text, Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from 'tailwindcss/colors';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { IconRight } from '../../assets/icons';
import OrangeTickProgress from '../common/OrangeTickProgress';
import themeColors from '../../constants/theme';
import MedalIcon from '../../assets/icons/svgs/Medal.svg';

const ToCompleteProfle = ({ show }: { show?: boolean }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    
    if (!show) return null;

    return (
        // <OrangeTickProgress height={50} hidePercent hideBorder>
            // <TouchableOpacity className="py-4 bg-amber-500" onPress={() => navigation.navigate('UploadYourself')}>
            //     <Text className="self-center text-white font-medium">
            //         {t('feedScreen.completeYourProfilePrompt')}
            //         <IconRight color={colors.white} size={14} />
            //     </Text>
            // </TouchableOpacity>
            <Pressable 
                className='flex-row justify-between items-center bg-colors-new_1' 
                onPress={() => navigation.navigate('UploadYourself')}
            >
                <View
                    style={{
                        width: 5,
                        height: 84,
                        backgroundColor: themeColors.borderLeft
                    }}
                />
                <View className='flex-row flex-1 items-center space-x-3'>
                    <View className='ml-4'>
                        <MedalIcon height={50} width={50} />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-white font-bold text-lg'>Complete your profile</Text>
                        <View className='my-1' />
                        <Text className='text-white'>Tab here to earn a badge on your profile -- it's a few steps away!</Text>
                    </View>
                </View>
                <View className='mx-4'>
                    <IconRight color={colors.white} size={20} />
                </View>
            </Pressable>
        // </OrangeTickProgress>
        
    );
}

export default ToCompleteProfle; 