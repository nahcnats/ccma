import { 
    SafeAreaView,
    View,
    Text,
    useColorScheme,
    StyleSheet
} from 'react-native';
import React, { useState } from 'react';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';

import { IS_ANDROID } from '../../../utils';
import { IconDown } from '../../../assets/icons';
import { color } from 'react-native-reanimated';

interface MultiSelectorProps {
    label?: string
    placeholder?: string
    data: Object[]
    onSelectedItems: Function
    [x: string]: any
}

const MultiSelector = ({ label, placeholder, data, onSelectedItems, ...rest }: MultiSelectorProps ) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const [value, setValue] = useState<number | null>(null);
    const [selected, setSelected] = useState<string[]>([])
    const [isFocus, setIsFocus] = useState(false);

    const onSelectedHandler = (item: any) => {
        setSelected(item);
        setIsFocus(false);
        onSelectedItems(item);
    }   

    return (
        <SafeAreaView>
            {
                label ? <Text className={`font-bold border-gray-300 rounded-lg ${colorScheme === 'dark' && 'text-white'}`}>{label}</Text> : null
            }
            <View className='px-1 rounded-md dark:bg-white'>
                <MultiSelect
                    style={[styles.container, IS_ANDROID && styles.iOS]}
                    placeholderStyle={[styles.fonts, styles.placeholder]}
                    inputSearchStyle={styles.fonts}
                    itemTextStyle={styles.fonts}
                    selectedTextStyle={styles.fonts}
                    placeholder={placeholder ? placeholder : ''}
                    data={data}
                    search
                    labelField='value'
                    valueField='id'
                    searchPlaceholder={`${t('commonActions.search')}...`}
                    value={selected}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item: any) => onSelectedHandler(item)}
                    renderRightIcon={() => (
                        <IconDown size={16} color={colors.black} />
                    )}
                    selectedStyle={{
                        borderRadius: 12,
                        backgroundColor: `${colorScheme === 'dark' && colors.white}`
                    }}
                    activeColor={colors.amber[300]}
                    {...rest}
                />
            </View>
        </SafeAreaView>
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
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        marginTop: 8
    },
    iOS: {
        paddingVertical: 2
    }
})

export default MultiSelector;