import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";

import { RootState } from "../../store/store";
import { SafeAreaProfileHeader } from '../../components/profile';
import { CreativeProfileScreen, EmployerProfileScreen } from "./";
import { IS_ANDROID } from "../../utils";
import { useAppSelector } from '../../hooks';
import { MAX_HEADER_HEIGHT } from "../../components/profile/profileConstants";

const ProfileScreen = () => {
    const { t } = useTranslation();
    const { token, role, id: loggedInId } = useAppSelector((state: RootState) => state.auth);
    const maxHeight = Dimensions.get('window').height;

    return (
        <View style={{ ...StyleSheet.absoluteFillObject, height: maxHeight, top: IS_ANDROID ? -80 : -45 }}>
            <View className='top-[90] z-10'>
                <SafeAreaProfileHeader isPrimary={true} />
            </View>
            {
                role === 'CREATIVE'
                    ? <CreativeProfileScreen />
                    : <EmployerProfileScreen />
            }
        </View>
    );
}

export default ProfileScreen;