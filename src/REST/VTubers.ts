import { Client } from "..";
import { RequestBuilder } from "../RequestBuilder";
import { CalenddarPlatform } from "../Client";
import { APIVTuber } from "../types";
import { VTuber } from "../structures/VTuber";
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
}