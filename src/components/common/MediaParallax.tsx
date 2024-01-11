import React, { useCallback, useState, memo, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import {View, Text, ScrollView, ImageStyle, TouchableOpacity, Pressable } from 'react-native';
import { AdditionalParallaxProps, ParallaxImage } from "react-native-snap-carousel";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import colors from 'tailwindcss/colors';
import { IconDelete, IconPlay } from '../../assets/icons';
import { FeedMediaType } from '../../types/common';
import { SquareMediaWidth } from '../../utils/dimension';

export interface MediaParallaxProps {
    media: FeedMediaType
    parallaxProps?: AdditionalParallaxProps
}

const MediaParallax = memo((props: MediaParallaxProps) => {
    const { media, parallaxProps } = props;
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [image, setImage] = useState<any>('https://placehold.co/600x400');
    const [visible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!media) return;

        let mounted = true;

        if (media.type === 'base64' && media.fileData) {
            setImage(`data:${media.mimeType};base64,${media.fileData}`);
        } 
        
        if (media.type === 'Youtube' && media?.thumbnail) {
            setImage(media.thumbnail);
        } 
        
        if (media.type === 'url' && media.url) {
            setImage(media.url)
        }

        return () => {
            mounted = false;
        }
    }, [media.thumbnail, media.type, media.url]);

    useEffect(() => {
        if (media.type !== 'url') {
            setIsVisible(false);
        }
    }, [media.type]);

    const ViewImage = useCallback(() => {
        let image = [{ 
            uri: media.url
        }] as any;

        return (
            <ImageView
                images={image}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        );
    }, [visible]);

    return (
        <>
            <Pressable className='relative' style={styles.item} onPress={() => setIsVisible(true)}>
                <ParallaxImage
                    source={{ uri: image }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.35}
                    showSpinner
                    {...parallaxProps}
                />
            </Pressable>
            <ViewImage />
        </>
    );
});

const styles = StyleSheet.create({
    item: {
        width: SquareMediaWidth.width - 60,
        height: SquareMediaWidth.width - 60,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: "white",
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "contain",
    },
})

export default MediaParallax;