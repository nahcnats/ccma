type Author = {
    avatar: string,
    name: string,
    username: string,
}

type Media = {
    fullUrl: string,
    type: string,
    url: string,
}

export type FeedItemTypes = {
    id: number,
    author: Author,
    media: Media[],
    commentsCount: number,
    content: string,
    reactionsCount: number,
}