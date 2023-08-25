import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import colors from 'tailwindcss/colors';
import themeColor from '../../constants/theme';

import { IS_ANDROID } from '../../utils';
import { IconLeft } from '../../assets/icons';

interface SubmitButtonProps {
    label: string
    isSecondary?: boolean
    isDisable?:boolean
    isProcessing?: boolean
    isTokenRelated?: boolean
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    onPress: () => void
}

export default function SubmitButton({label, isSecondary, isDisable, isProcessing, isTokenRelated, iconLeft, iconRight, onPress}: SubmitButtonProps) {
    const ButtonContent = () => {
        return (
            <View className='flex-row items-center justify-center space-x-3'>
                {iconLeft ? iconLeft : null}
                {
                    isTokenRelated
                        ? <Text className={`self-center font-semibold text-base ${isDisable ? 'text-white' : 'text-gray-500'}`}>{label}</Text>
                        : <Text className={`self-center font-semibold text-base ${isSecondary ? 'text-white' : 'text-white'} ${isDisable && 'text-gray-200'}`}>{label}</Text>
                }
                {
                    isProcessing ? <ActivityIndicator size={14} color={colors.gray[200]} /> : null
                }
                {iconRight ? iconRight : null}
            </View>
        );
    }

    const PrimaryButton = () => {
        return (
            <TouchableOpacity
                className={`justify-center h-10 rounded-lg my-2 bg-colors-new_1 ${IS_ANDROID && 'mb-4'} ${isDisable && 'opacity-50'}`}
                onPress={onPress}
                disabled={isDisable}
            >
                <ButtonContent />
            </TouchableOpacity>
        );
    }

    const SecondaryButton = () => {
        return (
            <TouchableOpacity
                className={`
                    justify-center h-10 rounded-lg my-2 bg-colors-new_1 
                    ${IS_ANDROID && 'mb-4'}
                    ${isDisable && 'opacity-50'}  
                `}
                onPress={onPress}
                disabled={isDisable}
                
            >
                <ButtonContent />
            </TouchableOpacity>
        );
    }

    return isSecondary ? <SecondaryButton /> : <PrimaryButton />;
}