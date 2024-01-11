import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import SubTab from '../../../navigators/SubTab';
import { OpenJobs, ExpiredJobs, ClosedJobs } from '../tabs';

export type JobsTabParams = {
    OpenJobs: undefined
    ExpiredJobs: undefined
    ClosedJobs: undefined
}

export type JobsTabOptions = 'OpenJobs' | 'ExpiredJobs' | 'ClosedJobs';

export interface JobsTabProps {
    query: string
    navigation: any
}

const Tab = createMaterialTopTabNavigator<JobsTabParams>();

function JobsTabNavigation() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator tabBar={(props) => <SubTab {...props} />}>
            <Tab.Screen 
                name="OpenJobs"
                options={{ title: `${t('jobScreen.jobsTab.openJobs')}` }}
                component={OpenJobs}
            />
            <Tab.Screen 
                name="ExpiredJobs"
                options={{ title: `${t('jobScreen.jobsTab.expiredJobs')}` }}
                component={ExpiredJobs}
            />
            <Tab.Screen 
                name="ClosedJobs"
                options={{ title: `${t('jobScreen.jobsTab.closedJobs')}` }}
                component={ClosedJobs}
            />
        </Tab.Navigator>
    );
}

export default JobsTabNavigation;