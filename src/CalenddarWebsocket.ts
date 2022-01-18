import { WebSocket } from "ws";
import { Client } from ".";
import { CalenddarPlatform } from "./Client";

/**
 * WebSocket for CalenDDar. Parses messages and relays them to the proper Client events.
 */
export class CalenddarWebsocket extends WebSocket {
    /**
     * Promise that will resolve once a connection to the CalenDDar servers is established.
     * Rejects after 15 seconds if connecting failed.
     */
    private readonly _connected: Promise<void>;
    constructor(
        public readonly client: Client
    ) {
        super("wss://api.calenddar.de");
        this.on("message", (data) => {
            try {
                var message = JSON.parse(data.toString());
            } catch (error) {
                this.emit("debug", error);
                return;
            }

            const {event, vtubers, platform, data: messageData} = message;

            this.handleMessage(event, vtubers, platform, data); 
        });

        this.on("close", (code, reason) => {
            this.client.emit("disconnect", {code, reason: reason.toString()});
        });

        this._connected = new Promise<void>((resolve, reject) => {
            let connected: boolean;
            this.on("open", () => {
                connected = true;
                
                // very simple stay alive code.
                // probably a good idea to like, actually detect broken connecions.
                // but this will work for now.
                setInterval(() => {
                    this.ping();
                }, 15_000);
                
                this.on("pong", () => this.client.emit("debug", "PONG!"));
                this.on("ping", () => {this.client.emit("debug", "PING"); this.pong()});

                resolve();
            });

            setTimeout(() => {
                if (!connected) reject(new Error("Could not establish connection to CalenDDar."));
            }, 15_000);
        });
    }

    private async handleMessage(event: string, vtuberIds: string[], platform: CalenddarPlatform, data: Record<string, any>) {
        let vtubers;
        if (vtuberIds && vtuberIds.length > 0) {
            vtubers = await Promise.all(vtuberIds.map(id => this.client.vtubers.fetch(id)));
        } else vtubers = vtuberIds; 
        
        if (platform) {
            this.client.emit(`${event}.${platform}`, this.buildType(event, platform, data) ?? data, vtubers, platform);
        } else {
            this.client.emit(event, this.buildType(event, platform, data) ?? data, vtubers);
        }
    }


    private buildType(event: string, platform: CalenddarPlatform, data: Record<string, any>): any {
        
    }

    async start() {
        await this._connected;
        this.emit("ready", this);
    }
}