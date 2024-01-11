import { View, Text } from 'react-native';
import React from 'react';

import SocialLinks from './SocialLinks';
import { EmployerProfileType } from '../../types/profile';

interface EmployerProfileSocialProps {
    data: EmployerProfileType | undefined
    role: string
}

const EmployerProfileSocial = ({ data, role }: EmployerProfileSocialProps) => {
    return (
        <View>
            <Text className='font-semibold text-base dark:text-white'>Our Links</Text>
            <View className='my-2' />
            <SocialLinks role={role} urls={data?.additionalLinksList || []} />
        </View>
        
    );
}

export default EmployerProfileSocial;