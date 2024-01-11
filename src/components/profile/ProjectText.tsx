import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { IconDelete } from '../../assets/icons';

import { TextInput } from '../common/input';
import { minHeight } from '../../constants/others';

interface ProjectTextProps {
    value: string
    onChangeText: (text: string) => void
    onRemove: () => void
    showDelete: boolean
}

const ProjectText = ({ value, onChangeText, onRemove, showDelete }: ProjectTextProps) => {
    const [text, setText] = useState(value);

    const handleOnchangeText = (value: string) => {
        setText(value);
        onChangeText(value);
    }

    return (
        <View className='-mt-4 mb-4'>
            {
                showDelete && 
                <TouchableOpacity className='self-end top-8 right-3 border border-gray-300 bg-white p-2 rounded-full z-10' onPress={onRemove}>
                    <IconDelete size={24} color='black' />
                </TouchableOpacity>
            }
            <TextInput
                name='contentText'
                multiline
                numberOfLines={6}
                placeholder='Your write up'
                style={{
                    minHeight: 100,
                }}
                // minHeight={80}
                onChangeText={(text) => handleOnchangeText(text)}
                value={text}
                autoFocus
            />
        </View>
    )
}

export default ProjectText