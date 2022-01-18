import { Client } from "..";

export interface APICommunityPost {
    id: string;
    channelId: string;
    text?: string;
    attachment?: {
        type: "image" | "poll" | "video";
        images?: string[];
        choices?: string[];
        video?: {
            id: string;
            thumbnail: string;
            title: string;
            descriptionSnippet: string;
        }
    }
}

export class CommunityPost {
    readonly client!: Client;
    readonly raw!: any;
    readonly id: string;
    readonly channelId: string;
    readonly text?: string;
    readonly type: "image" | "poll" | "video" | "none";
    readonly images?: string[];
    readonly choices?: string[];
    readonly video?: {
        id: string;
        thumbnail: string;
        title: string;
        descriptionSnippet: string;
    }

    constructor(client: Client, post: APICommunityPost) {
        Object.defineProperties(this, {
            client: {value: client, enumerable: false},
            raw: {value: post, enumerable: false}
        });

        this.id = post.id;
        this.channelId = post.channelId;
        this.type = post.attachment?.type ?? "none";
        this.images = post.attachment?.images;
        this.choices = post.attachment?.choices;
        this.video = post.attachment?.video;
    }

    getAttachment() {
        return this.images ?? this.choices ?? this.video;
    }
}