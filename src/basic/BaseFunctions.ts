import * as R from "ramda"
import {Toast} from "antd-mobile"
import React from 'react'
import { catchClause } from "@babel/types";
import Compress from "compress.js"
import { cpus } from "os";

export function wait(seconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    })
}

export function inRange(from: number, to: number) {
    return (value: number): boolean => value >= from && value <= to;
}


export type TimeInfo = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    seconds: number,
}
export function timeInfo(timestamp: number): TimeInfo {
    let date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        seconds: date.getSeconds()
    }
}


/**
 * example
 * "yyyy-mm-dd": 2020-02-02
 * "yyyy-mm-dd:hh:mm:ss": "2020-02-02:02:02:02"
 * "年月日": "2020年02月02日"
 * @param type 
 * @param timestamp 
 */
export function displayTime(type: "yyyy-mm-dd" | "yyyy/mm/dd" | "yyyy-mm-dd:hh:mm:ss" | "yyyy-mm-dd:hh:mm" | "年月日", timestamp: number) {
    let time = timeInfo(timestamp);
    switch(type) {
        case "yyyy-mm-dd": return `${time.year}-${formatNum(time.month, 2)}-${formatNum(time.day, 2)}`;
        case "yyyy/mm/dd": return `${time.year}/${formatNum(time.month, 2)}/${formatNum(time.day, 2)}`;
        case "yyyy-mm-dd:hh:mm:ss": return `${time.year}-${formatNum(time.month, 2)}-${formatNum(time.day, 2)}  ${formatNum(time.hour,2)}:${formatNum(time.minute, 2)}:${formatNum(time.seconds, 2)}`;
        case "年月日": return `${time.year}年${formatNum(time.month, 2)}月${formatNum(time.day, 2)}日`;
        case "yyyy-mm-dd:hh:mm": return `${time.year}-${formatNum(time.month, 2)}-${formatNum(time.day, 2)}  ${formatNum(time.hour,2)}:${formatNum(time.minute, 2)}`;
    }
} 


/**
 * example: 
 * formatNum(1, 2); // '02'
 * formatNum(12, 4); // '0012'
 * @param num 要格式化的数字
 * @param length 格式化后的长度
 */
export function formatNum(num: number, length: number): string {
    let str = String(num);
    return R.repeat("0", length - str.length) + str;
}


export function ifNullThen<T>(value: T | null | undefined, defaultValue: T) {
    if (null == value) {
        return defaultValue;
    } else {
        return value;
    }
}

type Msg
    = ["TextOnly", string]
    | ["Icon", React.ReactNode]
    | ["Success", string]
    | ["Fail", string]
    | ["Loading", string]
    | ["NetworkError", string]

export function showMessage(msg: Msg) {
    switch (msg[0]) {
        case "TextOnly": {
            Toast.info(msg[1], 1);
            break;
        }
        case "Icon": {
            Toast.info(msg[1], 1);
            break;
        }
        case "Success": {
            Toast.success(msg[1], 1);
            break;
        }
        case "Fail": {
            Toast.fail(msg[1], 1);
            break;
        }
        case "Loading": {
            Toast.fail(msg[1], 1);
            break;
        }
        case "NetworkError": {
            Toast.offline(msg[1], 1);
            break;
        }
    }
}

export async function compress(files: Array<any>) {
    let compress = new Compress();
    let data = await compress.compress(files, {
        size: 4,
        quality: 0.5,
        maxWidth: 1080,
        maxHeight: 1080,
        resize: true,
    });
    return data.map((d:any) => Compress.convertBase64ToFile(d.data, d.ext));
}

export async function _compress(files: Array<any>) {
    let compress = new Compress();
    let data = await compress.compress(files, {
        size: 4,
        quality: 0.5,
        maxWidth: 1080,
        maxHeight: 1080,
        resize: true,
    });
    return Compress.convertBase64ToFile(data[0].data, data[0].ext);
}


