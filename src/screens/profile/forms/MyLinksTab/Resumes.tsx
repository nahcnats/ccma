import { SafeAreaView, View, Text, FlatList } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../../../store/store';
import { useAppSelector, useDebounce } from '../../../../hooks';
import { ResumeItem } from '../../../../components/jobs';
import { ResumeListing } from '../../../../components/common/LWR'
import Loading from '../../../../components/common/Loading';
import { useCreativeCvs, useDeleteCreativeCv } from '../../../jobs/hooks';
import { showErrorToast } from '../../../../utils';

export default function Resumes() {
  const { t } = useTranslation();
  const { debounce } = useDebounce();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const { data: cvData, isLoading, isSuccess, isError, error: rqError } = useCreativeCvs(token);
  const { mutateAsync: deleteCv } = useDeleteCreativeCv();

  const deleteCvHandler = async (uploadId: number) => {
    try {
      const payload = {
        token: token,
        params: {
          uploadId: uploadId
        }
      }

      await deleteCv(payload);
    } catch (error: any) {
      showErrorToast(t('promptTitle.error'), error.message);
    }
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (isError) {
    showErrorToast(t('promptTitle.error'), rqError.message);
  }

  return (
    <SafeAreaView className='flex-1'>
      <ResumeListing title={t('editProfileScreen.myLinksForm.addResume')}>
        <FlatList
          data={cvData}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => <ResumeItem
            key={item.uploadId}
            data={item}
            onItemChange={() => null}
            onDelete={() => debounce(() => deleteCvHandler(item.uploadId))}
          />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </ResumeListing>
    </SafeAreaView>
  );
}