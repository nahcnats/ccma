import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CreativeProfileType } from '../../types/profile';

interface CreativeProfileBioProps {
    data: CreativeProfileType | undefined
}

const CreativeProfileBio = ({data}: CreativeProfileBioProps) => {
    const { t } = useTranslation();
    
    return (
        <View className="pt-2">
            <Text className="font-semibold text-base dark:text-white">{t('profileScreen.aboutMe')}</Text>
            <Text className="mt-2 dark:text-white">{data?.bio}</Text>
        </View>
    );
}

export default CreativeProfileBio;