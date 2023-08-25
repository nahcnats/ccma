export const CONNECTION_REQUEST = "Connection Request";
export const CONNECTION_ACCEPTED = "Connection Accepted";
export const EVENT_RSVP = "Event RSVP";
export const EVENT_REMINDER = "Event Reminder";
export const TYPE_NOTIFICATION = "Notification";
export const TYPE_UPDATE = "Update";
export const TYPE_JOB_APPLICATION = "Job Application";
export const TYPE_JOB_APPLICATION_STATUS = "Job Application Status";

export const TYPE_LIKE_POST = "Post Like";
export const TYPE_COMMENT_POST = "Post Share";
export const TYPE_SHARE_POST = "Post Share";

export const TYPE_LIKE_COMMENT = "Comment Like";
export const TYPE_REPLY_COMMENT = "Comment Reply";

export const CONNECTION_NOTIFICATION = [
    CONNECTION_ACCEPTED, CONNECTION_REQUEST,
];

export const JOB_NOTIFICATION = [
    TYPE_JOB_APPLICATION_STATUS, TYPE_JOB_APPLICATION,
];

export const FEED_NOTIFICATION = [
    TYPE_LIKE_POST, TYPE_COMMENT_POST, TYPE_SHARE_POST,
];

export const COMMENT_NOTIFICATION = [
    TYPE_LIKE_COMMENT, TYPE_REPLY_COMMENT,
];