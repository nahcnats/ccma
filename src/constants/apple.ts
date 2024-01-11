import { Platform } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IOS_VERSION = parseInt(Platform.Version as string, 10);

export const SUPPORT_APPLE_LOGIN = Platform.OS === "ios" && IOS_VERSION >= 13;