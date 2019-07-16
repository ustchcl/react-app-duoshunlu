import * as R from "ramda"
import { Fn } from "../types/Type";

export function wait(seconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    })
}

