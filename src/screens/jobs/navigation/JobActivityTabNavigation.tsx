import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import SubTab from '../../../navigators/SubTab';
import { SavedJobs, AppliedJobs } from '../tabs';

export type JobsActivityTabParams = {
    SavedJobs: undefined
    AppliedJobs: undefined
}

export type JobsTabOptions = 'SavedJobs' | 'AppliedJobs';

export interface JobsTabProps {
    query: string
    navigation: any
}

const Tab = createMaterialTopTabNavigator<JobsActivityTabParams>();

function JobsActivityTabNavigation() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator tabBar={(props) => <SubTab {...props} />}>
            <Tab.Screen 
                name="SavedJobs"
                options={{ title: `${t('jobScreen.jobsTab.savedJobs')}` }}
                component={SavedJobs}
            />
            <Tab.Screen 
                name="AppliedJobs"
                options={{ title: `${t('jobScreen.jobsTab.appliedJobs')}` }}
                component={AppliedJobs}
            />
        </Tab.Navigator>
    );
}

export default JobsActivityTabNavigation;