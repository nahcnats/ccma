import { View, Text } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../../store/store';
import { useAppSelector } from '../../../hooks';
import Screen from '../../../components/common/Screen';
import SubTab from '../../../navigators/SubTab';
import { PortfolioLinks, WebsiteLinks, Resumes } from './MyLinksTab';

export type MyLinksParams = {
    PortfolioLinks: undefined
    Websites: undefined
    Resumes: undefined
}

export type MyLinksTabOptions = 'Portfolio' | 'Websites' | 'Resume';

const Tab = createMaterialTopTabNavigator<MyLinksParams>();

export default function MyLinks() {
    const { t } = useTranslation();
    const { role } = useAppSelector((state: RootState) => state.auth);

    return (
        <Screen>
            <Tab.Navigator tabBar={(props) => <SubTab {...props} />}
            >
                <Tab.Screen
                    name="PortfolioLinks"
                    options={{ title: `${t('editProfileScreen.myLinksForm.portFolioTitle')}` }}
                    component={PortfolioLinks}
                />
                {/* <Tab.Screen
                    name="Websites"
                    options={{ title: `${t('editProfileScreen.myLinksForm.websiteTitle')}` }}
                    component={WebsiteLinks}
                /> */}
                <Tab.Screen
                    name="Resumes"
                    options={{ title: `${t('editProfileScreen.myLinksForm.resumeTitle')}` }}
                    component={Resumes}
                />
            </Tab.Navigator> 
        </Screen>
    );
}