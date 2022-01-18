import { Client } from "..";
import { CalenddarPlatform } from "../Client";

const statusToEnum = (status: string | number): string => {
    if (typeof status === "string") return status;
    return ["offline", "live", "upcoming"][status];
}

const dateOrUndefined = (isoString: string): Date | undefined => {
    const date = new Date(isoString);
    return isNaN(date.valueOf()) ? undefined : date;
}

export interface APIStream {
    "id": string,               // platform-specific stream ID
    "channelId": string,        // platform-specific channel ID
    "platform": CalenddarPlatform,         // platform identifier ("youtube", "twitch",...)
    "title": string,            // Title
    "status": number,          // 0 - offline, 1 - live, 2 - upcoming
    "description"?: string,     // stream description (youtube only)
    "startedAt"?: string,       // ISO 8601 string
    "endedAt"?: string,         // ISO 8601 string
    "scheduledFor"?: string     // youtube only, ISO 8601 string
}

export class Stream {
    readonly client!: Client;
    readonly raw!: APIStream;
    readonly platform: CalenddarPlatform;
    readonly id: string;
    readonly channelId: string;
    readonly title: string;
    readonly status: string;
    readonly description: string | null;
    readonly startedAt?: Date;
    readonly endedAt?: Date;
    readonly scheduledFor?: Date;

    constructor(client: Client, stream: APIStream) {
        Object.defineProperties(this, {
            client: {value: client, enumerable: false},
            raw: {value: stream, enumerable: false}
        });

        this.id = stream.id;
        this.channelId = stream.channelId;
        this.platform  = stream.platform;
        this.title = stream.title;
        this.description = stream.description ?? null;
        this.status = statusToEnum(stream.status);
        this.startedAt = dateOrUndefined(stream.startedAt!);
        this.endedAt = dateOrUndefined(stream.endedAt!);
        this.scheduledFor = dateOrUndefined(stream.scheduledFor!);
    }
}