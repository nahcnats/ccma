import { AnyAction } from "redux";

import { USERINFO, LOGOUT } from "../actions/auth";

// TODO: profileImage, email, name, username change deal later maybe with toolkit
export interface UserState {
    id: number | null
    token: string | null
    employerTokensCount: number | null
    name: string | null
    email: string | null
    username: string | null
    role: string | null
    status: string | null
    profileImageUrl: string | null
    bio: string | null,
    joinedDate: string | null 
    completedProfileOnDate: string | null
}

const initialState: UserState = {
    id: null,
    token: null,
    employerTokensCount: null,
    name: null,
    email: null,
    username: null,
    role: null,
    status: null,
    profileImageUrl: null,
    bio: null,
    joinedDate: null,
    completedProfileOnDate: null
}

const authReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case USERINFO: {
            return {
                ...state,
                id: action.id,
                employerTokensCount: action.employerTokensCount,
                name: action.name,
                email: action.email,
                username: action.username,
                role: action.role,
                status: action.status,
                profileImageUrl: action.profileImageUrl,
                bio: action.bio,
                joinedDate: action.joinedDate,
                token: action.token,
                completedProfileOnDate: action.completedProfileOnDate
            }
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            return state;
    }
}

export default authReducer;