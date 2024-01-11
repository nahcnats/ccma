import { View, Text } from 'react-native';
import React from 'react';

import SocialLinks from './SocialLinks';
import { CreativeProfileType } from '../../types/profile';

interface CreativeProfileSocialProps {
    data: CreativeProfileType | undefined
    role: string
}

const CreativeProfileSocial = ({ data, role }: CreativeProfileSocialProps) => {
    return (
        <View>
            <View className="flex-row flex-1 justify-between items-center">
                {/* <Text className='font-semibold dark:text-white'>{t('profileScreen.myNetwork')}</Text> */}
                <Text className='font-semibold text-base dark:text-white'>My Links</Text>
            </View>
            <View className='my-2' />
            <SocialLinks role={role} urls={data?.userLinks || []} />
        </View>
    )
}

export default CreativeProfileSocial;