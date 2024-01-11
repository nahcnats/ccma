import { getYoutubeMeta } from "react-native-youtube-iframe";

export interface YoutubeParserResult {
    id: string
    thumbnail: string
}

export const parseEmbed = (url: string): string | null => {
    if (!url) {
        return null;
    }

    try {
        const basic = url.match(/([?&])v=([^&#]+)/);
        const share = url.match(/(\.be\/)+([^/]+)/);
        const embed = url.match(/(embed\/)+([^/]+)/);

        if (basic) {
            return basic.pop()!;
        } if (share) {
            return share.pop()!;
        } if (embed) {
            return embed.pop()!;
        }
    } catch (e: any) {
        // crashlytics().recordError(e, "Something went wrong with youtube parse");
        throw new Error(e);
    }

    return null;
};

export const getThumbnail = async (id: string) => {
    const metaData = await getYoutubeMeta(id);

    if (!metaData) return "https://www.pngkit.com/png/full/267-2678423_bacteria-video-thumbnail-default.png";

    return metaData.thumbnail_url;
};

export const parseWithThumbnail = async (url: string): Promise<YoutubeParserResult | null> => {
    try {
        const result = parseEmbed(url);

        if (result === null) return null;

        const thumbnail = await getThumbnail(result);

        return { id: result, thumbnail };
    } catch (e) {
        return null;
    }
};