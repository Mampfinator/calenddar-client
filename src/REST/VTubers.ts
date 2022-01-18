import { Client } from "..";
import { RequestBuilder } from "../RequestBuilder";
import { CalenddarPlatform } from "../Client";
import { VTuber } from "../structures/VTuber";
import { gql } from "graphql-request";
import { vtuberQueryOptionalIds, toClass } from "../util";
export class VTubers {
    public readonly client: Client

    constructor(
        client: Client
    ) {
        this.client = client;
    }

    async fetch(id: string) {
        if (!id) throw new TypeError("ID required.");
        return new RequestBuilder<VTuber>(this.client)
            .setUrl(`https://api.calenddar.de/vtubers/${id}`)
            .setMethod("GET")
            .send(VTuber)
    }

    async fetchAll(): Promise<VTuber[]> {
        return new RequestBuilder(this.client)
            .setUrl(`https://api.calenddar.de/vtubers`)
            .setMethod("GET")
            .send(VTuber)
    }

    async fetchLive(platform?: CalenddarPlatform): Promise<VTuber[]> {
        const builder = new RequestBuilder(this.client)
            .setUrl("https://api.calenddar.de/vtubers/live")
            .setMethod("GET")
        if (platform) builder.addParam("platform", platform);
        return builder.send(VTuber)
    }

    async fetchByAffiliation(affiliation: string, includeIds?: boolean): Promise<VTuber[]> {
        const query = gql`
        {
            vtubers:findByAffiliation(affiliation: "${affiliation}") {
                ${vtuberQueryOptionalIds(!!includeIds)}
            }
        }
        `
        const raw = (await this.client.gql.request(query)).vtubers;
        return await toClass(this.client, raw, VTuber) as VTuber[];
    }

    async search(text: string, includeIds?: boolean): Promise<VTuber[]> {
        const query = gql`
        {
            vtubers:search(text: "${text}") {
                ${vtuberQueryOptionalIds(!!includeIds)}
            }
        }`

        const raw: object[] = (await this.client.gql.request(query)).vtubers;

        return await toClass(this.client, raw, VTuber) as VTuber[];
    }
}