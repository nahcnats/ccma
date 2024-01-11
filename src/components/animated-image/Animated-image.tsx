import { View, Text, StyleProp, ViewStyle } from 'react-native';
import React, { forwardRef } from 'react';
import LottieView from "lottie-react-native";

const animations = {
    error: require("./animations/error.json"),
    success: require("./animations/success.json"),
    loadingDark: require("./animations/loading-dark.json"),
    loadingLight: require("./animations/loading-light.json"),
    warn: require("./animations/warn.json"),
};

type AnimationType = keyof typeof animations;

interface AnimatedImageProps {
    animation: AnimationType
    loop?: boolean
    autoPlay?: boolean
    onAnimationFinish?: () => void
    style?: StyleProp<ViewStyle>
    height?: number
    width?: number
    speed?: number
    forwardRef?: any
}

export default function AnimatedImage (props: AnimatedImageProps) {
    const {
        animation,
        height = 130,
        width = 130,
        style,
        autoPlay = true,
        forwardRef,
        ...rest
    } = props;

    return (
        <View style = { [{ height, width }, style] }>
            <LottieView ref={forwardRef} autoPlay={autoPlay} source={animations[animation]} {...rest} />
        </View>
    );
}