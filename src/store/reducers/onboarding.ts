import { AnyAction } from "redux";

import { ONBOARDING, PROVIDER, USERNAME, ROLE } from "../actions/onboarding";

export interface OnboardingState {
    role: string | null
    email: string | null
    name: string | null
    username: string | null
    phoneNumber: string | null
    phoneNumberDataId: number | null
    genderPreferenceId: number | null
    provider: string | null
    token: string | null
}

const initialState: OnboardingState = {
    role: null,
    email: null,
    name: null,
    username: null,
    phoneNumber: null,
    phoneNumberDataId: null,
    genderPreferenceId: null,
    provider: null,
    token: null
}

const onboardingReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case PROVIDER: {
            return {
                ...state,
                provider: action.provider,
                email: action.email,
                name: action.name,
                token: action.token,
            }
        }
        case ROLE: {
            return {
                ...state,
                role: action.role,
            }
        }
        case USERNAME: {
            return {
                ...state,
                username: action.username,
            }
        }
        case ONBOARDING: {
            return {
                ...state,
                role: action.role,
                username: action.username,
                email: action.email,
                name: action.name,
                phoneNumber: action.phoneNumber,
                phoneNumberDataId: action.phoneNumberDataId,
                genderPreferenceId: action.genderPreferenceId,
                
            }
        }
        default:
            return state;
    }
}

export default onboardingReducer;