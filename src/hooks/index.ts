import { useFocusEffect } from '@react-navigation/native';
import { useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery, useMutation } from "react-query";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { GenericProps } from '../types/common';
import server from '../API';
import { httpHeaders } from '../constants/httpHeaders';
import { apiErrorHandler } from '../utils';
import { UtilitiesType } from '../types/common';

const BOUNCE_RATE = 2000;

export const useDebounce = () => {
    const busy = useRef(false);

    const debounce = async (callback: Function) => {
        setTimeout(() => {
            busy.current = false;
        }, BOUNCE_RATE);

        if (!busy.current) {
            busy.current = true;
            callback()
        };
    }

    return { debounce };
}

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
    const firstTimeRef = useRef(true)

    useFocusEffect(
        useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch()
        }, [refetch])
    )
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


const getUtilities = async (): Promise<UtilitiesType> => {
    try {
        const headerOptions = {
            'Content-Type': httpHeaders["content-type"]
        }

        const response = await server.get(`/utility/data/default`, {
            headers: headerOptions
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

const getNationalities = async (): Promise<UtilitiesType> => {
    try {
        const headerOptions = {
            'Content-Type': httpHeaders["content-type"]
        }

        const response = await server.get(`/utility/data/locations/nationalities`, {
            headers: headerOptions
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const getCities = async (countryId: number): Promise<UtilitiesType> => {
    try {
        const headerOptions = {
            'Content-Type': httpHeaders["content-type"]
        }

        const response = await server.get(`/utility/data/locations/cities/${countryId}`, {
            headers: headerOptions
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}



export const useUtilties = () => {
    return useQuery<UtilitiesType, Error>('utilities', () => getUtilities());
}

export const useNationalities = () => {
    return useQuery<UtilitiesType, Error>('nationalities', () => getNationalities());
}