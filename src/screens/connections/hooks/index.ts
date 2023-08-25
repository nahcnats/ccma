import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { queryClient } from "../../../App";
import { GenericProps } from "../../../types/common";
import { 
    getCreativeConnections,
    getCreativeExplore,
    CreativeExploreProps,
    CreativeEmployerByIdProps,
    getRequestConnection,
    getAcceptConnection,
    getDeclineConnection,
    creativeProfileById,
    employerProfileById,
    getRequestCancel
} from "../services";
import { CreativeConnectionType, CreativeExploreType } from "../../../types/network";
import { CreativeProfileType, EmployerProfileType } from "../../../types/profile";

/** Queries */ 

export const useCreativeConnections = (payload: GenericProps) => {
    return useQuery<CreativeConnectionType, Error>('creativeConnections', () => getCreativeConnections(payload));
}

// export const useCreativeExplore = (payload: CreativeExploreProps) => {
//     return useInfiniteQuery('creativeExplore', ({ pageParam = 0 }): Promise<CreativeExploreType[]> => getCreativeExplore(pageParam, payload), {
//         getNextPageParam: (lastPage, allPages) => {
//             const nextPage = lastPage?.length === payload.params.pageSize ? allPages.length + 1 : undefined;
//             return nextPage;
//         }
//     });
// }

export const useCreativeView = (payload: CreativeEmployerByIdProps) => {
    return useQuery<CreativeProfileType, Error>('creativeView', () => creativeProfileById(payload));
}

export const useEmployerView = (payload: CreativeEmployerByIdProps) => {
    return useQuery<EmployerProfileType, Error>('employerView', () => employerProfileById(payload));
}

/** End Queries */

/** Mutations */ 

export const useRequestConnection = () => {
    return useMutation((payload: CreativeEmployerByIdProps): Promise<string> => getRequestConnection(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeConnections'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useAcceptConnection = () => {
    return useMutation((payload: CreativeEmployerByIdProps): Promise<string> => getAcceptConnection(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeConnections'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useDeclineConnection = () => {
    return useMutation((payload: CreativeEmployerByIdProps): Promise<string> => getDeclineConnection(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeConnections'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useCancelConnection = () => {
    return useMutation((payload: CreativeEmployerByIdProps): Promise<string> => getRequestCancel(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeConnections'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

/** End Mutations */ 
