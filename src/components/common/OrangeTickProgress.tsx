import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import colors from 'tailwindcss/colors';

import { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks';

interface OrangeTickProgressProps {
    height: number
    children?: React.ReactNode
    hidePercent?: boolean
    hideBorder?: boolean
}

export default function OrangeTickProgress({ height, children, hidePercent = false, hideBorder }: OrangeTickProgressProps) {
    const { completionPercentage } = useAppSelector((state: RootState) => state.orangeTick);
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
        load(completionPercentage);
    }, [completionPercentage]);

    return (
        <View className={`items-center bg-gray-200 ${!hideBorder && 'border border-amber-500 rounded-md'}`} style={[styles.progressBar, {height: height}]}>
            <Animated.View
                style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.amber[500], width: width }}
            />
            <View className={`flex-1 ${children && 'justify-center items-center w-[85%]'}`}>
                {
                    children ? children : null
                }
                {
                    hidePercent ? null : <Text className='self-center font-bold text-xs text-gray-700'>{completionPercentage}%</Text>
                }
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        flexDirection: 'row',
    }
});