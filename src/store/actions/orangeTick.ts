import server from "../../API";
import { httpHeaders } from "../../constants/httpHeaders";
import { apiErrorHandler } from "../../utils";
import { AppDispatch } from "../store";

export const UPLOAD = 'UPLOAD';
export const PROFILE = 'PROFILE';
export const CAREERDEETS = 'CAREERDEETS';
export const LINKS = 'LINKS';

interface UploadStepProps {
    completionPercentage: number
    completed: boolean
    profileImageUrl?: string
    bannerImageUrl?: string
}

export const uploadStep = (data: UploadStepProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: UPLOAD,
            completionPercentage: data.completionPercentage,
            completed: data.completed,
            profileImageUrl: data.profileImageUrl,
            bannerImageUrl: data.bannerImageUrl,
        });
    }
}

interface ProfileStepProps {
    completionPercentage: number, 
    completed: boolean
    dateOfBirth?: string
    educationLevel?: number
    employmentType?: number[]
    aboutMe?: string
}

export const profileStep = (data: ProfileStepProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: PROFILE,
            completionPercentage: data.completionPercentage,
            completed: data.completed,
            dateOfBirth: data?.dateOfBirth,
            educationLevel: data?.educationLevel,
            employmentType: data?.employmentType,
            aboutMe: data?.aboutMe,
        });
    }
}

interface CareerDeetsProps {
    completionPercentage: number
    completed: boolean   
    jobType?: number
    salaryRange?: number
    jobTitle?: string
    company?: string
}
export const careerDeetsStep = (data: CareerDeetsProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: CAREERDEETS,
            completionPercentage: data.completionPercentage,
            completed: data.completed,
            jobType: data.jobType,
            salaryRange: data.salaryRange,
            jobTitle: data.jobTitle,
            company: data.company,
        });
    }
}

interface LinksStepProps {
    completionPercentage: number
    completed: boolean   
    nationality?: number
    country?: number
    state?: number
    portfolioUrls?: string[]
    websiteUrls?: string[]
    resumeUrls?: string[]
}

export const linksStep = (data: LinksStepProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: LINKS,
            completionPercentage: data.completionPercentage,
            completed: data.completed,
            nationality: data.nationality,
            country: data.country,
            state: data.state,
            portfolioUrls: data.portfolioUrls,
            websiteUrls: data.websiteUrls,
            resumeUrls: data.resumeUrls,
        });
    }
}