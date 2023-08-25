import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { CreativeUserLinkType } from '../../types/profile/CreativeProfileType';
import { nanoid } from '@reduxjs/toolkit';

interface SocialLinksProps {
    urls: any[]
    role: string
}

const SocialLinks = ({ urls, role }: SocialLinksProps) => {
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    useEffect(() => {
        role === 'CREATIVE' ? creativeSocialIconsMapHandler() : employerSocialIconMapHandler();
    }, []);

    const UserLink = ({ item }: { item: any }) => {
        const facebook = require('../../assets/social-icon/social_facebook.png');
        const instagram = require('../../assets/social-icon/social_instagram.png');
        const behance = require('../../assets/social-icon/social_behance.png');
        const youtube = require('../../assets/social-icon/social_youtube.png');
        const tiktok = require('../../assets/social-icon/social_ticktok.png');
        const linkedin = require('../../assets/social-icon/social_linkedin.png');
        const pinterest = require('../../assets/social-icon/social_pinterest.png');
        const others = require('../../assets/social-icon/social_link.png');

        if (!item.type) return null;

        let imageUrl;

        switch (item.type) {
            case 'FACEBOOK' : {
                imageUrl = facebook;
                break;    
            }
            case 'INSTAGRAM': {
                imageUrl = instagram;
                break;
            }
            case 'BEHANCE': {
                imageUrl = behance;
                break;
            }
            case 'YOUTUBE': {
                imageUrl = youtube;
                break;
            }
            case 'TIKTOK': {
                imageUrl = tiktok;
                break;
            }
            case 'LINKEDIN': {
                imageUrl = linkedin;
                break;
            }
            case 'PINTEREST': {
                imageUrl = pinterest;
                break;
            }
            default: {
                imageUrl = others;
                break;
            }
        }

        return (
            <FastImage
                source={imageUrl}
                resizeMode={FastImage.resizeMode.cover}
                style={{ width: 40, height: 40 }}
            />
        )
    }

    const creativeSocialIconsMapHandler = () => {
        if (!urls) return;

        const filtered = urls?.filter(item => item?.userLinkType !== 'WEBSITE');
        if (!filtered) return;

        let newSocialLinks = [];

        for (const item of filtered) {
            let newUrl = item.value;
            const isHttps = newUrl.includes('http://');

            if (!isHttps) {
                newUrl = `https://${newUrl}`
            }

            newSocialLinks.push({
                id: item.id,
                // url: item.value,
                url: newUrl,
                type: item.userLinkType
            });
        }

        setSocialLinks(newSocialLinks);
    }

    const employerSocialIconMapHandler = () => {
        if (!urls) return;

        let newSocialLinks = [];

        for (const item of urls) {
            let platform ='OTHERS';

            if (item.includes('facebook')) platform = 'FACEBOOK';
            if (item.includes('instagram')) platform = 'INSTAGRAM';
            if (item.includes('behance')) platform = 'BEHANCE';
            if (item.includes('youtube')) platform = 'YOUTUBE';
            if (item.includes('tiktok')) platform = 'TIKTOK';
            if (item.includes('linkedin')) platform = 'LINKEDIN';
            if (item.includes('pinterest')) platform = 'PINTEREST';

            let newUrl = item;
            const isHttps = newUrl.includes('http://');

            if (!isHttps) {
                newUrl = `https://${newUrl}`
            }

            newSocialLinks.push({
                id: nanoid(),
                // url: item,
                url: newUrl,
                type: platform
            });
        }

        setSocialLinks(newSocialLinks);
    }

    return (
        <ScrollView
            horizontal={true}
            contentContainerStyle={{
                flex: 1,
            }}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            className='space-x-3'
        >
            {
                socialLinks.length && socialLinks.map(item =>
                    <Pressable
                        key={item.id}
                        onPress={() => Linking.openURL(item.url)}
                    >
                        <UserLink item={item} />
                    </Pressable>
                )
            }
        </ScrollView>
    );
}

export default SocialLinks;