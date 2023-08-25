import { 
    View, 
    Text, 
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    useColorScheme, 
} from 'react-native';
import React from 'react';
import {
    useController,
    useFormContext,
    ControllerProps,
    UseControllerProps
} from 'react-hook-form';
import colors from 'tailwindcss/colors';

import { IS_ANDROID } from '../../../utils';

interface TextInputProps extends RNTextInputProps, UseControllerProps {
    label?: string
    defaultValue?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    height?: number | undefined
    minHeight?: number | undefined
}

const ControlledInput = (props: TextInputProps) => {
    const formContext = useFormContext();
    const { formState } = formContext;
    const colorScheme = useColorScheme();
    const {
        label,
        name,
        rules,
        defaultValue,
        leftIcon,
        rightIcon,
        height,
        minHeight,
        ...inputProps
    } = props;

    const { field } = useController({ name, rules, defaultValue });

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
                    onChangeText={field.onChange}
                    value={field.value}
                    textAlignVertical='top'
                    {...inputProps}
                />
                {rightIcon ? <View className='ml-2'>{rightIcon}</View> : null}
            </View>
        </View>
    )
}

export default ControlledInput;