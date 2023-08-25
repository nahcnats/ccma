import { AnyAction } from "redux";
import { UPLOAD, PROFILE, CAREERDEETS, LINKS } from "../actions/orangeTick";

export interface OrangeTickState {
    completionPercentage: number
    completed: boolean
    profileImageUrl: string | null
    bannerImageUrl: string | null
    dateOfBirth: string | null
    educationLevel: number | null
    employmentType: number[] | null
    aboutMe: string | null
    jobType: number | null
    salaryRange: number | null
    jobTitle: string | null
    company: string | null
    nationality: number | null
    country: number | null
    state: number | null
    portfolioUrls: string[] | null
    websiteUrls: string[] | null
    resumeUrls: string[] | null
}

const initialState: OrangeTickState = {
    completionPercentage: 0,
    completed: false,
    profileImageUrl: null,
    bannerImageUrl: null,
    dateOfBirth: null,
    educationLevel: null,
    employmentType: null,
    aboutMe: null,
    jobType: null,
    salaryRange: null,
    jobTitle: null,
    company: null,
    nationality: null,
    country: null,
    state: null,
    portfolioUrls: null,
    websiteUrls: null,
    resumeUrls: null,
}


const orangeTickReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case UPLOAD: {
            return {
                ...state,
                completionPercentage: action.completionPercentage,
                completed: action.completed,
                profileImageUrl: action.profileImageUrl,
                bannerImageUrl: action.bannerImageUrl,
            }
        }
        case PROFILE: {
            return {
                ...state,
                completionPercentage: action.completionPercentage,
                completed: action.completed,
                dateOfBirth: action.dateOfBirth,
                educationLevel: action.educationLevel,
                employmentType: action.employmentType,
                aboutMe: action.aboutMe,
            }
        }
        case CAREERDEETS: {
            return {
                ...state,
                completionPercentage: action.completionPercentage,
                completed: action.completed,
                jobType: action.jobType,
                salaryRange: action.salaryRange,
                jobTitle: action.jobTitle,
                company: action.company,
            }
        }
        case LINKS: {
            return {
                ...state,
                completionPercentage: action.completionPercentage,
                completed: action.completed,
                nationality: action.nationality,
                country: action.country,
                // city: action.city,
                state: action.state,
                portfolioUrls: action.portfolioUrls,
                websiteUrls: action.websiteUrls,
                resumeUrls: action.resumeUrls,
            }
        }
        default: {
            return state;
        }
    }
}

export default orangeTickReducer;