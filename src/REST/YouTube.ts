import { Client } from "..";
import { RequestBuilder } from "../RequestBuilder";
import {APICommunityPost} from "../types";

class CommunityPosts {
    public readonly client: Client

    constructor(
        client: Client
    ) {
        this.client = client;
    }

    fetch(id: string) {
        return new RequestBuilder<APICommunityPost>(this.client)
            .setUrl(`https://api.calenddar.de/youtube/post/${id}`)
            .setMethod("GET")
            .send()
    }

    fetchByChannel(channelId: string) {
        return new RequestBuilder<APICommunityPost[]>(this.client)
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