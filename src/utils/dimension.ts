import { Dimensions } from "react-native";

const { height: wHeight, width: wWidth } = Dimensions.get("window");
const { height: sHeight, width: sWidth } = Dimensions.get("screen");

export const SCREEN_WIDTH = sWidth;
export const SCREEN_HEIGHT = sHeight;
export const WINDOW_WIDTH = wWidth;
export const WINDOW_HEIGHT = wHeight;

export const PADDING_SPACE = 16;

export const SquareMediaWidth = {
    width: wWidth,
    height: wWidth,
};
export const FullBannerCover = {
    width: wWidth,
    height: wWidth * 0.6,
};

export const SquareMedia = {
    width: wWidth - (PADDING_SPACE * 2),
    height: wWidth - (PADDING_SPACE * 2),
};

export const SquareMediaFull = {
    width: wWidth,
    height: wWidth,
};

export const BannerMedia = {
    width: wWidth - (PADDING_SPACE * 2),
    height: (wWidth - (PADDING_SPACE * 2)) * 0.6,
};

export const BannerMediaFull = {
    width: wWidth,
    height: wWidth * 0.6,
};

export const SquareThumbnail = {
    width: 20,
    height: 20,
};

export type ImageSize = "SquareMedia" | "SquareMediaFull" | "BannerMedia" | "BannerMediaFull" | "SquareThumbnail"