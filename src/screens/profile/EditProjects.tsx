import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet,
    ScrollViewComponent,
    Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { ReactNode, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { nanoid } from '@reduxjs/toolkit';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { IS_ANDROID, convertImageUrlToBase64, dismissKeyboard, showErrorToast } from '../../utils';
import Screen from '../../components/common/Screen';
import ActionSheet from '../../components/common/ActionSheet';
import { InputFormErrors, TextInput } from '../../components/common/input';
import { SafeAreaProfileHeader } from '../../components/profile';
import FloatingButtons from '../../components/common/floatingButtons';
import { IconEdit } from '../../assets/icons';
import { minHeight, urlPattern } from '../../constants/others';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SubmitButton from '../../components/common/SubmitButton';
import { ProjectText, ProjectImage, ProjectImages, ProjectVideo } from '../../components/profile';
import { useDebounce } from '../../hooks';
import { useCreativePortfolioById, useUpdateProject, useDeleteProject } from './hooks';
import { MainNavigationParams } from '../../navigators/MainNavigation';
import Loading from '../../components/common/Loading';
import { transformContentImages, Content, formatPayloadContents } from './helpers'
import { pickerHeight, pickerWidth } from '../../constants/others';
import StyledInput from '../../components/common/input/StyledInput';
import { portfolioById } from './services';
import { CreativePortfolioByIdType } from '../../types/profile';
import { parseEmbed } from '../../utils/youtube_helpers';

interface FormValues {
    projectTitle: string
    projectDesc: string
}

type Props = StackScreenProps<MainNavigationParams, 'EditProjects'>;

const EditProjectsScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { debounce } = useDebounce();
    const { id } = route.params;
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [isUploading, setIsUploading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [videoLink, setVideoLink] = useState('https://');
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<Content[]>([])
    const [errorMessage, setErrorMessage] = useState<FieldErrors>();
    const [height, setHeight] = useState(42);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['35%'], []);
    const payload = {
        token: token,
        params: {
            id: id
        }
    }
    const [urlError, setUrlError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CreativePortfolioByIdType>();
    // const { data, isLoading, isSuccess, isError, error: rqError, refetch } = useCreativePortfolioById(payload);
    const { ...methods } = useForm<FormValues>();
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectTitleError, setProjectTitleError] = useState(false);
    const [projectDescError, setProjectDescError] = useState(false);
    const [b64Image, setB64Image] = useState<any>(null);
    const [b64ImageError, setB64ImageError] = useState('');
    const { mutateAsync: updateProject } = useUpdateProject();
    const { mutateAsync: deleteProject } = useDeleteProject();
    const scrollViewRef = React.useRef<ScrollView>(null);
    // useRefreshOnFocus(refetch);

    const retriveData = async () => {
        try {
            setLoading(true);

            const data = await portfolioById(payload);

            if (data) {
                setData(data);
                setProjectTitle(data?.title);
                setProjectDesc(data?.description);
                await formatContentHandler(data);
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }


    const formatContentHandler = async (contents: CreativePortfolioByIdType) => {
        if (!contents?.contents) return;

        try {
            setIsConverting(true);

            let updated = [...content];
            for (const content of contents?.contents) {

                if (content.contentType === 'IMAGES') {
                    let fImages: any[] = [];

                    for (const item of content.contents) {
                        const result = await transformContentImages(item.imageUrl);

                        if (!result) {
                            setIsConverting(false);
                            return;
                        };

                        fImages.push({
                            fileData: result.fileData,
                            fileName: result.fileName?.split('.')[0],
                            fileType: result.fileType,
                            type: 'base64',
                        });
                    }

                    updated.push({
                        id: nanoid(),
                        type: 'IMAGES',
                        contents: fImages,
                        content: ''
                    });
                }

                if (content.contentType === 'IMAGE') {
                    const result = await transformContentImages(content.imageUrl);

                    if (!result) {
                        setIsConverting(false);
                        return;
                    };

                    updated.push({
                        id: nanoid(),
                        type: 'IMAGE',
                        contents: [
                            {
                                fileData: result.fileData,
                                fileName: result.fileName?.split('.')[0],
                                fileType: result.fileType,
                                type: 'base64',
                            }
                        ],
                        content: ''
                    });
                }

                if (content.contentType === 'TEXT') {
                    updated.push({
                        id: nanoid(),
                        type: 'TEXT',
                        content: content.content,
                        contents: [],
                    });
                }

                if (content.contentType === 'VIDEO') {
                    updated.push({
                        id: nanoid(),
                        type: 'VIDEO',
                        content: content.content,
                        contents: [],
                    });
                }
            }

            setContent(updated);
            setIsConverting(false);   
        } catch (error: any) {
            setIsConverting(false);  
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

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
            contents: [],
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
                if (!updated[i].contents) return;

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

            const id = updated.filter(item => item.type === 'VIDEO' && item.content === '')[0]?.id;

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

    const transformProjectImage = async () => {
        if (!data?.imageUrl || data?.imageUrl === '') return;

        const fileData = await convertImageUrlToBase64(data?.imageUrl);
        const fileName = data?.imageUrl.split('images/')[1];

        return {
            fileData,
            fileName,    
        }
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (projectTitle === '') {
            setProjectTitleError(true);

            setTimeout(() => {
                setProjectTitleError(false);
            }, 3000);

            return;
        }

        if (projectDesc === '') {
            setProjectDescError(true);

            setTimeout(() => {
                setProjectDescError(false);
            }, 3000);

            return;
        }

        let projectFileData;
        let projectFileName;

        if (!b64Image || b64Image === null) {
            const result = await transformProjectImage();

            if (!result) return;

            projectFileData = result?.fileData;
            projectFileName = result?.fileName?.split('.')[0];
        } else {
            projectFileData = b64Image.fileData;
            projectFileName = b64Image.fileName?.split('.')[0];
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
                    id: id,
                    title: projectTitle,
                    description: projectDesc,
                    fileData: projectFileData,
                    fileName: projectFileName,
                    contents: formattedPayload,
                }
            }
            
            await updateProject(payload);

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

    const deleteProjectHandler = async () => {
        Alert.alert('Warning', 'Once project is deleted it cannot be recovered. Are you sure you want to delete this project?', [
            {
                text: 'Cancel',
                onPress: () => null,
                // style: "cancel"
            },
            {
                text: 'Delete',
                onPress: confirmDeleteProject
            }
        ]);
    }

    const confirmDeleteProject = async () => {
        try {
            setIsUploading(true);

            const payload = {
                token: token,
                params: {
                    id: id
                }
            }

            await deleteProject(payload);

            setIsUploading(false);

            navigation.navigate('Drawer', {
                screen: 'Home',
                params: {
                    screen: 'ProfileTab',
                }
            });
        } catch (error: any) {
            setIsUploading(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const TitleError = () => {
        return (
            <View className='my-2'>
                <Text className='text-red-500'>Project Title is required!</Text>
            </View>
        )
    }

    const DescriptionError = () => {
        return (
            <View className='my-2'>
                <Text className='text-red-500'>Project Description is required!</Text>
            </View>
        )
    }

    useFocusEffect(useCallback(() => {
        retriveData();
    }, []));

    if (loading || isConverting) {
        return <Loading />
    }
    
    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
                <SafeAreaProfileHeader 
                    isPrimary={false} 
                    onButtonPress={() => debounce(methods.handleSubmit(onSubmit, onError))}
                    onDeletePress={() => debounce(deleteProjectHandler)}
                    isProcessing={isUploading}
                    isDisable={isUploading}
                />
                <Screen>
                    <FormProvider {...methods}>
                        <View 
                            onStartShouldSetResponder={dismissKeyboard} className='flex-1 justify-between'>
                                <StyledInput 
                                    multiline
                                    value={projectTitle}
                                    maxLength={100}
                                    placeholder={`${t('profileScreen.projectTitlePlaceholder')}`}
                                    onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                                    onChangeText={(text: string) => setProjectTitle(text)}
                                />
                                {
                                    projectTitleError ? <TitleError /> : null
                                }
                            {/* <TextInput
                                name='projectTitle'
                                multiline
                                placeholder={`${t('profileScreen.projectTitlePlaceholder')}`}
                                defaultValue={data?.title || ''}
                                // value={data?.title || ''}
                                onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                                rules={{
                                    required: `Project title is required`
                                }}
                            /> */}
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
                                        source={
                                            b64Image ? 
                                                { uri: `data:${b64Image.fileType};base64,${b64Image.fileData}` } 
                                                : data?.imageUrl ?
                                                { uri: data?.imageUrl }
                                                : require('../../assets/images/fallback.png')}
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
                                    b64ImageError !== '' && <InputFormErrors message={`${t('profileScreen.prompts.projectdImageRequire')}`} />
                                }
                                <View className='my-4' />
                                <StyledInput
                                    multiline
                                    value={data?.description}
                                    numberOfLines={6}
                                    placeholder={`${t('profileScreen.projectDescriptionPlaceholder')}`}
                                    onChangeText={(text: string) => setProjectTitle(text)}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                />
                                {
                                    projectDescError ? <DescriptionError /> : null
                                }
                                {/* <TextInput
                                    name='projectDesc'
                                    multiline
                                    numberOfLines={6}
                                    placeholder={`${t('profileScreen.projectDescriptionPlaceholder')}`}
                                    defaultValue={data?.description || ''}
                                    style={{
                                        minHeight: minHeight
                                    }}
                                    minHeight={minHeight}
                                    rules={{
                                        required: `${t('profileScreen.prompts.projectDescRequired')}`
                                    }}
                                />
                                {methods.formState.errors.projectDesc && <InputFormErrors message={`${errorMessage?.projectDesc?.message}`} />} */}
                                <View className='my-4' />
                                
                                {
                                    content.length ? content.map((item, i) => 
                                        <View key={i}>
                                            {
                                                item.type === 'TEXT' ?
                                                    <ProjectText
                                                        value={item.content || ''}
                                                        onChangeText={(val) => changeSection(item.id, val)}
                                                        onRemove={() => removeSection(item.id)}
                                                        showDelete={true}
                                                    /> 
                                                    : item.type === 'IMAGE' ?
                                                    <ProjectImage 
                                                        images={item.contents}
                                                        onDeleteImage={() => removeSection(item.id)}
                                                        showDelete={true}
                                                    /> : item.type === 'IMAGES' ?
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
                                <Text>{t('profileScree.copyPaste')}</Text>
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
export default EditProjectsScreen;
