import { TouchableOpacity,  Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { IS_ANDROID } from '../../utils';
import themeColor from '../../constants/theme';
import { isLoading } from 'expo-font';

interface OnboardingFooterProps {
    onNext: () => void
    loading?: boolean
}

const OnboardingFooter = ({ onNext, loading }: OnboardingFooterProps) => {
    const { t } = useTranslation();

        return (
            <TouchableOpacity
                className={`p-2 rounded-lg bg-colors-new_1 ${IS_ANDROID && 'mb-4'} ${loading && 'opacity-50'}`}
                onPress={onNext}
                disabled={loading}
        >
                <Text className='text-white self-center'>{loading ? t('loading') : t('commonActions.next')}</Text>
            </TouchableOpacity>
    );
}

export default OnboardingFooter;