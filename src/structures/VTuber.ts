import { Client } from "..";
import { APIVTuber } from "../types";

class VTuberYouTubeManager {
    public readonly client: Client;
    constructor(
        client: Client,
        public readonly vtuber: VTuber
    ) {
        this.client = client;
    }

    fetchPosts() {
        return this.client.youtube.posts.fetchByChannel(this.vtuber.youtubeId!);
    }
}

export class VTuber {
    public readonly client: Client;

    public partial!: boolean;
    public id!: string;
    public name!: string;
    public originalName?: string;
    public youtubeId?: string;
    public youtube?: VTuberYouTubeManager;
    public twitchId?: string;
    public twitterId?: string;
    public twitcastingId?: string;
    public affiliation!: string;

    constructor(
        client: Client,
        public raw: APIVTuber | string
    ) {
        this.client = client;
        if (typeof raw === "object") this.update(raw);
        else {
            this.id = raw;
            this.partial = true;
        }

        if (this.youtubeId) this.youtube = new VTuberYouTubeManager(client, this);
    }

    private update(apiVtuber: APIVTuber) {
        this.twitchId = apiVtuber.twitchId;
        this.twitterId = apiVtuber.twitterId;
        this.twitcastingId = apiVtuber.twitcastingId;
        this.id = apiVtuber.id;
        this.name = apiVtuber.name;
        this.originalName = apiVtuber.originalName;
        this.affiliation = apiVtuber.affiliation;
        this.youtubeId = apiVtuber.youtubeId;

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