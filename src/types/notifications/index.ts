export type NotificationPayload = "Notification"

export type NotificationBody = {
    uid: string,
    source?: string,
    senderId: string
    username: string
    avatar: string
    categoryIdentifier: string,
    type: NotificationPayload,
}

export type NotificationHeader = {
    title: string
    body: string
}

export type NotificationContent = {
    id: string
    source?: string
    receiver: string
    sender: string
    title: string
    message: string
    categoryIdentifier: string
    type: NotificationPayload
    isRead?: boolean
    createdAt: string
}

export type Source = {
    id: number
    type: string
    nested?: Source
}