export interface VTuber {
    id: string;
    name: string;
    affiliation: string;
    originalName?: string;
    // channel IDs
    /**
     * YouTube channel ID
     */
    youtubeId?: string;
    /**
     * Twitch channel ID (**not** login name)
     */
    twitchId?: string; 
    /**
     * Twitter ID (**not** display name)
     */
    twitterId?: string;
    /**
     * Twitcasting channel ID (???)
     */
    twitcastingId?: string;
}

export interface CommunityPost {
    id: string;
    channelId: string;
    text?: string;
    attachment?: {
        type: "image" | "poll" | "video";
        choices?: string[];
        images?: string[];
        video?: {
            id: string;
            thumbnail: string;
            title: string;
            descriptionSnippet: string;
        }
    }
}