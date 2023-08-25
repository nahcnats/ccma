import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import themeColor from '../../constants/theme';

const CreativeProfileFooter = () => {
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    
    return (
        <View className="mt-6">
            <Pressable
                onPress={() => navigation.navigate('CreateProjects')} 
                // onPress={() => Alert.alert('Under maintenance. To add a new project, please head over to web.cultcreative.asia.')}
                className="py-2 px-4 mb-4 rounded-lg bg-colors-new_1"
            >
                <Text className="self-center text-white font-semibold">Add project</Text>
            </Pressable>
        </View>
    )
}

export default CreativeProfileFooter;