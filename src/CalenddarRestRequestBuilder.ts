import axios, {AxiosResponse} from "axios";

type RequestMethod = "GET" | "POST" | "DELETE" | "PATCH";

export class RequestBuilder<T = any> {
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

    send(resolveFull: false): Promise<T>
    send(): Promise<T>
    send(resolveFull: true): Promise<AxiosResponse>
    async send(resolveFull?: boolean): Promise<T | AxiosResponse> {
        if (!this.method) throw new TypeError("Set the request method with RequestBuilder#setMethod before sending the request.");
        if (!this.url) throw new TypeError("Set the url with RequestBuilder#setUrl before sending the request.");

        const response = await axios({
            url: this.url,
            method: this.method,
            params: this.params,
            headers: this.headers
        });


        if (resolveFull) return response;
        return response.data as T;
    }
}