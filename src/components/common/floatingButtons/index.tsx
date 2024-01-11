import { View, Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useRef } from 'react';
import { useColorScheme } from 'react-native';
import colors from 'tailwindcss/colors';
import themeColor from '../../../constants/theme';

import { IconAdd, IconText, IconYoutube, IconImage, IconImages } from '../../../assets/icons';

interface FloatingButtonsProps {
    icons: string[]
    onTextPress?: () => void
    onYoutubePress?: () => void
    onImagesPress?: () => void
    onImagePress?: () => void
    [x: string]: any
}

const FloatingButtons = ({icons, onTextPress, onYoutubePress, onImagesPress, onImagePress, ...props}: FloatingButtonsProps) => {
    const colorScheme = useColorScheme();
    const animation = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);
    const childIconSize = 20;
    const iconColor = colors.white;
    
    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg']
                })
            }
        ]
    }

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true
        }).start();

        setIsOpen(v => !v);
    }

    const ChildButton = ({ icon, index } : {icon: string, index: number}) => {
        let pressAction;
        let iconComponent;

        if (icon === 'text') {
            pressAction = () => {
                if (onTextPress) {
                    toggleMenu();
                    onTextPress();
                }
            };
            iconComponent = <IconText size={childIconSize} color={iconColor} />;
        }

        if (icon === 'youtube') {
            pressAction = () => {
                if (onYoutubePress) {
                    toggleMenu();
                    onYoutubePress();
                }
            };
            iconComponent = <IconYoutube size={childIconSize} color={iconColor} />;
        }

        if (icon === 'images') {
            pressAction = () => {
                if (onImagesPress) {
                    toggleMenu();
                    onImagesPress();
                }
            };
            iconComponent = <IconImages size={childIconSize} color={iconColor} />;
        }

        if (icon === 'image') {
            pressAction = () => {
                if (onImagePress) {
                    toggleMenu();
                    onImagePress();
                }
            };
            iconComponent = <IconImage size={childIconSize} color={iconColor} />;
        }

        return (
            <TouchableWithoutFeedback onPress={pressAction}>
                <Animated.View
                    className='justify-center items-center rounded-full h-12 w-12 mb-6 bg-colors-new_1'
                    style={{
                        transform: [
                            {
                                scale: animation,
                            },
                            {
                                translateY: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -index]
                                })
                            }
                        ]
                    }}
                >
                    { iconComponent }
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View 
            className='absolute items-center' 
            style={{ bottom: 50, right: 10 }}
            {...props}
        >
            {
                icons && isOpen ? icons.map((item, index) => (
                    <ChildButton key={index} icon={item} index={index + 1} />
                )) : null
            }

            <TouchableWithoutFeedback onPress={toggleMenu}>
                <Animated.View 
                    className='justify-center items-center rounded-full h-16 w-16 dark:bg-gray-300'
                    style={[rotation, { backgroundColor: themeColor.primary}]}
                >
                    <IconAdd size={30} color={iconColor} />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default FloatingButtons;