import React from "react";
import { DrawerActions, useNavigation} from '@react-navigation/native';
import { SafeAreaView, } from "react-native-safe-area-context";
import { Image, TouchableOpacity, View, ImageStyle, Text } from "react-native";
import { StackHeaderProps } from '@react-navigation/stack'
import { useColorScheme } from "react-native";

import { IS_ANDROID } from "../../utils";
import { IconBars, IconBack } from "../../assets/icons";
import HamburgerIcon from '../../assets/icons/svgs/Hamburger.svg';

interface HeaderProps {
    preset?: "primary" | "secondary"

    stackHeaderProps?: StackHeaderProps
}

const ROOT: ImageStyle = {
    resizeMode: 'contain'
}

const iconColor = "black";
const iconSize = 24;

const PrimaryHeader = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const lightLogo = require('../../assets/images/darkLogo.png')
    const darkLogo = require('../../assets/images/whiteLogo.png')
    const logo = colorScheme === 'dark' ? darkLogo : lightLogo;

    const toggleDrawer = async () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    }

    return (
        <SafeAreaView edges={["top"]} className="z-10 bg-gray-100 dark:bg-black ">
            <View className={`flex flex-row justify-between items-center px-4 ${IS_ANDROID && 'mt-2'}`}>
                <Image 
                    source={logo}  
                    style={[ROOT, {width: 120, height: 100, marginVertical: -26, marginHorizontal: -6}]}
                />
                <TouchableOpacity onPress={toggleDrawer} className="rounded-md bg-white p-2">
                    {/* <IconBars size={24} color={iconColor}  />  */}
                    <HamburgerIcon height={24} width={24} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const SecondaryHeader = (props: StackHeaderProps) => {
    const navigation = useNavigation();

    const goBack = async () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView edges={["top"]}>
            <View className={`flex-row px-4 justify-between mb-4 items-center ${IS_ANDROID && 'mt-[10]'}`}>
                <TouchableOpacity onPress={goBack} style={{ position: 'relative' }}>
                    <IconBack size={iconSize} color={iconColor} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export const Header = (props: HeaderProps) => {
    const { preset = 'primary', stackHeaderProps } = props;

    if (preset === 'primary') {
        return <PrimaryHeader />    
    }

    return <SecondaryHeader {...stackHeaderProps!} />
}