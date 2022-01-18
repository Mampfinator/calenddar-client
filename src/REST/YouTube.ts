import { Client } from "..";
import { RequestBuilder } from "../RequestBuilder";
import { CommunityPost, APICommunityPost} from "../structures/CommunityPost"

class CommunityPosts {
    public readonly client: Client

    constructor(
        client: Client
    ) {
        this.client = client;
    }

    fetch(id: string): Promise<CommunityPost> {
        return new RequestBuilder(this.client)
            .setUrl(`https://api.calenddar.de/youtube/post/${id}`)
            .setMethod("GET")
            .send(CommunityPost)
    }

    fetchByChannel(channelId: string): Promise<CommunityPost[]> {
        return new RequestBuilder(this.client)
            .setUrl(`https://api.calenddar.de/youtube/posts/${channelId}`)
            .setMethod("GET")
            .send(CommunityPost);
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