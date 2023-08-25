import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import colors from 'tailwindcss/colors'

const LoadMore = ({isFetching}: {isFetching: boolean}) => {
    return (
        isFetching ? <View className="mt-4" >
            <ActivityIndicator size='large' color={colors.amber[500]} />
        </View > : null
    );
}

export default LoadMore;