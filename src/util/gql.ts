export const vtuberQueryOptionalIds = (includeIds: boolean): string => {
    return `
        id
        name
        originalName
        ${!includeIds ? "" : "youtubeId \n twitchId"}
    `
}