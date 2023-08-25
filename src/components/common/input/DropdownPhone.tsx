import { 
    View,
    Text,
    useColorScheme,
    StyleSheet
} from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';

import { IS_ANDROID } from '../../../utils';
import { IconDown } from '../../../assets/icons';

interface DropdownSearchProps {
    label?: string
    placeholder?: string
    data: Object[]
    onSelected: Function
    [x: string]: any
}

const DropdownPhone = ({ label, placeholder, data, onSelected, ...rest }: DropdownSearchProps ) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const [value, setValue] = useState<number | null>(null);
    const [isFocus, setIsFocus] = useState(false);
    const bgColor = colorScheme === 'dark' && colors.white;

    const onSelectedHandler = (id: number) => {
        setValue(id);
        setIsFocus(false);
        onSelected(id);
    }   

    return (
        <>
            {
                label ? <Text className={`font-bold border-gray-300 rounded-lg ${colorScheme === 'dark' && 'text-white'}`}>{label}</Text> : null
            }
            <View className='px-1 justify-center rounded-md '>
                <Dropdown
                    style={[styles.container, IS_ANDROID && styles.iOS]}
                    placeholderStyle={[styles.fonts, styles.placeholder]}
                    inputSearchStyle={[styles.fonts]}
                    itemTextStyle={[styles.fonts]}
                    selectedTextStyle={styles.fonts}
                    placeholder={placeholder ? placeholder : ''}
                    data={data}
                    search
                    labelField='callingCode'
                    valueField='id'
                    searchPlaceholder={`${t('commonActions.search')}...`}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item: any) => onSelectedHandler(item.id)}
                    renderRightIcon={() => (
                        <IconDown size={16} color={colors.black} />
                    )}

                    {...rest}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    fonts: {
        fontSize: 14
    },
    placeholder: {
        color: 'rgba(0, 0, 0, 0.3)'
    },
    container: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 6,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        marginTop: 8
    },
    iOS: {
        paddingVertical: 2,
    }
})

export default DropdownPhone;