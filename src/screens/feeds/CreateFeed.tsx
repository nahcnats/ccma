import { 
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet, 
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MediaType, launchImageLibrary } from 'react-native-image-picker';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '../../store/store';
import { useAppSelector, useDebounce } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { 
  IS_ANDROID, 
  dismissKeyboard, 
  showErrorToast, 
  showSuccessToast, 
  showWarnToast,
  mediaImagePicker,
  mediaDeleteImage,
} from '../../utils';
import { SafeAreaFeedHeader } from '../../components/feeds';
import Screen from '../../components/common/Screen';
import ImageSlider from '../../components/common/ImageSlider';
import FloatingButtons from '../../components/common/floatingButtons';
import Avatar from '../../components/common/Avatar';
import ActionSheet from '../../components/common/ActionSheet';
import { InputFormErrors, TextInput } from '../../components/common/input';
import { minHeight, maxLength } from '../../constants/others';
import { useAddFeed } from './hooks';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SubmitButton from '../../components/common/SubmitButton';
import * as YoutubeHelper from '../../utils/youtube_helpers';
import { FeedMediaType } from '../../types/common';
import { useAppState } from '@react-native-community/hooks';

interface FormValues {
  content: string
}

const CreateFeedScreen = () => {
  const { t } = useTranslation();
  const { debounce } = useDebounce();
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
  const { ...methods } = useForm<FormValues>();
  const { profileImageUrl, name, username, token } = useAppSelector((state: RootState) => state.auth);
  const [media, setMedia] = useState<FeedMediaType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [youtubeLinkError, setYoutubeLinkError] = useState('');
  const [errorMessage, setErrorMessage] = useState<FieldErrors>();
  const currentAppState = useAppState();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['30%'], []);
  const { mutateAsync: addFeed } = useAddFeed();

  const storeMedia = async (value: FeedMediaType[]) => {
    try {
      await AsyncStorage.setItem('media', JSON.stringify(value));
    } catch (error: any) {
      console.log(error);
    }
  }

  const getMedia = async () => {
    const value = await AsyncStorage.getItem('media');
    if (!value) {
      return;
    }

    const parsedValue = JSON.parse(value);

    if (parsedValue !== null) {
      setMedia(parsedValue);
    }
  }

  const deleteMedia = async () => {
    await AsyncStorage.removeItem('media');
  }

  useFocusEffect(useCallback(() => {
    deleteMedia();
  }, []));

  useEffect(() => { 
    getMedia();
  }, [currentAppState]);

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

  const onAddYouTubeLink = async (url: string) => {
    closeBottomSheet();

    try {
      let newMedia = [...media];
      const result = YoutubeHelper.parseEmbed(url);

      if (result === null) {
        setYoutubeLinkError('Ohh! We could not parse your youtube link. Please make sure that you are using the link given by Youtube share action');
        return;
      }

      const thumbnail = await YoutubeHelper.getThumbnail(result);

      newMedia.push({ 
        type: "Youtube", 
        url: url, 
        fullUrl: url,
        thumbnail: thumbnail,
        fileData: null,
        fileName: null,
        mimeType: null
      });
      setMedia(newMedia);
      storeMedia(newMedia);

    } catch (error: any) {
      showErrorToast(t('promptTitle.error'), error.message);
    }
  };

  const uploadImageHandler = async () => {
    setIsLoading(true);

    try {
      let newImages = [...media];

      const result = await mediaImagePicker(newImages, 5) as FeedMediaType[];

      setMedia(result); 
      storeMedia(result);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      showErrorToast(t('promptTitle.error'), error.message);
    }
  };

  const deleteImageHandler = (index: number) => {
    let newMedia = [...media];
    const result = mediaDeleteImage(newMedia, index);

    setMedia(result);
    storeMedia(result);
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsUploading(true);

      const onlyBase64 = media?.filter(item => item.type === 'base64')
      let fImages: object[] = []
      onlyBase64.map(item => fImages.push({
        fileData: item?.fileData,
        fileName: item?.fileName,
      }));

      const payload = {
        token: token,
        params: {
          content: data.content,
          // videoUrl: media.filter(item => item.type === 'Youtube')[0].url || undefined,
          images: fImages
        }
      }

      const result = await addFeed(payload);

      setIsUploading(false);

      showSuccessToast(t('promptTitle.success'), result);

      deleteMedia();
      navigation.navigate('Drawer', {
        screen: 'Home',
      });
    } catch (error: any) {
      setIsUploading(false);
      showErrorToast(t('promptTitle.error'), error.message);
    }
  }

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    setErrorMessage(errors);
  }


  return (
    <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
      <SafeAreaFeedHeader 
        isPrimary={false} 
        onPost={() => debounce(methods.handleSubmit(onSubmit, onError))}
        deleteMediaWhenBack
        isProcessing={isUploading}
        isDisable={isUploading} 
        isEdit={false} 
      />
      <View className='flex-1' onStartShouldSetResponder={dismissKeyboard}>
        <Screen>
          <FormProvider {...methods}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className='flex-row space-x-3'>
                <Avatar image={profileImageUrl} size={50} />
                <View>
                  <Text className='text-xl font-bold dark:text-white'>{name}</Text>
                  <Text className='text-base font-[500] dark:text-white'>{username}</Text>
                </View>
              </View>
              <View className='my-2' />
              <TextInput
                name='content'
                placeholder={`${t('feedScreen.whatAreYouWorkingOn')}`}
                multiline
                numberOfLines={6}
                textAlignVertical='top'
                maxLength={maxLength}
                style={{
                  minHeight: minHeight
                }}
                rules={{
                  required: 'Please add content before posting.',
                }}
              />
              <View className='mt-1'>
                <Text className='self-end text-xs dark:text-white'>
                  {`${methods.watch('content') ? (methods.watch('content').length) : 0} / ${maxLength}`}
                </Text>
              </View>
              {methods.formState.errors.content && <InputFormErrors message={`${errorMessage?.content?.message}`} />}
              {
                media && media.length > 0 
                  ? 
                    <View>
                      <View className='my-4' />
                        <ImageSlider images={media} showDelete onDeleteImage={(index: number) => deleteImageHandler(index)} />
                    </View> 
                  : 
                    null
              }
            </ScrollView>
          </FormProvider>
          <FloatingButtons
            // icons={['images', 'youtube']}
            icons={['images']}
            // onTextPress={() => console.log('text')}
            // onYoutubePress={handleSheetChanges}
            onImagesPress={() => {
              isLoading ? null : debounce(uploadImageHandler)
            }}
          />
        </Screen>
        <ActionSheet
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onDismiss={closeBottomSheet}
        >
          <View className='flex-1 dark:bg-colors-new_2'>
            <Screen>
              <View className='mb-3'>
                <Text>Copy & paste a Youtube link</Text>
              </View>
              <BottomSheetTextInput 
                placeholder='Copy & paste a Youtube link' 
                style={styles.textInput} 
                onChangeText={(e) => setYoutubeLink(e)}
              />
              { youtubeLinkError !== '' && <InputFormErrors message={youtubeLinkError} /> }
              <View className='my-4' />
              <View className='flex-row justify-between'>
                <View className='w-40'>
                  <SubmitButton label='Confirm' onPress={() => onAddYouTubeLink(youtubeLink)} />
                </View>
                <View className='w-40'>
                  <SubmitButton label='Cancel' onPress={closeBottomSheet} isSecondary />
                </View>
              </View>
            </Screen>
          </View>
        </ActionSheet>
      </View>
    </KeyboardAvoidingView>
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
export default CreateFeedScreen;

function setErrorMessage(errors: FieldErrors<FormValues>) {
  throw new Error('Function not implemented.');
}
