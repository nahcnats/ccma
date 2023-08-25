import { View, Text, Animated, StyleSheet, useColorScheme } from 'react-native';
import React, { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';

interface UploadProgressProps {
    height: number
    children?: React.ReactNode
    uploadCounter: number
    hidePercent?: boolean
}

export default function UploadProgress({ height, children, uploadCounter, hidePercent = false }: UploadProgressProps) {
    const counter = useRef(new Animated.Value(0)).current;
    
    const load = (value: number) => {
        Animated.timing(counter, {
            toValue: value,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }

    const width = counter.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp'
    });


    useEffect(() => {
        load(uploadCounter);
    }, [uploadCounter]);

    return (
        <View className='items-center' style={[styles.progressBar, {height: height}]}>
            <Animated.View
                className='rounded-md'
                style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.amber[500], width: width }}
            />
            <View className={`ml-6 ${children && 'justify-center items-center w-[85%]'}`}>
                {
                    children ? children : null
                }
                {
                    hidePercent ? null : <Text className='font-bold text-xs dark:text-white'>{uploadCounter}%</Text>
                }
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
    }
});