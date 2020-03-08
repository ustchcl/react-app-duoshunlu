/* tslint:disable */
// Generated using typescript-generator version 2.5.423 on 2019-08-01 10:47:23.

export interface Statistic {
    newAccounts: number;
    newOrders: number;
}

export interface InspectOrder {
    id: number;
    createTime: number;
    customerId: number;
    salesId: number;
    carId: number;
    appointmentFrom: string;
    appointmentTo: string;
    appointmentLocation: string;
    licensePicA: string;
    licensePicB: string;
    registrationPic: string;
    invoiceHead: string;
    invoiceNumber: string;
    invoiceTime: number;
    paymentChannel: string;
    prepayId: string;
    expireTime: number;
    payTime: number;
    process: OrderProcess;
    inspectResult: boolean;
}

export interface Account  {
    id: number;
    inviter: number;
    createTime: number;
    lastLoginTime: number;
    nickname: string;
    phone: string;
    role: Role;
    exp: number;
    wxUnionId: string;
    point: number;
}

export interface Car {
    id: number;
    accountId: number;
    license: string;
    vin: string;
}

export type OrderProcess = "WAIT_FOR_PAYMENT" | "WAIT_FOR_APPOINT" | "WAIT_FOR_WITHDRAW" | "ON_THE_WAY_TO_STATION" | "IN_INSPECT" | "WAIT_FOR_RETURN" | "CUSTOMER_CONFIRMED" | "CLOSED";

export type Role = "S_ADMIN" | "ADMIN" | "SALES" | "CUSTOMER";


export type StringMessage = {
    content: string
}

export type InviteeStat = {
    direct: number,
    indirect: number;
}