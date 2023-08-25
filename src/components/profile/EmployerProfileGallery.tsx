import { View, Text } from 'react-native';
import React from 'react';

import ImageSlider from '../common/ImageSlider';

const EmployerProfileGallery = ({ data }: any) => {

    if (!data) {
        return null;
    }

    return (
        <View className='mt-8'>
            <ImageSlider images={data} size={360} />
        </View>
    );
}

export default EmployerProfileGallery;