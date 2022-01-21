import { gql } from "graphql-request";
import { Client, Stream } from "..";
import { toClass } from "../util";

export class Streams {
    public readonly client!: Client;

    constructor(
        client: Client
    ) {
        Object.defineProperty(this, "client", {value: client, enumerable: false});
    }

    async fetchByStatus(status: "live" | "offline" | "upcoming") {
        const query = gql`
        {
            streams(status:${status[0].toUpperCase() + status.substring(1)}) {
                id
                channelId
                title
                description
                platform
                startedAt
                endedAt
                scheduledFor
            }
        }`

        const raw: object[] = (await this.client.gql.request(query)).streams;

        return await toClass(this.client, raw, Stream) as Stream[];
    }
}