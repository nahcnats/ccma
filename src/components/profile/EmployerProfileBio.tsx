import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmployerProfileType } from '../../types/profile';

interface EmployerProfileBioProps {
    data: EmployerProfileType | undefined
}

const EmployerProfileBio = ({data} : EmployerProfileBioProps) => {
    const { t } = useTranslation();

    return (
        <>
            <View className="border-b border-gray-300 pt-2 pb-4">
                <Text className="text-black font-semibold text-base dark:text-white">{t('profileScreen.companySize')}</Text>
                <Text className="mt-2 dark:text-white">{data?.employerCompanySize}</Text>
            </View>
            <View className="mt-2 pt-2 pb-4">
                <Text className="text-black font-semibold text-base dark:text-white">{t('profileScreen.companyOverview')}</Text>
                <Text className="mt-2 dark:text-white">{data?.bio}</Text>
            </View>
        </>
    );
}

export default EmployerProfileBio;