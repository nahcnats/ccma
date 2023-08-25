import { AnyAction } from "redux";

import { TOKENTOPUP } from "../actions/tokenTopUp";

export interface TokenTopUpState {
    name: string | null
    totalToken: number | null
    totalPrice: number | null
    tokenId: number | null
}

const initialState: TokenTopUpState = {
    name: null,
    totalToken: null,
    totalPrice: null,
    tokenId: null
}

const tokenTopUpReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case TOKENTOPUP: {
            return {
                ...state,
                name: action.name,
                totalToken: action.totalToken,
                totalPrice: action.totalPrice,
                tokenId: action.tokenId
            }
        }
        default:
            return state;
    }
}

export default tokenTopUpReducer;