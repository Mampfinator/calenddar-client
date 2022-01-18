import axios, {AxiosResponse} from "axios";
import { Client } from ".";
import {Constructable, toClass} from "./util";

type RequestMethod = "GET" | "POST" | "DELETE" | "PATCH";

export class RequestBuilder<T = any> {
    constructor(private readonly client: Client) {}

    private url?: string;
    private headers: Record<string, string> = {};
    private params: Record<string, string> = {};
    private method?: RequestMethod;

    setMethod(method: RequestMethod): this {
        this.method = method;
        return this;
    }

    setUrl(url: string): this {
        this.url = url;
        return this;
    }

    addParam(name: string, value: string): this {
        this.params[name] = value;
        return this;
    }

    addHeader(name: string, value: string): this {
        this.headers[name] = value;
        return this;
    }

    send(transformer?: Constructable<T>, resolveFull?: false): Promise<T>
    send(transformer?: Constructable<T>): Promise<T>
    send(transformer?: Constructable<T>, resolveFull?: true): Promise<AxiosResponse>
    async send(transformer?: Constructable<T>, resolveFull?: boolean): Promise<T | T[] | AxiosResponse> {

        if (!this.method) throw new TypeError("Set the request method with RequestBuilder#setMethod before sending the request.");
        if (!this.url) throw new TypeError("Set the url with RequestBuilder#setUrl before sending the request.");

        const response = await axios({
            url: this.url,
            method: this.method,
            params: this.params,
            headers: this.headers
        });
        
        let data: T | T[] | undefined = undefined;
        if (transformer) {
            data = await toClass(this.client, response.data as Record<string, any>, transformer);
            response.data = data;
        }


        if (resolveFull || !data) return response;
        return data;
    }
}