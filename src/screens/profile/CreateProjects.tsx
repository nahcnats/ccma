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
import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { nanoid } from '@reduxjs/toolkit';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks';
import { IS_ANDROID, dismissKeyboard, showErrorToast } from '../../utils';
import Screen from '../../components/common/Screen';
import ActionSheet from '../../components/common/ActionSheet';
import { InputFormErrors, TextInput } from '../../components/common/input';
import { SafeAreaProfileHeader } from '../../components/profile';
import FloatingButtons from '../../components/common/floatingButtons';
import { IconEdit } from '../../assets/icons';
import { maxLength, minHeight } from '../../constants/others';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SubmitButton from '../../components/common/SubmitButton';
import { ProjectText, ProjectImage, ProjectImages, ProjectVideo } from '../../components/profile';
import { useDebounce } from '../../hooks';
import { useAddProject } from './hooks';
import { transformContentImages, Content, formatPayloadContents } from './helpers'
import { pickerHeight, pickerWidth } from '../../constants/others';
import { urlPattern } from '../../constants/others';
import { parseEmbed } from '../../utils/youtube_helpers';

interface FormValues {
    projectTitle: string
    projectDesc: string
}

const CreateProjectsScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { ...methods } = useForm<FormValues>();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [isUploading, setIsUploading] = useState(false);
    const [videoLink, setVideoLink] = useState('https://');
    const [b64Image, setB64Image] = useState<any>(null);
    const [b64ImageError, setB64ImageError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<Content[]>([])
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [height, setHeight] = useState(42);
    const [urlError, setUrlError] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['35%'], []);
    const { mutateAsync: addProject } = useAddProject();
    const scrollViewRef = React.useRef<ScrollView>(null);

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef.current?.dismiss();
    }, [isOpen]);

    const handleSheetChanges = useCallback(() => {
        setIsOpen(v => !v);
        if (isOpen) {
            bottomSheetModalRef.current?.dismiss();
        } else {
            bottomSheetModalRef.current?.present();
        }
    }, [isOpen]);

    const projectImageHandler = async () => {
        try {
            const launchResponse = await ImagePicker.openPicker({ 
                mediaType: 'photo', 
                width: pickerWidth,
                height: pickerHeight,
                cropping: true, 
                includeBase64: true 
            });

            if (!launchResponse) {
                return;
            }

            setB64Image({
                fileData: launchResponse.data,
                fileName: launchResponse.filename?.split('.')[0],
                fileType: launchResponse.mime,
                type: 'base64'
            });

        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const addSection = (type: string) => {
        let updated = [...content];
        updated.push({
            id: nanoid(),
            type: type,
            content: '',
            contents: []
        });

        setContent(updated);
    }

    const changeSection = (id: string | number, value: string | any) => {
        let updated = [...content];

        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                updated[i].content = value
            }
        }

        setContent(updated);
    }

    const removeSection = (id: string | number) => {
        const filtered = content.filter(item => item.id !== id);
        setContent(filtered);
        
    }

    const addImage = async () => {
        try {
            const launchResponse = await ImagePicker.openPicker({ mediaType: 'photo', cropping: true, includeBase64: true });

            if (!launchResponse) {
                return;
            }

            let updated = [...content];
            updated.push({
                id: nanoid(),
                type: 'IMAGE',
                contents: [{
                    fileData: launchResponse.data,
                    fileName: launchResponse.filename?.split('.')[0],
                    fileType: launchResponse.mime,
                    type: 'base64'
                }],
                content: ''
            });

            setContent(updated);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const addImages = async () => {
        try {
            const launchResponse = await ImagePicker.openPicker({ mediaType: 'photo', cropping: true, includeBase64: true, multiple: true });

            if (!launchResponse) {
                return;
            }

            let fImages: any[] = [];
            launchResponse.forEach(obj => {
                fImages.push({
                    fileData: obj.data,
                    fileName: obj.filename?.split('.')[0],
                    fileType: obj.mime,
                    type: 'base64'
                });
            });

            let updated = [...content];
            updated.push({
                id: nanoid(),
                type: 'IMAGES',
                contents: fImages,
                content: ''
            });

            setContent(updated);

        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const removeSubImages = (rootId: number | string, index: number) => {
        let updated = [...content];

        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === rootId) {
                updated[i].contents.splice(index, 1);

                if (!updated[i].contents.length) {
                    removeSection(updated[i].id);
                    return;
                }
            }
        }

        setContent(updated);
    }

    const addVideo = () => {
        handleSheetChanges();

        addSection('VIDEO');
    }

    const cancelAddVideo = () => {
        closeBottomSheet();
        const filtered = content.filter(item => item.type === 'VIDEO' && item.content === "")[0]?.id;

        removeSection(filtered);
    }

    const confirmVideo = () => {
        if (videoLink === '') return;

        try {
            const result = parseEmbed(videoLink);

            if (result === null) {
                setUrlError(true);

                setTimeout(() => {
                    setUrlError(false);
                }, 3000);

                return;
            }

            let updated = [...content];

            const id = updated.filter(item => item.type === 'VIDEO' && item.content === "")[0]?.id;

            for (let i = 0; i < updated.length; i++) {
                if (updated[i].id === id) {
                    updated[i].content = videoLink;
                }
            }

            setContent(updated);
            setVideoLink('');
            closeBottomSheet();
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        let projectFileData;
        let projectFileName;

        if (!b64Image || b64Image === null) {
            return;
        } else {
            projectFileData = b64Image.fileData;
            projectFileName = b64Image.fileName;
        }

        if (!projectFileData && !projectFileName) {
            setTimeout(() => {
                setB64ImageError('');
            }, 3000);

            const errTxt = 'Project image is required';
            setB64ImageError(errTxt);
            return;
        }

        try {
            setIsUploading(true);

            const formattedPayload = formatPayloadContents(content);

            if (!formattedPayload) return;

            const payload = {
                token: token,
                params: {
                    title: data.projectTitle,
                    description: data.projectDesc,
                    fileData: projectFileData,
                    fileName: projectFileName,
                    contents: formattedPayload,
                }
            }

            await addProject(payload);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'ProfileTab',
                }
            }); 

            setIsUploading(false);
        } catch (error: any) {
            setIsUploading(false);
            showErrorToast(t('promptTitle.error'), error.message);   
        }
    }

    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        setErrorMessage(errors);
    }
    
    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
                <SafeAreaProfileHeader 
                    isPrimary={false} 
                    onButtonPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                    isProcessing={isUploading}
                    isDisable={isUploading}
                />
                <Screen>
                    <FormProvider {...methods}>
                        <View onStartShouldSetResponder={dismissKeyboard} className='flex-1 justify-between'>
                            <TextInput
                                name='projectTitle'
                                multiline
                                placeholder={`${t('profileScreen.projectTitlePlaceholder')}`}
                                maxLength={100}
                                onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                                rules={{
                                    required: `Project title is required`
                                }}
                            />
                            <View className='mt-1'>
                                <Text className='self-end text-xs dark:text-white'>
                                    {`${methods.watch('projectTitle') ? (methods.watch('projectTitle').length) : 0} / ${100}`}
                                </Text>
                            </View>
                            {methods.formState.errors.projectTitle && <InputFormErrors message={`${errorMessage?.projectTitle?.message}`} />}
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                ref={scrollViewRef}
                                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                            >
                                <View className='mt-6 overflow-hidden rounded-md bg-gray-200'>
                                    <FastImage
                                        source={b64Image ? { uri: `data:${b64Image.fileType};base64,${b64Image.fileData}` } : require('../../assets/images/fallback.png')}
                                        resizeMode={FastImage.resizeMode.cover}
                                        style={{ width: 400, height: 200 }}
                                    />
                                    <TouchableOpacity
                                        onPress={projectImageHandler}
                                        className='absolute left-2 bottom-2 rounded-full bg-white w-10 h-10 items-center justify-center'
                                    >
                                        <IconEdit size={22} color={colors.black} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    b64ImageError !== '' && <InputFormErrors message='Project image is required' />
                                }
                                <View className='my-4' />
                                <TextInput
                                    name='projectDesc'
                                    multiline
                                    numberOfLines={6}
                                    placeholder={`${t('profileScreen.projectDescriptionPlaceholder')}`}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                    rules={{
                                        required: `Project description is required`
                                    }}
                                />
                                {methods.formState.errors.projectDesc && <InputFormErrors message={`${errorMessage?.projectDesc?.message}`} />}
                                <View className='my-4' />
                                {
                                    content.length ? content.map((item, i) => 
                                        <View key={i}>
                                            {
                                                item.type === 'TEXT' ?
                                                    <ProjectText
                                                        value={item.content}
                                                        onChangeText={(val) => changeSection(item.id, val)}
                                                        onRemove={() => removeSection(item.id)}
                                                        showDelete={true}
                                                    /> : item.type === 'IMAGE' ?
                                                    <ProjectImage 
                                                        images={item.contents}
                                                        onDeleteImage={() => removeSection(item.id)}
                                                        showDelete={true}
                                                    /> : item.type === 'IMAGES'?
                                                    <ProjectImages 
                                                        images={item.contents}
                                                        onDeleteImage={(idx) => removeSubImages(item.id, idx)}
                                                        showDelete={true}
                                                    /> : item.type === 'VIDEO' ?
                                                    <ProjectVideo 
                                                        videoUrl={item.content || ''}
                                                        onDelete={() => removeSection(item.id)}
                                                        showDelete={true}
                                                    /> : null
                                            }
                                            
                                        </View>
                                    ) : null
                                }
                            </ScrollView>
                            <FloatingButtons
                                icons={['image', 'images', 'youtube', 'text']}
                                onTextPress={() => addSection('TEXT')}
                                onImagePress={addImage}
                                onImagesPress={addImages}
                                onYoutubePress={addVideo}
                            />
                        </View>
                    </FormProvider>
                </Screen>
                <ActionSheet
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    onDismiss={closeBottomSheet}
                >
                    <View className='flex-1 dark:bg-colors-new_2'>
                        <Screen>
                            <View className='mb-3'>
                                <Text>Copy & paste a video link</Text>
                            </View>
                            <BottomSheetTextInput
                                placeholder='Copy & paste a vidoe link'
                                style={styles.textInput}
                                onChangeText={(e) => setVideoLink(e)}
                                value={videoLink}
                            />
                            {
                                urlError ?
                                <View className="my-2">
                                    <Text className='text-red-500'>Invalid url</Text>
                                </View> : null
                            }
                            <View className='my-4' />
                            <View className='flex-row justify-between'>
                                <View className='w-40'>
                                    <SubmitButton label='Confirm' onPress={confirmVideo} isDisable={videoLink === ''} />
                                </View>
                                <View className='w-40'>
                                    <SubmitButton label='Cancel' onPress={cancelAddVideo} isSecondary />
                                </View>
                            </View>
                        </Screen>
                    </View>
                </ActionSheet>
            </KeyboardAvoidingView>
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
export default CreateProjectsScreen;