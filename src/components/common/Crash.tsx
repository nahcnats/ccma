import { View, Text, Image } from 'react-native';
import React from 'react';

import Screen from './Screen';

interface CrashProps {
    message: string
}

const Crash = ({message} : CrashProps) => {
    return (
        <Screen>
            <View className='flex-1 justify-center items-center'>
                <Image 
                    source={require('../../assets/images/crash.png')}
                    style={{
                        height: 400,
                        width: '100%',
                    }}
                    resizeMode='contain'
                />
                <View className='my-1' />
                <Text className='text-base dark:text-white'>
                    Sorry! Something went wrong. Please try again later or contact support
                </Text>
            </View>
        </Screen>
    );
}

export default Crash