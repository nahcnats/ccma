import React, { useCallback, useState, useEffect } from 'react';
import {View, Text, ScrollView, ImageStyle, TouchableOpacity, Pressable, useColorScheme } from 'react-native';
import Carousel, { AdditionalParallaxProps, Pagination } from "react-native-snap-carousel";
import colors from 'tailwindcss/colors';
import { IconDelete } from '../../assets/icons';
import MediaParallax from './MediaParallax';
import MediaParallaxByUrl from './MediaParallaxByUrl';
import { SquareMediaWidth } from '../../utils/dimension';

interface ImageSliderProps {
    images: any[]
    size?: number
    showDelete?: boolean
    onDeleteImage?: (index: number) => void
}

function ImageSliderByUrl({ images, size, showDelete, onDeleteImage }: ImageSliderProps) {
    const colorScheme = useColorScheme();
    const [activeSlide, setActiveSlide] = useState<number>(0);

    // @ts-ignore
    const ListItem = useCallback(({ item,  index }, parallaxProps) => {
        return (
            <View className='relative'>
                { 
                    showDelete && 
                        <Pressable 
                            className='absolute top-[5] right-2 z-50 rounded-full border border-gray-300 bg-white p-2'
                            onPress={() => onDeleteImage?.(index)}
                        >
                            <IconDelete size={24} color={colors.black} />
                        </Pressable>
                }
                <MediaParallaxByUrl media={item} parallaxProps={parallaxProps} />
            </View>
        );
    }, [showDelete, onDeleteImage]);

    if (!images) {
        return null;
    }

    return (
        <>
            <View className='items-center'>
                <Carousel
                    data={images}
                    vertical={false}
                    sliderWidth={SquareMediaWidth.width}
                    itemWidth={SquareMediaWidth.width - 60}
                    onSnapToItem={(index) => setActiveSlide(index)}
                    hasParallaxImages
                    sliderHeight={SquareMediaWidth.width}
                    removeClippedSubviews={false}
                    // @ts-ignore
                    renderItem={ListItem}
                />
                <Pagination
                    dotsLength={images.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{
                        paddingTop: 16,
                        paddingBottom: 0
                    }}
                    dotStyle={{
                        width: 8,
                        height: 8,
                        borderRadius: 5,
                        margin: 0,
                        backgroundColor: `${colorScheme === 'dark' ? colors.gray[200] : "#100F37"}`,
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View>
        </>
        
    )
}

export default ImageSliderByUrl;