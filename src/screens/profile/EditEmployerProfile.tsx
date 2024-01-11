import { 
    SafeAreaView,
    ScrollView,
    View, 
    Text,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import FastImage from 'react-native-fast-image';
import colors from 'tailwindcss/colors';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';

import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import SubmitButton from '../../components/common/SubmitButton';
import { IconRight } from '../../assets/icons';
import { 
    showErrorToast, 
    apiErrorHandler, 
} from '../../utils';
import { useUtilties, useRefreshOnFocus, useAppSelector } from '../../hooks';
import { useEmployerProfile } from './hooks';
import { httpHeaders } from '../../constants/httpHeaders';
import server from '../../API';
import { pickerWidth, pickerHeight } from '../../constants/others';

interface expandablesType {
    id: number
    name: string
    link: string
}

const expandables = [
    { id: 1, name: 'myCompanyInformation', link: 'MyCompanyForm' },
    { id: 2, name: 'myGallery', link: 'MyGalleryForm' },
    { id: 3, name: 'myLinks', link: 'AdditionalLinks' },
    // { id: 4, name: 'myTopics', link: 'MyTopicsForm' },
    // { id: 5, name: 'myGoals', link: 'MyGoalsForm' },
    { id: 7, name: 'dangerousArea', icon: '❗', link: 'DeleteProfile' },
]

let uploadType: string;

const EditEmployerProfileScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const lastExpandableIndex = expandables.length;
    const [isUploading, setIsUploading] = useState(false);
    const [bannerB64, setBannerB64] = useState<any>(null);
    const [profileB64, setProfileB64] = useState<any>(null);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data: dropdown, isLoading: dropdownisLoading, isError: dropdownIsError, error: dropdownError, refetch: dropDownRefetch } = useUtilties();
    const { data, isLoading, isError, error: rqError, refetch } = useEmployerProfile(payload);
    useRefreshOnFocus(refetch);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    const updateCreativeImages = async (payload: any) => {
        try {
            const services = uploadType === 'COVER'
                ? '/uploads/upload/image/cover'
                : '/uploads/upload/image/profile';

            const headerOptions = {
                'Authorization': `Bearer ${payload.token}`,
                'Content-Type': httpHeaders["content-type"]
            }

            const response = await server.post(services, payload.params, {
                headers: headerOptions,
            });

            if (response.data.status === 'error') {
                throw new Error(response.data.errorMessage);
            }

            return response.data.response;
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }

    const uploadImageHandler = useCallback(async (imageType: string) => {
        try {
            const launchResponse = await ImagePicker.openPicker({ 
                mediaType: 'photo',
                width: pickerWidth,
                height: pickerHeight, 
                cropping: true, 
                freeStyleCropEnabled: true,
                includeBase64: true 
            });

            if (!launchResponse) {
                return;
            }

            uploadType = imageType;

            const b64Image = {
                fileData: launchResponse.data,
                fileName: launchResponse.filename?.split('.')[0],
                fileType: launchResponse.mime,
            }

            const payload = {
                token: token,
                params: b64Image,
            };

            setIsUploading(true);

            await updateCreativeImages(payload);

            if (imageType === 'COVER') {
                setBannerB64(b64Image);
            } else {
                setProfileB64(b64Image);
            }

            setIsUploading(false);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsUploading(false);
        }
    }, []);

    const ProfileItem = ({ index, data }: { index: number, data: expandablesType }) => {
        if (!data) {
            return null;
        }

        return (
            <>
                <View>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate(data.link as never)}
                        className='flex-row justify-between items-center'
                    >
                        <Text className='font-bold text-base dark:text-white'>{t(`editProfileScreen.options.${data.name}`)}</Text>
                        <IconRight size={16} color={colorScheme === 'dark' ? colors.white : colors.black} />
                    </TouchableOpacity>
                    
                </View>
                {
                lastExpandableIndex !== data.id 
                    && <View className="my-4 h-[1px] bg-gray-300" /> 
                }
            </>
        );
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <View className='flex-row justify-between'>
                            <Text className='font-bold text-base dark:text-white'>{t('editProfileScreen.profilePicture')}</Text>
                            <TouchableOpacity
                                onPress={() => uploadImageHandler('PROFILE')}
                            >
                                <Text className='font-[500] text-blue-500'>{t('commonActions.edit')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='self-center my-6'>
                            <Avatar base64={profileB64 ? profileB64 : null} useLocal={profileB64 ? true : false} image={data?.profileImageUrl} size={140} />
                        </View>
                    </View>
                    <View className="my-4 h-[1px] bg-gray-300" />
                    <View>
                        <View className='flex-row justify-between'>
                            <Text className='font-bold text-base dark:text-white'>{t('editProfileScreen.coverPhoto')}</Text>
                            <TouchableOpacity
                                onPress={() => uploadImageHandler('COVER')}
                            >
                                <Text className='font-[500] text-blue-500'>{t('commonActions.edit')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='my-4 rounded-md overflow-hidden bg-gray-200'>
                            <FastImage
                                source={bannerB64 ? { uri: `data:${bannerB64.fileType};base64,${bannerB64.fileData}` } : { uri: data?.profileBannerUrl } || require('../../assets/images/fallback.png')}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{ width: 400, height: 200 }}
                            />
                        </View>
                    </View>
                    <View className="my-4 h-[1px] bg-gray-300" />
                    {
                        expandables.map((item, index) => (
                            <ProfileItem key={`${item.id}`} index={item.id} data={item} />

                        ))
                    }
                    <View className="my-4 h-[1px] bg-gray-300" />
                    {/* <Text className='font-bold text-base dark:text-white'>{t('editProfileScreen.options.dangerousArea')}</Text>
                    <View className='my-2' />
                    <SubmitButton
                        label={t('editProfileScreen.actions.deleteAccount')}
                        onPress={() => null}
                    /> */}
                    <View className='my-2' />
                </ScrollView>
            </Screen>
        </SafeAreaView>
    );
}

export default EditEmployerProfileScreen;