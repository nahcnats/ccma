import {
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary } from 'react-native-image-picker';
import colors from 'tailwindcss/colors';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '../../store/store';
import { useAppSelector, useDebounce, useRefreshOnFocus } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import { 
  IS_ANDROID, 
  dismissKeyboard, 
  showErrorToast, 
  showSuccessToast, 
  showWarnToast, 
  convertImageUrlToBase64,
  mediaImagePicker,
  mediaDeleteImage,
} from '../../utils';
import { SafeAreaFeedHeader } from '../../components/feeds';
import Screen from '../../components/common/Screen';
import ImageSlider from '../../components/common/ImageSlider';
import FloatingButtons from '../../components/common/floatingButtons';
import Avatar from '../../components/common/Avatar';
import { InputFormErrors, TextInput } from '../../components/common/input';
import { minHeight, maxLength } from '../../constants/others';
import { useUpdateFeed, useFeedDetail } from './hooks';
import { FeedMediaType } from '../../types/common';
import Loading from '../../components/common/Loading';
import { FeedDetailsType } from '../../types/feed';
import { getFeedDetailsById } from './services';
import { useAppState } from '@react-native-community/hooks';

interface FormValues {
  content: string
}

type Props = StackScreenProps<MainNavigationParams, 'EditFeed'>;

const EditFeedScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { debounce } = useDebounce();
  const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
  const { ...methods } = useForm<FormValues>();
  const { profileImageUrl, name, username, token } = useAppSelector((state: RootState) => state.auth);
  const { postId } = route.params;

  const [media, setMedia] = useState<FeedMediaType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<FieldErrors>();
  const currentAppState = useAppState();
  const [data, setData] = useState<FeedDetailsType>();
  const { mutateAsync: updateFeed } = useUpdateFeed();

  const storeMedia = async (value: FeedMediaType[]) => {
    try {
      await AsyncStorage.setItem('media', JSON.stringify(value));
    } catch (error: any) {
      console.log(error);
    }
  }

  const getMedia = async () => {
    try {
      const value = await AsyncStorage.getItem('media');
      if (!value) {
        return;
      }

      const parsedValue = JSON.parse(value);

      if (parsedValue !== null) {
        setMedia(parsedValue);
      }  
    } catch (error: any) {
      console.log(error);
    }
  }

  const deleteMedia = async () => {
    try {
      await AsyncStorage.removeItem('media');  
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMedia();
  }, [currentAppState]);

  const transformImageUrl = async () => {
    let updated: FeedMediaType[] = [...media];

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

    setMedia(updated);
    storeMedia(updated);
  }

  const retriveFeedDetail = async () => {
    try {
      setIsLoading(true);

      const payload = {
        token: token,
        params: {
          postId: postId
        }
      }

      const result = await getFeedDetailsById(payload);

      if (!result) return;

      let newMedia: FeedMediaType[] = [];
      result.postImages.map(async item => {
        newMedia.push({
          type: 'url',
          url: item,
          fullUrl: item,
          fileData: null,
          fileName: null,
          mimeType: null,
          thumbnail: null,
        });
      });

      setMedia(newMedia); 
      storeMedia(newMedia);

      setData(result);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      showErrorToast(t('promptTitle.error'), error.message);
    }
  }

  useFocusEffect(useCallback(() => {
      retriveFeedDetail();
  }, []));

  const uploadImageHandler = async () => {
    setIsUploading(true);

    try {
      let newImages = [...media];
      const result = await mediaImagePicker(newImages, 5) as FeedMediaType[];
      
      setMedia(result);
      storeMedia(result);
      setIsUploading(false);
    } catch (error: any) {
      setIsUploading(false);
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
      setIsUpdating(true);

      await transformImageUrl();

      const onlyBase64 = media.filter(item => item.type === 'base64');

      let fImages: object[] = [];

      onlyBase64.map(item => {
        fImages.push({
          fileData: item.fileData,
          fileName: item.fileName,
        })
      });

      const payload = {
        token: token,
        params: {
          postId: postId,
          content: data.content,
          images: fImages
        }
      }

      const result = await updateFeed(payload);

      setIsUpdating(false);

      showSuccessToast(t('promptTitle.success'), result);

      deleteMedia();
      navigation.navigate('Drawer', {
        screen: 'Home',
      });
    } catch (error: any) {
      setIsUpdating(false);
      showErrorToast(t('promptTitle.error'), error.message);
    }
  }

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    setErrorMessage(errors);
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
      <SafeAreaFeedHeader
        isPrimary={false}
        onSave={() => debounce(methods.handleSubmit(onSubmit, onError))}
        deleteMediaWhenBack
        isProcessing={isUpdating}
        isDisable={isUpdating}
        isEdit={true}
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
                defaultValue={data?.postContent}
                multiline
                numberOfLines={6}
                textAlignVertical='top'
                maxLength={maxLength}
                style={{
                  minHeight: minHeight
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
                  <View className='mt-8'>
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
              isUploading ? null : debounce(uploadImageHandler)
            }}
          />
        </Screen>
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
export default EditFeedScreen;

function setErrorMessage(errors: FieldErrors<FormValues>) {
  throw new Error('Function not implemented.');
}
