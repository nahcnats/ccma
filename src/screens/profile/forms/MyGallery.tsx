import {
    View,
    Text,
    useColorScheme,
    StyleSheet
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';

import { RootState } from '../../../store/store';
import { MainNavigationParams } from '../../../navigators/MainNavigation';
import Screen from '../../../components/common/Screen';
import SubmitButton from '../../../components/common/SubmitButton';
import { 
    convertImageUrlToBase64, 
    showErrorToast, 
    showSuccessToast,
    mediaImagePicker,
    mediaDeleteImage
} from '../../../utils';
import { useUtilties, useAppSelector, useDebounce } from '../../../hooks';
import { useEmployerProfile } from '../hooks';
import ImageSlider from '../../../components/common/ImageSlider';
import { MAX_HEADER_HEIGHT } from '../../../components/profile/profileConstants';
import { useUploadEmployerGallery } from '../hooks';
import { UploadEmployerGalleryProps } from '../services';

export default function MyGalleryForm() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [gallery, setGallery] = useState<any>([]);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data, isSuccess } = useEmployerProfile(payload);
    const { mutateAsync: uploadGallery } = useUploadEmployerGallery();

    useEffect(() => {
        let newGallery: any = [];
        data?.galleryImagesUrls.map(item => {
            newGallery.push({
                fileData: null,
                fileName: null,
                fileType: null,
                type: 'url',
                url: item,
            });
        });

        setGallery(newGallery);
    }, [isSuccess]);

    const uploadImageHandler = async () => {
        try {
            setIsUploading(true);

            let newGallery = [...gallery];
            const result = await mediaImagePicker(newGallery, 5);

            setGallery(result);

            setIsUploading(false);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        let newGallery = [...gallery];
        const result = mediaDeleteImage(newGallery, index);

        setGallery(result);
    }

    const transformImageUrl = async () => {
        let updated: any[] = [...gallery];

        for (let i = 0; i < updated.length; i++) {
            if (updated[i].type === 'url') {
                const fileData = await convertImageUrlToBase64(updated[i].url) as string;
                const fileName = updated[i].url?.split('images/')[1];
                const fileType = `image/${fileName?.split('.').pop()}`;

                updated[i].type = 'base64';
                updated[i].fileData = fileData;
                updated[i].fileName = fileName;
                updated[i].mimeType = fileType;
            }
        }

        setGallery(updated);
    }

    const handleSubmit = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            await transformImageUrl();            

            const onlyBase64 = gallery.filter((item: any) => item.type === 'base64');
            let fImages: object[] = [];

            onlyBase64.map((item: any)=> fImages.push({
                fileData: item.fileData,
                fileName: item.fileName,
            }));

            const payload = {
                token: token,
                params: fImages
            } as UploadEmployerGalleryProps;

            await uploadGallery(payload);
            
            setIsLoading(false);
            showSuccessToast(t('promptTitle.success'), 'Profile saved');
            navigation.navigate('Drawer', {
                screen: 'Profile'
            });
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <Screen>
            <View className='mt-6'>
                {
                    gallery.length 
                        ? <View>
                            <Text className='self-end text-base text-sky-600' onPress={uploadImageHandler} disabled={isUploading}>{t('editProfileScreen.actions.addMore')}</Text>
                            <View className='my-3' />
                            <ImageSlider images={gallery} size={300} showDelete onDeleteImage={(index) => removeImage(index)} />
                        </View>
                        : <View className=' h-[260] bg-gray-300 rounded-lg mx-4'>
                            <FastImage style={styles.image} resizeMode='contain' source={require('../../../assets/images/fallback.png')} />
                        </View>      
                }
            </View>
            <View className='my-4' />
            <SubmitButton
                label={gallery.length ? 'Save' : 'Showcase your culture'}
                onPress={gallery.length ? () => debounce(handleSubmit) : uploadImageHandler}
                isProcessing={isLoading}
                isDisable={gallery.length ? isUploading : isLoading}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: MAX_HEADER_HEIGHT,
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    }
});