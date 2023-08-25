import React, { useState, useEffect, useCallback } from "react";
import { View, Text, KeyboardAvoidingView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from "@react-navigation/native";
import colors from "tailwindcss/colors";

import { RootState } from "../../store/store";
import Screen from "../../components/common/Screen";
import Search from "../../components/common/Search";
import Loading from "../../components/common/Loading";
import Empty from "../../components/common/Empty";
import { JobItem } from "../../components/jobs";
import { JobsTypes } from "../../types/jobs";
import { getAllJobs } from "./services";
import { useAppSelector } from "../../hooks";
import { dismissKeyboard, IS_ANDROID, showErrorToast } from "../../utils";
import LoadMore from "../../components/common/LoadMore";
import Crash from "../../components/common/Crash";

export default function JobsListingScreen() {
    const { t } = useTranslation();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [limit, setLimit] = useState(10);
    const [jobsCount, setJobsCount] = useState(0);
    const [jobs, setJobs] = useState<JobsTypes[]>([]);
    const [fullData, setFullData] = useState<JobsTypes[]>([]);
    const [filteredData, setFilteredData] = useState<JobsTypes[] > ([]);
    const [query, setQuery] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const init = () => {
        setJobs([]);
        setFullData([]);
        setIsLoading(false);
        setIsFetching(false);
        setPage(0);
    }

    const fetchJobs = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    pageIndex: page,
                    pageSize: limit,
                    sortByLatestFirst: true,
                }
            }
            const result = await getAllJobs(payload);

            if (result && result) {
                setJobs([...jobs, ...result]);
                setFullData([...fullData, ...result]);
                setJobsCount(result.length);
                setIsLoading(false);
                setIsFetching(false);
            }
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsLoading(false);
            setIsFetching(false);
        }
    }

    const initialFetch = () => {
        init();
        setIsLoading(true);
        fetchJobs();
        setIsError(false);
        setErrMessage('');
    }

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = initialFetch();

            return () => unsubscribe;
        }, [])
    );

    useEffect(() => {
        setIsFetching(true)
        fetchJobs();

        return () => {};
    }, [page]);

    const loadMoreData = () => {
        if (isFetching) return;
        
        if (jobsCount < limit) {
            return;
        }
        
        setPage(page + 1);
    }

    const searchHandler = async () => {
        if (!query || query === '') {
            return;
        }
        
        try {
            const payload = {
                token: token,
                params: {
                    pageIndex: page,
                    pageSize: limit,
                    sortByLatestFirst: true,
                    keyword: query
                }
            }
            const result = await getAllJobs(payload);

            if (result && result) {
                if (result.length > limit) {
                    setFilteredData([...filteredData, ...result]);
                    setJobs(filteredData);
                } else {
                    setJobs(result);
                }
                
                setJobsCount(result.length);
                setIsLoading(false);
                // setIsFetching(false);
            }
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsLoading(false);
            setIsError(true);
            setErrMessage(error.message);
            // setIsFetching(false);
        }
    };

    const searchFilter = (text: string) => {
        setQuery(text)
    }

    const clearHandler = () => {
        setQuery('');
        initialFetch();
    }

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Crash message={errMessage} />;
    }

    return (
        <View className="flex-1" onStartShouldSetResponder={dismissKeyboard}>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <View className="flex-1 justify-between">
                        <Search query={query} onSearch={searchHandler} onClear={clearHandler} onQuery={(text: string) => searchFilter(text)} />
                        <View className="flex-1 mt-4">
                            <FlatList
                                data={jobs}
                                // data={data?.pages.map(page => page).flat()}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={({ item }) => <JobItem data={item} />}
                                contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View className='my-2' />}
                                ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                                onEndReachedThreshold={0.3}
                                onEndReached={loadMoreData}
                                onRefresh={initialFetch}
                                refreshing={isLoading}
                                // onEndReached={() => {
                                //     if (hasNextPage) {
                                //         fetchNextPage();
                                //     }
                                // }}
                                ListFooterComponent={<LoadMore isFetching={isFetching} />}
                            />
                        </View>
                    </View>
                </Screen>
            </KeyboardAvoidingView>
        </View>
    );
}