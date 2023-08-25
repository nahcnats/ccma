import { View, Text } from 'react-native';
import React from 'react';
import { HeaderButton, HeaderButtonProps } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderButtonProps {
    [x: string]: any;
}

const CustomHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps>) => {
    return (
        <HeaderButton 
            {...props}
            IconComponent={Ionicons}
            iconSize={23}
        />
    );
}

export default CustomHeaderButton;