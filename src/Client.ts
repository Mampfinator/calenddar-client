import { CalenddarWebsocket } from "./CalenddarWebsocket";
import { EventEmitter2 } from "eventemitter2";
import { GraphQLClient } from "graphql-request";
import { VTubers } from "./REST/VTubers";
import { YouTube } from "./REST/YouTube";

export type CalenddarEvent = "live" | "offline" | "upcoming" | "post";
type MiscEvent = "disconnect" | "ready" | "debug";
export type CalenddarPlatform = "youtube" | "twitch" | "twitter" | "twitcasting";

export interface ClientOptions {
    customUrl?: string;
}

export class Client extends EventEmitter2 {
    public readonly ws: CalenddarWebsocket;
    public readonly gql: GraphQLClient
    public readonly vtubers: VTubers;
    public readonly youtube: YouTube;

    constructor(options?: ClientOptions) {
        super({
            wildcard: true,
            delimiter: "."
        });
        this.ws = new CalenddarWebsocket(this, options);
        this.vtubers = new VTubers(this);
        this.youtube = new YouTube(this);
        this.gql = new GraphQLClient(`https://api.calenddar.de/graphql`);
    }
    

    // misc events
    on(event: "disconnect", listener: (reason: {code: number, reason: string}) => any): this;
    on(event: "ready", listener: (socket: CalenddarWebsocket) => any): this;
    on(event: "debug", listener: (data: any) => any): this;

    // calenddar events
    on(event: `${"live" | "upcoming" | "offline"}.${CalenddarPlatform | "*"}`, listener: (notification: Notification) => any): this;
    on(event: "post.youtube", listener: (notification: Notification) => any): this;
    on(event: `${CalenddarEvent | "*"}.${CalenddarPlatform | "*"}` | MiscEvent, listener: (...args: any[]) => any) {
        return super.on(event, listener);
    }

    /**
     * Resolves whenever Calenddar has acknowledged the `Client`'s connection.
     */
    async start() {
        await this.ws.start();

        this.emit("ready");
    }
}