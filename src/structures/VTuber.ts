import { Client } from "..";
import { APIVTuber } from "../types";

class YouTubeChannel {
    public readonly client!: Client;
    constructor(
        client: Client,
        public readonly id: string, 
        public readonly vtuber: VTuber
    ) {
        Object.defineProperty(this, "client",  {value: client, enumerable: false});
    }

    async fetchPosts() {
        return this.client.youtube.posts.fetchByChannel(this.id);
    }
}

class TwitchChannel {
    public readonly client!: Client;
    constructor(
        client: Client,
        public readonly id: string,
        public readonly vtuber: VTuber
    ) {
        Object.defineProperty(this, "client", {value: client, enumerable: false});
    }
}

export class VTuber {
    public readonly client!: Client;

    public partial!: boolean;
    public id!: string;
    public name!: string;
    public originalName?: string;
    public youtube?: YouTubeChannel;
    public twitch?: TwitchChannel;
    public affiliation!: string;

    constructor(
        client: Client,
        public raw: APIVTuber | string
    ) {
        Object.defineProperties(this, {
            client: {
                value: client,
                enumerable: false,
                writable: false
            },
            raw: {
                enumerable: false,
                writable: true
            },
            partial: {
                enumerable: false,
                writable: true
            }
        });

        if (typeof raw === "object") this.update(raw);
        else {
            this.id = raw;
            this.partial = true;
        }
    }

    private update(apiVtuber: APIVTuber) {
        if (apiVtuber.youtubeId) this.youtube = new YouTubeChannel(this.client, apiVtuber.youtubeId, this);
        if (apiVtuber.twitchId) this.twitch = new TwitchChannel(this.client, apiVtuber.twitchId, this);
        //this.twitterId = apiVtuber.twitterId;
        //this.twitcastingId = apiVtuber.twitcastingId;
        this.id = apiVtuber.id;
        this.name = apiVtuber.name;
        this.originalName = apiVtuber.originalName;
        this.affiliation = apiVtuber.affiliation;

        this.raw = apiVtuber;
        this.partial = false;
        return this;
    }

    async fetch() {
        return this.update(
            await this.client.vtubers.fetch(this.id)
        );
    }
}