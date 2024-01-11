type contents = {
    externalUrl: string
    createdDate: string
    uploadId: number
    imageUrl: string
    creativePortfolioId: number
    subContentId: number
    contentPosition: number
    id: number
    contentType: string
    content: string
    status: string
}

type RootContents = {
    externalUrl: string
    createdDate: string
    contents: contents[]
    creativePortfolioId: number
    contentPosition: number
    id: number
    contentType: string
    content: string
    status: string
    imageUrl: string
}
export type CreativePortfolioByIdType = {
    createdDate: string
    contents: RootContents[],
    imageUrl: string
    publishingStatus: string
    description: string
    id: number,
    title: string
    userId: number
    status: string
}