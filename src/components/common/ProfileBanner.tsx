import { View, Image, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import colors from "tailwindcss/colors";

type ProfileBannerProps = {
    image?: string | null
    base64?:any
    useLocal?: boolean
}

const ProfileBanner = ({ image, base64, useLocal }: ProfileBannerProps) => {
    let banner = require('../../assets/images/fallback.png');

    if (useLocal && base64) {
        banner = { uri: `data:${base64.fileType};base64,${base64.fileData}` }
    } 
    
    if (!useLocal && image) {
        banner = { uri: image }
    }

    return (
        <FastImage
            source={banner}
            className='rounded-lg'
            resizeMode={ (useLocal && base64) || image ? FastImage.resizeMode.cover : FastImage.resizeMode.contain  }
            style={(useLocal && base64) || image ? styles.image : styles.placeholderImage}
        />     
    );
}

const styles = StyleSheet.create({
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: 200,
    },
    placeholderImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: 200,
        backgroundColor: `${colors.gray[300]}`
    }
});

export default ProfileBanner;