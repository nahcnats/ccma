import React from "react";
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';


export default function NotificationListingScreen () {
    const { t } = useTranslation();

    return (
        <View className="flex-1 justify-center mx-auto">
            <Text className="dark:text-white">This page is under construction! Check back in soon</Text>
        </View>
    );
}