import * as R from "ramda"
import { ifNullThen } from "../basic/BaseFunctions";
import { Maybe } from "../basic/Maybe";
import { env } from "../basic/GlobalEnv";

type CreateAccountParams = {
    phone: string,
    inviter?: string,
    nickname: string,
    password: string,
    vcode: string
}

type LoginParams = {
    phone: string,
    password: string
}

type ResetPasswordParams = {
    phone: string,
    password: string,
    vcode: string
}

type CreateOrderParams = {
    carId: number,
    startDate: string,
    endDate: string,
    appointmentLocation: string,
    invoiceHead?: string,
    invoiceNumber?: string,
    openid: string,
    licensePicA: any,
    licensePicB: any,
    registrationPic: any;
}

export type Endpoint
    = 
    // account
      ["SetOnlineStatus", {status: "ONLINE" | "REST"}]
    | ["GetOnlineStatus"]
    | ["CreateAccount", CreateAccountParams]
    | ["Mine"]
    | ["CreateVCode", {phone: string}]
    | ["Login", LoginParams]
    | ["ResetPassword", ResetPasswordParams]
    | ["LogOut"]
    | ["QueryInviteeStat"]
    | ["QueryNickname", {}, number]

    // basic
    | ["GetImage", {}, string]
    
    // order
    | ["RetrieveAllAsigned"]
    | ["RetrieveAllOrder"]
    | ["TakeOrder", {orderId: string}]
    | ["ConfirmAssignedOrder", {orderId: number}]
    | ["Withdraw", {orderId: string, files: Array<any>}]
    | ["ConfirmInStation", {orderId: number}]
    | ["ReturnCar", {orderId: string, files: Array<any>}]
    | ["DeleteOrder"]
    | ["CreateOrder", CreateOrderParams]
    | ["PayForOrder"]
    | ["Replay"]
    | ["RetrieveAllUnassigned"]

    // car
    | ["RetrieveAllCar"]
    | ["RetrieveCar", {}, number]
    | ["UpdateCar", {license: string, vin: string}, number]
    | ["DeleteCar", {}, number]
    | ["CreateCar", {license: string, vin: string}]

    
function endpointCodec(endpoint: Endpoint): [RequestType, string, any] {
    let params: any = ifNullThen(endpoint[1], {});
    switch (endpoint[0]) {
        case "SetOnlineStatus": return ["POST_FORM", "/account/onlineStatus", params];
        case "GetOnlineStatus": return ["GET", "/account/onlineStatus", params];
        case "CreateAccount": return ["POST_FORM", "/account/createAccount", params];
        case "Mine": return ["GET", "/account/mine", params];
        case "CreateVCode": return ["POST_FORM", "/account/createVcode", params];
        case "Login": return ["POST_FORM", "/account/login", params];
        case "ResetPassword": return ["POST_FORM", "/account/resetPassword", params];
        case "LogOut": return ["POST_FORM", "/account/logout", params];
        case "QueryInviteeStat": return ["GET", '/account/inviteeStat', params];
        case "QueryNickname": return ["GET", `/account/${endpoint[2]}/nickname`, params];

        case "GetImage": return ["GET", `/images/${endpoint[2]}`, params];
        
        case "RetrieveAllAsigned": return ["GET", "/order/records-assigned", params];
        case "RetrieveAllOrder": return ["GET", "/order/records", params];
        case "TakeOrder": return ["POST_FORM", "/order/takeOrder", params];
        case "ConfirmAssignedOrder": return ["POST_FORM", "/order/confirmAssignedOrder", params];
        case "Withdraw": return ["POST_MULTIPART", "/order/withdraw", processUploadObj(params)];
        case "ConfirmInStation": return ["POST_FORM", "/order/confirmInStation", params];
        case "ReturnCar": return ["POST_MULTIPART", "/order/returnCar", processUploadObj(params)];
        case "DeleteOrder": return ["POST_FORM", "/order/deleteOrder", params];
        case "CreateOrder": return ["POST_MULTIPART", "/order/createOrder", params];
        case "PayForOrder": return ["POST_FORM", "/order/payForOrder", params];
        case "Replay": return ["POST_FORM", "/order/replay", params];
        case "RetrieveAllUnassigned": return ["GET", "/order/records-unassigned", params]

        case "RetrieveAllCar": return ["GET", "/car/records", params];
        case "RetrieveCar": return ["GET", `/car/records/${endpoint[2]}`, params];
        case "UpdateCar": return ["POST_JSON", `/car/records/${endpoint[2]}`, params];
        case "DeleteCar": return ["POST_FORM", `/car/records/${endpoint[2]}/delete`, params];
        case "CreateCar": return ["POST_JSON", "/car/create", params];
    }
}

export async function sendRequest<T>(endpiont: Endpoint): Promise<Maybe<T>> {
    let [method, route, params] = endpointCodec(endpiont);
    return sendHttpRequest<T>(method, route, params);
}


type RequestType = "GET" | "POST_FORM" | "POST_JSON" | "POST_MULTIPART"

export function sendHttpRequest<T>(method: RequestType, route: string, params: any = {}) {
    return new Promise<Maybe<T>>(function (resolve) {
        var xhr = new XMLHttpRequest();
        
        xhr.withCredentials = true;
        xhr.onload = function () {
            if (xhr.status == 200) {
                if (xhr.response == "") {
                    resolve(Maybe.Just<any>(""));
                } else {
                    resolve(Maybe.Just(JSON.parse(xhr.response)));
                }
            } else {
                handleException(xhr.status, xhr.response);
                resolve(Maybe.Nothing());
            }
        };
        xhr.onerror = function() {
            resolve(Maybe.Nothing());
        }

        switch (method) {
            case "GET": {
                xhr.open("GET", env.baseUrl + route + "?" + object2Query(params), true);
                xhr.send(null);
                break;
            }
            case "POST_FORM": {
                xhr.open("POST", env.baseUrl + route, true)
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(object2Query(params));
                break;
            }   
            case "POST_JSON": {
                xhr.open("POST", env.baseUrl + route, true)
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(params));
                break;
            }
            case "POST_MULTIPART": {
                xhr.open("POST", env.baseUrl + route, true);
                xhr.setRequestHeader("Contetn-Type", "multipart/form-data");
                let formdata = new FormData();
                R.keys<string>(params).forEach((key: string) => {
                    formdata.append(key, params[key]);
                })
                xhr.send(formdata);
                break;
            }
        }
    });
}

export function handleException(statusCode: number, response: any) {
    console.error("Error Code: ", statusCode, "Repsonse:", response);
}


function object2Query(obj: Object) {
    return R.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}

function processUploadObj(obj: {orderId: string, files: any[]}) {
    let result: {[key: string]: any} = {orderId: obj.orderId};
    obj.files.forEach((f, index) => {
        result[`file${index}`] = f;
    });
    return result;
}