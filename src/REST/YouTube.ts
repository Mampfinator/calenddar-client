import { Client } from "..";
import { RequestBuilder } from "../CalenddarRestRequestBuilder";
import {CommunityPost} from "../types";

class CommunityPosts {
    constructor(
        public readonly client: Client
    ) {}

    fetch(id: string) {
        return new RequestBuilder<CommunityPost>()
            .setUrl(`https://api.calenddar.de/youtube/post/${id}`)
            .setMethod("GET")
            .send()
    }

    fetchByChannel(channelId: string) {
        return new RequestBuilder<CommunityPost[]>()
            .setUrl(`https://api.calenddar.de/youtube/posts/${channelId}`)
            .setMethod("GET")
            .send()
    }
}

export class YouTube {
    readonly posts: CommunityPosts;
    constructor(
        public readonly client: Client
    ) {
        this.posts = new CommunityPosts(this.client);
    }
}