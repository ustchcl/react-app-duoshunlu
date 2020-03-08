import { DslRoute } from "../pages/Router";
import { Subject } from "rxjs"
import { Account } from "../api/Capability";
import { Maybe } from "./Maybe";
import { Fn } from "../types/Type";
import { sendRequest } from "../api/EndPoint";


export type GloablMsg 
    = ["ChangeRoute", DslRoute]


export const route = new Subject<DslRoute>();

export function dispatch(msg: GloablMsg) {
    switch(msg[0]) {
        case "ChangeRoute": {
            route.next(msg[1]);
            break;
        }
    }
}


// 全局数据信息
type LogLevel = "Dev" | "Prod"
export type Env = {
    logLevel: LogLevel,
    baseUrl: string,
    currentAccount: Maybe<Account>,
}

export const env: Env  = {
    logLevel: "Dev",
    baseUrl: "http://192.168.0.138:8080/duoshunlu",
    currentAccount: Maybe.Nothing()
}

export async function initEnv() {
    let mAccount = await sendRequest<Account>(["Mine"]);
    if (mAccount.valid) {
        env.currentAccount = mAccount;
    }
}


let globelCache: {[key: string]: any} = {};

export function setCache(key: string, value: any) {
    globelCache[key] = value;
}

export function getCache(key: string) {
    return globelCache[key];
}