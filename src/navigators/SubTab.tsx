import React from 'react';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

function SubTab(props: MaterialTopTabBarProps) {
    const { state, descriptors, navigation } = props;

    const tabs = state.routes;

    const getOptions = (route: any) => {
        const { options } = descriptors[route.key];
        return options;
    }

    const getLabel = (route: any) => {
        const options = getOptions(route);

        if (options.tabBarLabel !== undefined) {
            return options.tabBarLabel;
        }

        if (options.title !== undefined) {
            return options.title;
        }

        return route.name;
    }

    const isFocused = (index: number) => {
        return state.index === index;
    }

    const onPress = (route: any, index: number) => {
        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused(index) && !event.defaultPrevented) {
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
        }
    };

    const onLongPress = (route: any) => {
        navigation.emit({
            type: "tabLongPress",
            target: route.key,
        });
    };

    return (
        <View className='flex-row'>
            <FlatList 
                horizontal
                showsHorizontalScrollIndicator={false}
                data={tabs}
                contentContainerStyle={{ paddingTop: 16, marginBottom: 20, flex: 1, justifyContent: 'space-between'}}
                keyExtractor={(tab, index) => `Tab.${index}`}
                renderItem={({ item: tab, index}) => {
                    return (
                        <TouchableOpacity
                            onPress={() => onPress(tab, index)}
                            onLongPress={() => onLongPress(tab)}
                            className={`pb-1 border-b-2 ${isFocused(index) ? 'border-amber-500' : 'border-transparent'}`}
                        >
                            <Text className='font-semibold dark:text-white'>{getLabel(tab)}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    )
}

export default SubTab;