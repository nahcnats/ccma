import {
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
    TextInput as RNTextInput,
} from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';
import { urlPattern } from '../../../constants/others';
import { IS_ANDROID } from '../../../utils';
import { IconDelete } from '../../../assets/icons';
import InputFormErrors from './InputFormErrors';

interface DynamicTextInputProps {
    index: number
    placeholder: string
    onChangeText: (text: string) => void
    onRemove: () => void
    value: string
}

const DynamicTextInput = ({ index, placeholder, onChangeText, onRemove, value }: DynamicTextInputProps) => {
    const colorScheme = useColorScheme();
    const [errorText, setErrorText] = useState('');

    const errorCheck = () => {
        setTimeout(() => {
            setErrorText('');
        }, 5000);

        if (!urlPattern.test(value)) {
            setErrorText('Invalid Url');
        }
    }

    return (
        <View className='flex-1'>
            <View className='flex-row items-center'>
                <View className='w-[20] mt-2 hidden'>
                    <Text>{index}.</Text>
                </View>
                <View className='flex-row flex-1 items-center space-x-2 mt-2'>
                    <View
                        className={`flex-1 border border-gray-300 rounded-md bg-white ${IS_ANDROID ? 'px-2' : 'p-2'}`}
                    >
                        <RNTextInput
                            autoCapitalize='none'
                            onChangeText={text => onChangeText(text)}
                            value={value}
                            placeholder={placeholder}
                            className={`flex-1 bg-white dark:text-black ${IS_ANDROID && 'py-1'}`}
                            placeholderTextColor={`${colorScheme === 'dark' && colors.gray[300]}`}
                            onBlur={errorCheck}
                        />

                    </View>
                    <TouchableOpacity
                        className='mr-2'
                        onPress={onRemove}
                    >
                        <IconDelete size={24} color={colors.red[500]} />
                    </TouchableOpacity>
                </View>
            </View>
            {errorText !== '' && <InputFormErrors message={errorText} />}
        </View>
    );
}

export default DynamicTextInput;