import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { ReactNode, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { nanoid } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';

import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { IS_ANDROID, convertImageUrlToBase64, dismissKeyboard, showErrorToast } from '../../utils';
import Screen from '../../components/common/Screen';
import { InputFormErrors, TextInput } from '../../components/common/input';
import { SafeAreaProfileHeader } from '../../components/profile';
import FloatingButtons from '../../components/common/floatingButtons';
import { IconEdit } from '../../assets/icons';
import { minHeight } from '../../constants/others';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SubmitButton from '../../components/common/SubmitButton';
import { ProjectText, ProjectImage, ProjectImages, ProjectVideo } from '../../components/profile';
import { useDebounce } from '../../hooks';
import { useCreativePortfolioById } from './hooks';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import Loading from '../../components/common/Loading';
import { useFocusEffect } from '@react-navigation/native';

interface FormValues {
    projectTitle: string
    projectDesc: string
}

type Props = StackScreenProps<MainNavigationParams, 'ProjectsDetail'>;

const ProjectsDetailScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { id } = route.params;
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [content, setContent] = useState<any[]>([])
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const payload = {
        token: token,
        params: {
            id: id
        }
    }
    const { data, isLoading, isSuccess, isError, error: rqError, refetch } = useCreativePortfolioById(payload);
    const [b64Image, setB64Image] = useState<any>(null);
    const [b64ImageError, setB64ImageError] = useState('');
    useRefreshOnFocus(refetch);

    const formatContentHandler = () => {
        if (!data?.contents) return;

        let updated = [...content];
        for (const content of data?.contents) {
            if (content.contentType === 'IMAGES') {
                let fImages: any[] = [];

                for (const item of content.contents) {
                    fImages.push({
                        fileData: null,
                        fileName: null,
                        fileType: null,
                        type: 'url',
                        url: item.imageUrl
                    });
                }

                updated.push({
                    id: nanoid(),
                    type: 'IMAGES',
                    content: fImages
                });
            }

            if (content.contentType === 'IMAGE') {
                let fImages: any[] = [];

                fImages.push({
                    fileData: null,
                    fileName: null,
                    fileType: null,
                    type: 'url',
                    url: content.imageUrl
                });

                updated.push({
                    id: nanoid(),
                    type: 'IMAGE',
                    content: fImages
                });
            }

            if (content.contentType === 'TEXT') {
                updated.push({
                    id: nanoid(),
                    type: 'TEXT',
                    content: content.content
                });
            }

            if (content.contentType === 'VIDEO') {
                updated.push({
                    id: nanoid(),
                    type: 'VIDEO',
                    content: content.content
                });
            }
        }

        setContent(updated);
    }

    useFocusEffect(useCallback(() => {
        formatContentHandler();
    }, [isSuccess]));

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }
    
    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <View onStartShouldSetResponder={dismissKeyboard} className='flex-1 justify-between'>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className='text-lg font-bold dark:text-white'>{data?.title || ''}</Text>
                        <View className='mt-6 overflow-hidden rounded-md bg-gray-200'>
                            <FastImage
                                source={
                                    b64Image ? 
                                        { uri: `data:${b64Image.fileType};base64,${b64Image.fileData}` } 
                                        : data?.imageUrl ?
                                        { uri: data?.imageUrl }
                                        : require('../../assets/images/fallback.png')}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{ width: 400, height: 200 }}
                            />
                        </View>
                        {
                            b64ImageError !== '' && <InputFormErrors message='Project image is required' />
                        }
                        <View className='my-4' />
                        <View className='border border-gray-300 rounded-md p-2'>
                            <Text className='text-[400] dark:text-white'>{data?.description || ''}</Text>
                        </View>
                        
                        <View className='my-4' />
                        {
                            content.length ? content.map((item, i) => 
                                <View key={i}>
                                    {
                                        item.type === 'TEXT' ?
                                            <View className='my-4 border border-gray-300 bg-colors-new_4 p-2 rounded-md'>
                                                <Text>{item.content}</Text>
                                            </View>
                                            : item.type === 'IMAGE' ?
                                            <ProjectImage 
                                                images={item.content}
                                                onDeleteImage={() => null}
                                                showDelete={false}
                                            /> : item.type === 'IMAGES'?
                                            <ProjectImages 
                                                images={item.content}
                                                onDeleteImage={(idx) => null}
                                                showDelete={false}
                                            /> : item.type === 'VIDEO' ?
                                            <ProjectVideo 
                                                videoUrl={item.content || ''}
                                                onDelete={() => null}
                                                showDelete={false}
                                            /> : null
                                    }
                                    
                                </View>
                            ) : null
                        }
                    </ScrollView>
                </View>
            </Screen>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    textInput: {
        alignSelf: "stretch",
        // marginHorizontal: 12,
        // marginBottom: 12,
        padding: 12,
        borderWidth: 0.5,
        borderColor: `${colors.gray[300]}`,
        borderRadius: 12,
        backgroundColor: "white",
        color: "black",
        textAlign: 'left'
    },
})
export default ProjectsDetailScreen;