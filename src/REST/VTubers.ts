import { Client } from "..";
import { RequestBuilder } from "../CalenddarRestRequestBuilder";
import { CalenddarPlatform } from "../Client";
import { VTuber } from "../types";
export class VTubers {
    constructor(
        public readonly client: Client
    ) {}

    async fetch(id: string) {
        if (!id) throw new TypeError("ID required.");
        return new RequestBuilder<VTuber>()
            .setUrl(`https://api.calenddar.de/vtubers/${id}`)
            .setMethod("GET")
            .send()
    }

    async fetchAll() {
        return new RequestBuilder<VTuber[]>()
            .setUrl(`https://api.calenddar.de/vtubers`)
            .setMethod("GET")
            .send()
    }

    async fetchLive(platform?: CalenddarPlatform) {
        const builder = new RequestBuilder<VTuber[]>()
            .setUrl("https://api.calenddar.de/vtubers/live")
            .setMethod("GET")
        if (platform) builder.addParam("platform", platform);
        return builder.send()
    }
}