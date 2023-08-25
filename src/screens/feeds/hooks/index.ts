import { useQuery, useInfiniteQuery, useMutation } from "react-query";
import { queryClient } from "../../../App";
import { GenericProps } from "../../../types/common";
import { 
    getFeedList,
    FeedListProps, 
    postNewFeed,
    NewFeedProps,
    toggleReaction,
    ToggleReactionProps,
    toggleBookmark,
    ToggleBookmarkProps,
    getFeedDetailsById,
    postComment,
    PostCommentProps,
    postReplyComment,
    ReplyCommentProps,
    toggleCommentReaction,
    ToggleCommentReactionProps,
    getBookmarkStatus,
    PostByIdProps,
    deletePost,
    reportPost,
    PostReportProps,
    UpdateFeedProps,
    getBookmarkFeedList,
    updateFeed
} from "../services";
import { 
    BookmarkStatusType,
    FeedDetailsType,
    FeedType, 
    SavedPostType
} from "../../../types/feed";


/** Queries */

export const useFeedList = (payload: FeedListProps) => {
    return useInfiniteQuery('feedList', ({ pageParam = 0 }): Promise<FeedType[]> => getFeedList(pageParam, payload), {
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage?.length === payload.params.pageSize ? allPages.length + 1 : undefined;
            return nextPage;
        }
    });
}

export const useBookmarkFeeds = (payload: GenericProps) => {
    return useQuery<SavedPostType[], Error>('bookmarkFeeds', () => getBookmarkFeedList(payload));
}

export const useFeedDetail = (payload: ToggleBookmarkProps) => {
    return useQuery<FeedDetailsType, Error>('feedDetail', () => getFeedDetailsById(payload));
}

export const useBookmarkStatus = (payload: ToggleBookmarkProps) => {
    return useQuery<BookmarkStatusType, Error>('bookmarkStatus', () => getBookmarkStatus(payload));
}

/** End Queries */

/** Mutations */ 

export const useAddFeed = () => {
    return useMutation((payload: NewFeedProps): Promise<string> => postNewFeed(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedList'] });
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useToggleReaction = () => {
    return useMutation((payload: ToggleReactionProps): Promise<string> => toggleReaction(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedList'] });
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useToggleBookmark = () => {
    return useMutation((payload: ToggleBookmarkProps): Promise<string> => toggleBookmark(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('bookmarkFeeds');
            queryClient.invalidateQueries('feedDetail');
            queryClient.invalidateQueries('feedList');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useAddComment = () => {
    return useMutation((payload: PostCommentProps): Promise<string> => postComment(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedDetail');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useAddReplyComment = () => {
    return useMutation((payload: ReplyCommentProps): Promise<string> => postReplyComment(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedDetail');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useToggleCommentReaction = () => {
    return useMutation((payload: ToggleCommentReactionProps): Promise<string> => toggleCommentReaction(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedDetail');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useDeletePost = () => {
    return useMutation((payload: PostByIdProps): Promise<string> => deletePost(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedList');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useReportPost = () => {
    return useMutation((payload: PostReportProps): Promise<string> => reportPost(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedList');
        },
        onError: (error) => {
            throw error;
        }
    })
}


export const useUpdateFeed = () => {
    return useMutation((payload: UpdateFeedProps): Promise<string> => updateFeed(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('feedList');
            queryClient.invalidateQueries('feedDetail');
        },
        onError: (error) => {
            throw error;
        }
    })
}
/** End Mutations */ 