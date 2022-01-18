import { CalenddarWebsocket } from "./CalenddarWebsocket";
import { EventEmitter2 } from "eventemitter2";
import { VTubers } from "./REST/VTubers";
import { YouTube } from "./REST/YouTube";
import { VTuber } from "./structures/VTuber";

export type CalenddarEvent = "live" | "offline" | "post";
type MiscEvent = "disconnect" | "ready" | "debug";
export type CalenddarPlatform = "youtube" | "twitch" | "twitter" | "twitcasting";

export class Client extends EventEmitter2 {
    public readonly ws: CalenddarWebsocket;
    public readonly vtubers: VTubers;
    public readonly youtube: YouTube;

    constructor() {
        super();
        this.ws = new CalenddarWebsocket(this);
        this.vtubers = new VTubers(this);
        this.youtube = new YouTube(this);
    }
    

    // misc events
    on(event: "disconnect", listener: (reason: {code: number, reason: string}) => any): this;
    on(event: "ready", listener: (socket: CalenddarWebsocket) => any): this;
    on(event: "debug", listener: (data: any) => any): this;

    // calenddar events
    on(event: "live.*", listener: (data: any, vtubers: VTuber[], platform: string) => any): this;
    on(event: "live.youtube", listener: (data: any, vtubers: VTuber[], platform: "youtube") => any): this;
    on(event: "live.twitch", listener: (data: any, vtubers: VTuber[], platform: "twitch") => any): this;
    on(event: "live.twitter", listener: (data: any, vtubers: VTuber[], platform: "twitter") => any): this;
    on(event: "live.twitcasting", listener: (data: any, vtubers: VTuber[], platform: "twitter") => any): this;
    on(event: "offline.*", listener: (data: any, vtubers: VTuber[], platform: string) => any): this;
    on(event: "post.youtube", listener: (data: any, vtubers: VTuber[], platform: "youtube") => any): this;
    on(event: `${CalenddarEvent | "*"}.${CalenddarPlatform | "*"}` | MiscEvent, listener: (...args: any[]) => any) {
        return super.on(event, listener);
    }


    async start() {
        await this.ws.start();
    }
}