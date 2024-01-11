import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { AntDesign } from '@expo/vector-icons';

import { IconSearch } from '../../assets/icons';
import { TextInput } from './input';
import { IS_ANDROID } from '../../utils';

interface FormValues {
    query: string
    onQuery: Function
    onSearch: () => void
    onClear: () => void
}

function Search({query, onQuery, onSearch, onClear}: FormValues) {
    const { t } = useTranslation();
    const { ...methods } = useForm<FormValues>();

    const RightIcons = () => {
        return (
            <View className='flex-row items-center'>
                {
                    query && query !== '' ? <TouchableOpacity onPress={onClear} className='mr-2'>
                        <AntDesign name="close" size={20} color={colors.gray[400]} />
                    </TouchableOpacity> : null
                }
                <TouchableOpacity onPress={onSearch}>
                    <IconSearch size={20} color={colors.gray[400]} />
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <FormProvider {...methods}>
            <TextInput
                className={`flex-1 bg-white dark:text-black ${IS_ANDROID && 'py-1'}`}
                name='search'
                placeholder={`${t('commonActions.search')}`}
                value={query}
                onChangeText={(text) => onQuery(text)}
                autoCapitalize='none'
                autoCorrect={false}
                rightIcon={<RightIcons />}
                textAlignVertical='center'
            />
        </FormProvider>
    );
}

export default Search;