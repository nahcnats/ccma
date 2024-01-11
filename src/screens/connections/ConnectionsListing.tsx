import React, { useState } from "react";
import { View, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { StackNavigationProp } from '@react-navigation/stack';
import Loading from '../../components/common/Loading';
import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import Screen from "../../components/common/Screen";
import Search from "../../components/common/Search";
import { ConnectionsTabNavigation } from "./navigation";
import { IS_ANDROID, dismissKeyboard } from "../../utils";
import { useCreativeConnections } from './hooks';
import { showErrorToast } from '../../utils';

export default function ConnectionsListingScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [keyword, setKeyword] = useState<string | undefined>();

    const connectionsPayload = {
        token: token
    }

    const { data: connections, isLoading: connectionsIsLoading, isError: connectionIsError, error: connectionsError, refetch: connectionsRefetch } = useCreativeConnections(connectionsPayload);
    useRefreshOnFocus(connectionsRefetch);

    if (connectionsIsLoading) {
        return (
            <Loading />
        );
    }

    if (connectionIsError) {
        showErrorToast(t('promptTitle.error'), connectionsError.message);
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1 justify-between">
            <View onStartShouldSetResponder={dismissKeyboard} className="flex-1">
                <Screen>        
                    <ConnectionsTabNavigation />
                </Screen>
            </View>
        </KeyboardAvoidingView>
    );
}