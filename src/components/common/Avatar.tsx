import { View, Image } from "react-native";
import FastImage from "react-native-fast-image";

type AvatarProps = {
    image?: string | null
    base64?:any
    size: number,
    useLocal?: boolean
}

const Avatar = ({image, base64, size, useLocal}: AvatarProps) => {
    let avatar = require('../../assets/images/default_avatar.png');

    if (useLocal && base64) {
        avatar = { uri: `data:${base64.fileType};base64,${base64.fileData}` }
    }

    if (!useLocal && image) {
        avatar = { uri: image }
    }

    return (
        <FastImage
            source={avatar}
            className='rounded-full'
            resizeMode={FastImage.resizeMode.cover}
            style={{ width: size, height: size }}
        />
    );
}

export default Avatar;