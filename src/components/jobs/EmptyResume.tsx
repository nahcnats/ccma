import { View, Text, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

import Screen from '../common/Screen';
import { IconFilePDF } from '../../assets/icons';

const EmptyResume = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();

    return (
        <View className='flex-1 justify-center items-center mt-20'>
            <IconFilePDF size={80} color={colorScheme === 'dark' ? colors.white : colors.gray[300]} />
            <View className='my-4' />
                <Text 
                    className={`${colorScheme === 'dark' && 'text-white'}`}
                >
                    <Text className={`${colorScheme === 'dark' && 'text-white'}`}>{t('applyJobScreen.emptyResume1')} <Text className='font-bold'>{t('applyJobScreen.emptyResume2')} </Text> {t('applyJobScreen.emptyResume3')}</Text>
                </Text>
        </View>
    )
}

export default EmptyResume;