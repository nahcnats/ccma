export type CreativeConnectionGenericType = {
    connectionUserName: string,
    connectionUserId: number,
    connectionStatus: string,
    connectionId: number,
    connectionUserUsername: string,
    connectionPosition: string
}

export type CreativeConnectionType = {
    connectedConnections: CreativeConnectionGenericType[]
    requestPendingConnections: CreativeConnectionGenericType[]
}