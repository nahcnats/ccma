import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import colors from 'tailwindcss/colors';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { MAX_HEADER_HEIGHT } from './profileConstants';

const ProfileBanner = ({coverImage}: {coverImage: string}) => {
    return (
        <View className={`${!coverImage && 'bg-gray-300'}`} style={[styles.container]}>
            <FastImage 
                defaultSource={require('../../assets/images/fallback.png')}
                source={coverImage ? { uri: coverImage } : require('../../assets/images/fallback.png')} 
                resizeMode={coverImage ? 'cover' : 'contain'} 
                style={styles.image} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: MAX_HEADER_HEIGHT,
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    }
});

export default ProfileBanner;