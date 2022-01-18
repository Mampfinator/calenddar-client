import { Client } from "..";

export type Constructable<T = Record<string, any>> = {new (...args: any[]): T} & Record<string, any>;

export async function toClass<T, APIType = any>(client: Client, apiValue: APIType, constructor: Constructable<T>) {
    if (apiValue instanceof Array) {
        return apiValue.map((value: APIType) => new constructor(client, value));
    } else return new constructor(client, apiValue);
}