import { View, Image, ImageStyle, useColorScheme } from 'react-native';
import React from 'react';

const ROOT: ImageStyle = {
    resizeMode: 'contain'
}

export default function PrimaryLeft() {
    const colorScheme = useColorScheme();
    const lightLogo = require('../../../assets/images/darkLogo.png')
    const darkLogo = require('../../../assets/images/whiteLogo.png')
    const logo = colorScheme === 'dark' ? darkLogo : lightLogo;

    return (
        <View className='ml-4'>
            <Image
                source={logo}
                style={[ROOT, { width: 120, height: 100, marginVertical: -26, marginHorizontal: -6 }]}
            />    
        </View>
    );
}