import { View, Text } from 'react-native';
import React from 'react';

import ImageSlider from '../common/ImageSlider';

interface ProjectImageProps {
    images: any
    onDeleteImage: () => void
    showDelete: boolean
}

const ProjectImage = ({images, onDeleteImage, showDelete} : ProjectImageProps) => {
    if (!images) {
        return null;
    }

    return (
        <View className='my-4'>
            <ImageSlider images={images} onDeleteImage={onDeleteImage} showDelete={showDelete} size={360} />
        </View>
        
    );
}

export default ProjectImage;