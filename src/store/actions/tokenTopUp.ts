import { Dispatch } from "redux";

import { TokenTopUpState } from "../reducers/tokenTopUp";

export const TOKENTOPUP = 'TOKENTOPUP';

export const tokenTopUp = ({name, totalToken, totalPrice, tokenId}: TokenTopUpState) => {
    return async (dispatch: Dispatch) => {
        dispatch({
            type: TOKENTOPUP,
            name: name,
            totalToken: totalToken,
            totalPrice: totalPrice,
            tokenId: tokenId
        });
    }
}