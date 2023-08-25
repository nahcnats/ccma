import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Video from 'react-native-video';
import colors from 'tailwindcss/colors';
import YouTubePlayer from 'react-native-youtube-iframe'

import { IconDelete } from '../../assets/icons';
import * as YouTubeHelpers from '../../utils/youtube_helpers';

interface ProjectVideoProps {
    videoUrl: string
    onDelete: () => void
    showDelete: boolean
}

const ProjectVideo = ({videoUrl, onDelete, showDelete} : ProjectVideoProps) => {
    const [videoStatus, toggleVideoStatus] = useState<boolean>(false);
    const [isYouTube, setIsYouTube] = useState(false);
    const [youtubeThumbnail, setYoutubeThumbnail] = useState('');
    const [youtubeId, setYoutubeId] = useState('');

    const OtherVideo = useCallback(() => {
        if (!videoUrl) return null;
        
        return (
            <Video
                source={{ uri: videoUrl }}
                style={styles.backgroundVideo}
                muted
                // // repeat
                // onLoadStart={() => toggleVideoStatus(true)}
                onLoad={() => toggleVideoStatus(false)}
                // onEnd={() => {
                //     setVideoEnded(true)
                //     toggleVideoStatus(true)
                // }}
                // paused={videoStatus}
                resizeMode='cover'
                // playWhenInactive
                rate={1.0}
                controls={true}
            // ignoreSilentSwitch='obey'
            />
        );
    }, [videoUrl]);

    const YouTubeVideo = useCallback(() => {
        const result = YouTubeHelpers.parseEmbed(videoUrl);

        if (result === null) return null;

        // YouTubeHelpers.getThumbnail(result)
        //     .then((url) => {
        //         setYoutubeThumbnail(url)
        //     })
        //     .catch((error) => console.log(error))

        const ytId = videoUrl.split('/').pop();

        // setYoutubeId(ytId as string);

        return (
            <YouTubePlayer 
                height={200}
                initialPlayerParams={{ controls: true }}
                videoId={ytId}
            />
        );
    }, [videoUrl]);

    return (
        <View className='relative rounded-lg overflow-hidden max-h-[300] w-[360] my-8'>
            {
                showDelete &&
                <Pressable
                    className='absolute top-[5] right-2 z-50 rounded-full border border-gray-300 bg-white p-2'
                    onPress={onDelete}
                >
                    <IconDelete size={24} color={colors.black} />
                </Pressable>
            }
            {
                videoUrl.includes('youtu.be') ? <YouTubeVideo /> : <OtherVideo />
            }
        </View>
        
    );
}

export default ProjectVideo;

const styles = StyleSheet.create({
    backgroundVideo: {
        // height: '100%',
        width: '100%',
        // height: WINDOW_HEIGHT + 30,
        // position: "absolute",
        // top: 0,
        // left: 0,
        // alignItems: "stretch",
        // bottom: 0,
        // right: 0,
    },
    buttonSize: {
        width: 48,
        height: 48,
    },
})