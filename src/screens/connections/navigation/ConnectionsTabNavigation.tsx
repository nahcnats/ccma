import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import SubTab from '../../../navigators/SubTab';
import { ExploreConnections, PendingRequests, SentRequests } from '../tabs';

export type ConnectionsTabParams = {
    Explore: undefined
    PendingRequests: undefined
    SentRequests: undefined
}

export type ConnectionsTabOptions = 'Explore' | 'PendingRequests' | 'SentRequests';

export interface ConnectionsTabProps {
    query: string
    navigation: any
}

const Tab = createMaterialTopTabNavigator<ConnectionsTabParams>();

function ConnectionsTabNavigation() {
    const { t } = useTranslation();
    
    return (
        <Tab.Navigator tabBar={(props) => <SubTab {...props} />}>
            <Tab.Screen 
                name="Explore"
                options={{ title: `${t('networkScreen.networkTab.explore')}` }}
                component={ExploreConnections}
            />
            <Tab.Screen 
                name="PendingRequests"
                options={{ title: `${t('networkScreen.networkTab.pendingRequests')}` }}
                component={PendingRequests}
            />
            <Tab.Screen 
                name="SentRequests"
                options={{ title: `${t('networkScreen.networkTab.sentRequests')}` }}
                component={SentRequests}
            />
        </Tab.Navigator>
    );
}

export default ConnectionsTabNavigation;