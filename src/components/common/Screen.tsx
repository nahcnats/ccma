import React from 'react';
import { View } from 'react-native';

interface ScreenProps {
    children: React.ReactNode
    [x: string]: any;
}

function Screen({ children, ...props} : ScreenProps) {
    return (
        <View className='flex-1 mx-4 mt-4'  {...props}>
            {children}
        </View>
    );
}

export default Screen;