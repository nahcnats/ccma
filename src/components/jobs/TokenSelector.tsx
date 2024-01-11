import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from 'tailwindcss/colors';

import { IconCheckCircle } from '../../assets/icons';

interface TokenSelectorProps {
    onSelect: (type: string) => void
    selectedType: string
}

const TokenSelector = ({ onSelect, selectedType } : TokenSelectorProps) => {
    return (
        <View className='flex-row justify-between border border-gray-400 rounded-lg'>
            <TouchableOpacity className={`p-3 flex-1 flex-row space-x-2 justify-center items-center border-r ${selectedType === 'BASIC' && 'bg-gray-300'}`} onPress={() => onSelect('BASIC')}>
                {
                    selectedType === 'BASIC' && <IconCheckCircle size={16} color={colors.black} />
                }
                <Text className={`self-center ${selectedType !== 'BASIC' && 'dark:text-white'}`}>Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`p-3 flex-1 flex-row space-x-2 justify-center items-center ${selectedType === 'PREMIUM' && 'bg-gray-300'}`} onPress={() => onSelect('PREMIUM')}>
                {
                    selectedType === 'PREMIUM' && <IconCheckCircle size={16} color={colors.black} />
                }
                <Text className={`self-center ${selectedType !== 'PREMIUM' && 'dark:text-white'}`}>Premium</Text>
            </TouchableOpacity>
        </View>
    );
}

export default TokenSelector;