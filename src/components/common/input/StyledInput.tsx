import { 
    View, 
    Text, 
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    useColorScheme, 
} from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';

import { IS_ANDROID } from '../../../utils';

interface TextInputProps extends RNTextInputProps {
    label?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    height?: number | undefined
    minHeight?: number | undefined
    onChangeText: (text: string) => void
}

const StyledInput = (props: TextInputProps) => {
    const colorScheme = useColorScheme();
    const {
        label,
        value,
        leftIcon,
        rightIcon,
        height,
        minHeight,
        onChangeText,
        ...inputProps
    } = props;
    
    return (
        <View>
            {
                label ? <Text className={`font-bold border-gray-300 rounded-lg ${colorScheme === 'dark' && 'text-white'}`}>{label}</Text> : null
            }
            <View 
                className={`flex-row justify-between items-center mt-2 border border-gray-300 rounded-md bg-white ${IS_ANDROID ? 'px-2' : 'p-2'}`}
                style={{
                    height: height,
                    minHeight: minHeight
                }}
            >
                {leftIcon ? <View className='mr-2'>{leftIcon}</View> : null }
                <RNTextInput
                    className={`flex-1 bg-white dark:text-black ${IS_ANDROID && 'py-1'}`}
                    placeholderTextColor={`${colorScheme === 'dark' && colors.gray[300]}`}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                    textAlignVertical='top'
                    {...inputProps}
                />
                {rightIcon ? <View className='ml-2'>{rightIcon}</View> : null}
            </View>
        </View>
    )
}

export default StyledInput;