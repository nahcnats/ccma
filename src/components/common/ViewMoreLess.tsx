import { View, Text } from 'react-native'
import React from 'react'

export const renderViewMore = (onPress: any) => {
    return (
        <>
            <View className='my-1' />
            <Text onPress={onPress} className='text-sky-600 self-end'>View more</Text>
        </>

    );
}

export const renderViewLess = (onPress: any) => {
    return (
        <>
            <View className='my-1' />
            <Text onPress={onPress} className='text-sky-600 self-end'>View less</Text>
        </>

    );
}