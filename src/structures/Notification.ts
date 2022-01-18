import { Stream } from "./Stream";
import { VTuber } from "./VTuber";
import { CommunityPost } from "./CommunityPost";
import { Client } from "..";

export type CalenddarEvent = "live" | "offline" | "upcoming" | "post";
export type CalenddarPlatform = "youtube" | "twitch";

export interface APINotification<Payload> {
    readonly event: CalenddarEvent;
    readonly vtubers: string[];
    readonly platform: CalenddarPlatform;
    readonly data: Payload;
}

export interface StreamPayload {

}

export interface PostPayload {

}


export class Notification {
    readonly client!: Client;
    readonly raw!: APINotification<any>;
    readonly event: CalenddarEvent;
    readonly platform: CalenddarPlatform;
    readonly stream?: Stream;
    readonly post?: CommunityPost;
    vtubers!: VTuber[];

    constructor(client: Client, apiNotification: APINotification<any>) {
        Object.defineProperties(this, {
            client: {value: client, writable: false, enumerable: false},
            this: {value: apiNotification, enumerable: false},
            raw: {value: apiNotification, enumerable: false}
        });

        this.event = apiNotification.event;
        this.platform = apiNotification.platform;

        switch(this.event) {
            case "live":
            case "offline": 
            case "upcoming":
                this.stream = new Stream(this.client, this.raw.data); break;
            case "post":
                this.post = new CommunityPost(this.client, this.raw.data); break;
            default: 
                console.warn(`[calenddar-client]: detected unknown event ${this.event}.`)
        }
    }

    /**
     * @internal
     */
    async fetchVtubers() {
        const vtubers = await Promise.all(this.raw.vtubers.map(vtuberId => {
            return this.client.vtubers.fetch(vtuberId);
        }));

        this.vtubers = vtubers;

        return this.vtubers;
    }
}