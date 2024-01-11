import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { queryClient } from "../../../App";
import { 
    ApplyJobTypes, 
    CVsType, 
    JobTypes, 
    JobsStatusType,
    JobsByIdApplicantsType,
    ApplicantStatusesType,
    TokenDetailsType,
    JobDropdownsType,
    TokenCountType,
    TransactionHistoryType,
    GenericDropDownsType,
    BookmarkJobByIdType,
    BookmarkListType,
    JobsTypes,
} from "../../../types/jobs";
import { GenericProps } from "../../../types/common";
import { 
    postApplyJobById,
    getCvList, 
    getJobById, 
    postUploadCv,
    UploadCvProps,
    getAllJobsStatus, 
    GetAllJobsStatusProps,
    getJobByIdApplicants,
    GetJobByIdApplicantsProps,
    postCloseJobById,
    CloseJobByIdProps,
    getApplicantStatuses,
    UpdateJobApplicantStatusProps,
    postUpdateJobApplicantStatus,
    getTokenDetails,
    getJobDropdowns,
    getTokenCountByEmployerId,
    BuyJobTokenProps,
    postBuyJobToken,
    getTransactionHistory,
    getCountriesDropdowns,
    getCitiesDropdowns,
    CitiesDropdownsProps,
    postAddJob,
    AddJobProps,
    postUpdateBookmarkJobById,
    BookmarkJobByIdProps,
    getBookmarkJobById,
    getNationalitiesDropdowns,
    getAllBookmarks,
    getAllJobs,
    GetAllJobsProps,
    deleteCv,
    DeleteCvProps,
} from "../services";

/** Queries */ 

// export const useFeedList = (payload: GetAllJobsProps) => {
//     return useInfiniteQuery('jobsList', ({ pageParam = 0 }): Promise<JobsTypes[]> => getAllJobs(pageParam, payload), {
//         getNextPageParam: (lastPage, allPages) => {
//             const nextPage = lastPage?.length === payload.params.pageSize ? allPages.length + 1 : undefined;
//             return nextPage;
//         }
//     });
// }

export const useJobById = (jobId: number) => {
    return useQuery<JobTypes, Error>('jobById', () => getJobById(jobId));
}

export const useCreativeCvs = (token: string) => {
    return useQuery<CVsType[], Error>('creativeCvs', () => getCvList(token));
}

export const useOpenJobs = (payload: GetAllJobsStatusProps) => {
    return useQuery<JobsStatusType[], Error>('openJobs', () => getAllJobsStatus(payload));
}

export const useExpiredJobs = (payload: GetAllJobsStatusProps) => {
    return useQuery<JobsStatusType[], Error>('expiredJobs', () => getAllJobsStatus(payload));
}

export const useClosedJobs = (payload: GetAllJobsStatusProps) => {
    return useQuery<JobsStatusType[], Error>('closedJobs', () => getAllJobsStatus(payload));
}

export const useBookmarkJobById = (payload: BookmarkJobByIdProps) => {
    return useQuery<BookmarkJobByIdType, Error>('bookmarkJobById', () => getBookmarkJobById(payload));
}

export const useJobByIdApplicants = (payload: GetJobByIdApplicantsProps) => {
    return useQuery<JobsByIdApplicantsType[], Error>('jobByIdApplicants', () => getJobByIdApplicants(payload));
}

export const useApplicantStatuses = (payload: GenericProps) => {
    return useQuery<ApplicantStatusesType[], Error>('applicantsStatuses', () => getApplicantStatuses(payload));
}

export const useTokenDetails = (payload: GenericProps) => {
    return useQuery<TokenDetailsType[], Error>('tokenDetails', () => getTokenDetails(payload));
}

export const useJobDropdowns = (payload: GenericProps) => {
    return useQuery<JobDropdownsType, Error>('employmentTypes', () => getJobDropdowns(payload));
}

export const useNationalitiesDropdowns = (payload: GenericProps) => {
    return useQuery<GenericDropDownsType[], Error>('nationalities', () => getNationalitiesDropdowns(payload));
}

export const useCountriesDropdowns = (payload: GenericProps) => {
    return useQuery<GenericDropDownsType[], Error>('countries', () => getCountriesDropdowns(payload));
}

export const useCitiesDropdowns = (payload: CitiesDropdownsProps) => {
    return useQuery<GenericDropDownsType[], Error>('cities', () => getCitiesDropdowns(payload), {
        enabled: payload.params.id !== 0
    });
}

export const useTokensCount = (payload: GenericProps) => {
    return useQuery<TokenCountType[], Error>('tokensCount', () => getTokenCountByEmployerId(payload));
}

export const useTransactioHistory = (payload: GenericProps) => {
    return useQuery<TransactionHistoryType[], Error>('transactionHistory', () => getTransactionHistory(payload));
}

export const useBookmarkList = (payload: GenericProps) => {
    return useQuery<BookmarkListType[], Error>('bookmarkList', () => getAllBookmarks(payload));
}

/** End Queries */ 

/** Mutations */ 

export const useAddCreativeCv = () => {
    return useMutation((payload: UploadCvProps): Promise<string> => postUploadCv(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeCvs'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useDeleteCreativeCv = () => {
    return useMutation((payload: DeleteCvProps): Promise<string> => deleteCv(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creativeCvs'] });
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useApplyJobById = () => {
    return useMutation((payload: ApplyJobTypes): Promise<string> => postApplyJobById(payload), {
        onError: (error) => {
            throw error;
        }
    });
}

export const useCloseJobById = () => {
    return useMutation((payload: CloseJobByIdProps): Promise<string> => postCloseJobById(payload), {
        onError: (error) => {
            throw error;
        }
    });
}

export const useUpdateBookmarkJobById = () => {
    return useMutation((payload: BookmarkJobByIdProps): Promise<string> => postUpdateBookmarkJobById(payload), {
        onError: (error) => {
            throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries('bookmarkJobById');
            queryClient.invalidateQueries('bookmarkList');
        }
    });
}

export const useUpdateJobApplicantStatus = () => {
    return useMutation((payload: UpdateJobApplicantStatusProps): Promise<string> => postUpdateJobApplicantStatus(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('jobByIdApplicants');
        },
        onError: (error) => {
            throw error;
        }
    });
}

export const useBuyJobToken = () => {
    return useMutation((payload: BuyJobTokenProps): Promise<string> => postBuyJobToken(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('tokensCount');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useAddJob = () => {
    return useMutation((payload: AddJobProps): Promise<string> => postAddJob(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('openJobs');
        },
        onError: (error) => {
            throw error;
        }
    })
}


/** End Mutations */ 