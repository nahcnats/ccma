import { View, Text } from 'react-native';
import React from 'react';
import ImageSlider from '../common/ImageSlider';

interface ProjectImagesProps {
    images: any
    showDelete: boolean
    onDeleteImage: (index: number) => void
}

const ProjectImages = ({images, showDelete, onDeleteImage}: ProjectImagesProps) => {
    if (!images)  {
        return null;
    }
    
    return (
        <View className='my-4'>
            <ImageSlider images={images} size={300} showDelete={showDelete} onDeleteImage={(index) => onDeleteImage(index)} />
        </View>
    );
}

export default ProjectImages;