type OrderProcess = "WAIT_FOR_PAYMENT" | "WAIT_FOR_APPOINT" | "WAIT_FOR_WITHDRAW" | "ON_THE_WAY_TO_STATION" | "IN_INSPECT" | "WAIT_FOR_RETURN" | "CUSTOMER_CONFIRMED" | "CLOSED"

export function showOrderProcess(process: OrderProcess): string {
    switch (process) {
        case "WAIT_FOR_PAYMENT": return "等待支付";
        case "WAIT_FOR_APPOINT": return "等待指派业务员";
        case "WAIT_FOR_WITHDRAW": return "等待提车";
        case "ON_THE_WAY_TO_STATION": return "正在前往检测站";
        case "IN_INSPECT": return "年审中";
        case "WAIT_FOR_RETURN": return "年审已结束，等待还车";
        case "CUSTOMER_CONFIRMED": return "已成功还车";
        case "CLOSED": return "订单已完成";
    }
}

export interface Order {
    createTime: number,
    carId: string,
    process: OrderProcess
}


export interface Car {
    id: number,
    accountId: number,
    license: string,
    vin: string
}