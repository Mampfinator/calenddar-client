import { WebSocket } from "ws";
import { Client, ClientOptions } from "./Client";
import { CalenddarPlatform } from "./Client";
import { Notification } from "./structures";
import { APINotification } from "./structures/Notification";

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
        public readonly client: Client,
        options?: ClientOptions
    ) {
        super(options?.customUrl ?? "wss://api.calenddar.de");
        this.on("message", (data) => {
            try {
                var message = JSON.parse(data.toString());
            } catch (error) {
                this.emit("debug", error);
                return;
            }

            if (message) this.handleMessage(message); 
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

    private async handleMessage(apiNotification: APINotification<any>) {
        if (apiNotification.platform) {
            const notification = new Notification(this.client, apiNotification);
            await notification.fetchVtubers();
            this.client.emit(`${notification.event}.${notification.platform}`, notification);
        }
    }

    async start() {
        await this._connected;
        this.emit("ready", this);
    }
}