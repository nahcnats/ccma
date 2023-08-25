import React from "react";
import { Text } from "react-native";
import { useColorScheme } from "react-native";
import colors from "tailwindcss/colors";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";

import { createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import { 
    LoginScreen,
    ForgotPasswordScreen,
    LandingScreen,
    OnboardingScreen,
    RegisterUsernameScreen,
    CreativeInfoScreen,
    EmployerInfoScreen,
} from "../screens/auth";

import { SecondaryLeft } from "../components/common/headers";

export type AuthNavigationParams = {
    Login: undefined,
    LoginWithProvider: undefined,
    ForgotPassword: undefined,
    Landing: undefined,
    Onboarding: undefined,
    RegisterUsername: undefined,
    CreativeInfo: undefined,
    EmployerInfo: undefined,
}

const Stack = createStackNavigator<AuthNavigationParams>();

export default function() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const defaultNavOptions = {
        headerStyle: {
            backgroundColor: 'transparent'
        },
        headerShadowVisible: false,
        headerTintColor: colorScheme === 'dark' ? colors.white : colors.black,
        ...TransitionPresets.SlideFromRightIOS
    }
    const secondaryNavOptions = (title?: string) => {
        return {
            headerTitle: title || '',
            headerLeft: () => <SecondaryLeft />
        }
    }

    return (
        <Stack.Navigator 
            initialRouteName="Landing" 
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name="Landing"
                component={LandingScreen}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="Onboarding"
                component={OnboardingScreen}
                options={() => secondaryNavOptions(`${t('onboarding.title')}`)}
                />
            <Stack.Screen 
                name="RegisterUsername"
                component={RegisterUsernameScreen}
                options={() => secondaryNavOptions('Your Username')}
            />
            <Stack.Screen 
                name="CreativeInfo"
                component={CreativeInfoScreen}
                options={() => secondaryNavOptions('Basic Info')}
            />
            <Stack.Screen 
                name="EmployerInfo"
                component={EmployerInfoScreen}
                options={() => secondaryNavOptions('Basic Info')}
            />
            <Stack.Screen 
                name="Login"
                component={LoginScreen}
                options={() => secondaryNavOptions()}
            />
            <Stack.Screen 
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={() => secondaryNavOptions()}
            />
        </Stack.Navigator>
    )
}