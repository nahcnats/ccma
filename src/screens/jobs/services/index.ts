import server from "../../../API";
import { httpHeaders } from "../../../constants/httpHeaders";
import { 
    JobsTypes, 
    JobTypes, 
    ApplyJobTypes,
    JobsByIdApplicantsType,
    ApplicantStatusesType,
    TokenDetailsType,
    CVsType,
    JobsStatusType,
    JobDropdownsType,
    StripePreBuyType,
    TokenCountType,
    TransactionHistoryType,
    GenericDropDownsType,
    BookmarkJobByIdType,
    BookmarkListType,
    ValidateDiscountType,
} from "../../../types/jobs";
import { GenericProps } from "../../../types/common";
import { apiErrorHandler } from "../../../utils";

export interface GetAllJobsProps {
    token: GenericProps
    params: {
        pageIndex: number
        pageSize: number
        sortByLatestFirst: boolean
        keyword?: string
    }
}

export interface GetAllJobsStatusProps {
    token: GenericProps
    params: {
        pageIndex?: number
        jobPostingStatus?: string
        pageSize: number
    }
}

export interface CloseJobByIdProps {
    token: GenericProps
    params: {
        jobId: number
        rating: number
        reviewRemarks: string
    }
}

export interface BookmarkJobByIdProps {
    token: GenericProps,
    params: {
        jobId: number
    }
}

export interface GetJobByIdApplicantsProps {
    token: GenericProps
    params: {
        jobId: number
    }
}

export interface UploadCvProps {
    token: GenericProps
    params: {
        fileData: string
        fileName: string
    }
}

export interface DeleteCvProps {
    token: GenericProps
    params: {
        uploadId: number
    }
}

export interface UpdateJobApplicantStatusProps {
    token: GenericProps,
    params: {
        jobId: number,
        applicantId: number,
        applicantStatusId: number,
    }
}

export interface StripePreBuyProps {
    token: GenericProps,
    params: {
        amount: number
    }
}

export interface BuyJobTokenProps {
    token: GenericProps,
    params: {
        tokensBought: number
        amount: number
        transactionId: string
    }
}

export interface CitiesDropdownsProps {
    token: GenericProps,
    params: {
        id: number
    }
}

export interface AddJobProps {
    token: GenericProps,
    params: {
        title: string,
        salaryRangeIds: number[],
        workLocationIds: number[],
        workModeIds: number[],
        workingDayIds: number[],
        educationLevelIds: number[],
        employmentTypeIds: number[],
        experienceLevelIds: number[],
        description: string,
        duties: string,
        benefits: string,
        hiringManager: string,
        publishingStatus: string,
        isPaidJob: boolean
    }
}

export interface ValidateDiscount {
    token: GenericProps
    params: {
        discountCode: string
        amount: number
        tokenTypeId: number
    }
}

export async function getAllJobs(payload : GetAllJobsProps): Promise<JobsTypes[]> {
    try {
        const res = await server.post('/jobs/all', payload.params, {
            headers: httpHeaders
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.jobs;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getJobById(jobId: number): Promise<JobTypes> {
    try {
        const res = await server.post('/jobs/by-id', {
            jobId: jobId
        }, {
            headers: httpHeaders
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.job;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getBookmarkJobById(payload: BookmarkJobByIdProps): Promise<BookmarkJobByIdType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/jobs/bookmark/status', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }
        
        const result = await res.data;

        return result.isBookmarked;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function postUpdateBookmarkJobById(payload: BookmarkJobByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/jobs/bookmark/job', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function postUploadCv(payload: UploadCvProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/uploads/upload/cv', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function deleteCv(payload: DeleteCvProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/uploads/delete/cv', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postApplyJobById(payload: ApplyJobTypes): Promise<string> {
    try {
        const res = await server.post('/jobs/apply/job', {
            jobId: payload.jobId,
            cvUploadId: payload.uploadId
        }, {
            headers: {
                'Authorization': `Bearer ${payload.token}`,
                'Content-Type': httpHeaders["content-type"]
            }
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getCvList(token: string): Promise<CVsType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': httpHeaders["content-type"]
        }
        const res = await server.get('/creatives/cvs', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creativeCvs;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getAllJobsStatus(payload: GetAllJobsStatusProps): Promise<JobsStatusType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }
        const res = await server.post('/cced/jobs/all/status', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.jobs;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getJobByIdApplicants(payload: GetJobByIdApplicantsProps): Promise<JobsByIdApplicantsType[]> {
    const headerOptions = {
        'Authorization': `Bearer ${payload.token}`,
        'Content-Type': httpHeaders["content-type"]
    }

    try {
        const res = await server.post('/cced/jobs/by-id', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.applicants;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postCloseJobById(payload: CloseJobByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/jobs/job/close', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getApplicantStatuses(payload: GenericProps): Promise<ApplicantStatusesType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }
        
        const res = await server.post('/cced/jobs/job/applicant/statuses', null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.statuses;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postUpdateJobApplicantStatus(payload: UpdateJobApplicantStatusProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/jobs/job/applicant/status/update', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getTokenDetails(payload: GenericProps): Promise<TokenDetailsType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get('/cced/jobs/token/details', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.tokenDetails;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getJobDropdowns(payload: GenericProps): Promise<JobDropdownsType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get('/utility/data/job/dropdowns', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getNationalitiesDropdowns(payload: GenericProps): Promise<GenericDropDownsType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get('/utility/data/locations/nationalities', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.locationsData;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}


export async function getCountriesDropdowns(payload: GenericProps): Promise<GenericDropDownsType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get('/utility/data/locations/countries', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.locationsData;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getCitiesDropdowns(payload: CitiesDropdownsProps): Promise<GenericDropDownsType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get(`/utility/data/locations/cities/${payload.params.id}`, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.locationsData;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postStripePreBuy(payload: StripePreBuyProps): Promise<StripePreBuyType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/jobs/token/pre-buy', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.response;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postBuyJobToken(payload: BuyJobTokenProps):Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/jobs/token/buy', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getTokenCountByEmployerId(payload: GenericProps):Promise<TokenCountType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.get('/cced/jobs/token/count', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.tokens;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getTransactionHistory(payload: GenericProps): Promise<TransactionHistoryType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/utility/transactions/history', null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.transactions;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postAddJob(payload: AddJobProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/cced/jobs/job/add', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function postValidateDiscount(payload: ValidateDiscount): Promise<ValidateDiscountType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/discounts/code/validate', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.discount;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function getAllBookmarks(payload: GenericProps): Promise<BookmarkListType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Content-Type': httpHeaders["content-type"]
        }

        const res = await server.post('/jobs/bookmarked/all', null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.savedJobs;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}