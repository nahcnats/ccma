import server from "../../../API";
import { httpHeaders } from "../../../constants/httpHeaders";
import { GenericProps } from "../../../types/common";
import { apiErrorHandler } from "../../../utils";

import { 
    FeedType,
    FeedDetailsType,
    BookmarkStatusType,
    SavedPostType,
} from "../../../types/feed";

export interface FeedListProps {
    token: GenericProps
    params: {
        pageIndex: number
        pageSize: number
        keyword?: string
    }
}

export interface NewFeedProps {
    token: GenericProps
    params: {
        content: string
        videoUrl?: string | undefined
        images: object[] | undefined
    }
}

export interface UpdateFeedProps {
    token: GenericProps
    params: {
        postId: number
        content: string
        videoUrl?: string | undefined
        images: object[] | undefined
    }
}

export interface ToggleReactionProps {
    token: GenericProps
    params: {
        postId: number,
        reactionTypeId: number
    }
}

export interface ToggleCommentReactionProps {
    token: GenericProps
    params: {
        postCommentId: number,
        reactionTypeId: number
    }
}

export interface ToggleBookmarkProps {
    token: GenericProps
    params: {
        postId: number,
    }
}

export interface PostCommentProps {
    token: GenericProps
    params: {
        postId: number,
        comment: string
    }
}

export interface ReplyCommentProps {
    token: GenericProps
    params: {
        postCommentId: number,
        reply: string
    }
}

export interface PostByIdProps {
    token: GenericProps,
    params: {
        postId: number
    }
}

export interface PostReportProps {
    token: GenericProps,
    params: {
        postId: number
        remarks: string
    }
}


export async function getFeedList(pageParam: number, payload: FeedListProps): Promise<FeedType[]> {
    try {
        const params = {
            pageIndex: pageParam,
            pageSize: payload.params.pageSize,
            keyword: payload.params.keyword || null,
        }

        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/all', params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.posts;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getBookmarkFeedList(payload: GenericProps): Promise<SavedPostType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/bookmarked/all', null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.savedPosts;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function postNewFeed(payload: NewFeedProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/add', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function updateFeed(payload: UpdateFeedProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/edit', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function toggleReaction(payload: ToggleReactionProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/post/react', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function toggleCommentReaction(payload: ToggleCommentReactionProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/post/comment/react', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function toggleBookmark(payload: ToggleBookmarkProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/bookmark/post', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;


        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getBookmarkStatus(payload: ToggleBookmarkProps): Promise<BookmarkStatusType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/post/status', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;
        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getFeedDetailsById(payload: ToggleBookmarkProps): Promise<FeedDetailsType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/posts/post/details/${payload.params.postId}`, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function postComment(payload: PostCommentProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/post/comment', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function postReplyComment(payload: ReplyCommentProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/posts/post/comment/reply', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function deletePost(payload: PostByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`posts/post/delete/${payload.params.postId}`, null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function reportPost(payload: PostReportProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/posts/post/report`, payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getPostById(payload: PostByIdProps): Promise<FeedDetailsType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/posts/post/details/${payload.params.postId}`, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.response;

        return result.response;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 