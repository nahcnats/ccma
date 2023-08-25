import { View, Text } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import RootNavigation from '../../navigators/RootNavigation';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useCreativeProfile } from '../../screens/profile/hooks';
import ToCompleteProfle from './ToCompleteProfile';
import { RootState } from '../../store/store';
import { showErrorToast } from '../../utils';

const OrangeTick = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data, isError, error: rqError ,refetch} = useCreativeProfile(payload);
    useRefreshOnFocus(refetch);

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <ToCompleteProfle show={data?.profileStatus && data.profileStatus === 'VERIFIED' ? false : true} />
    );
}

export default OrangeTick