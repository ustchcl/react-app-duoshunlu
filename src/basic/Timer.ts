import { Fn } from "../types/Type";
import { ifNullThen } from "./BaseFunctions";

export type TimerOptions = {
    tick: number;
    onstart?: Fn<void, void>;
    onstop?: Fn<void, void>;
    onpause?: Fn<void, void>;
    onend?: Fn<void, void>;
    ontick?: Fn<number, void>;
};

const defaultOptions: TimerOptions = {
    tick: 1,
    onstart: () => {},
    ontick: _ => {},
    onpause: () => {},
    onstop: () => {},
    onend: () => {}
};

type EventType = "onstart" | "ontick" | "onpause" | "onstop" | "onend";

type TimerStatus = "initialized" | "started" | "paused" | "stopped";



export class Timer {
    _options: TimerOptions;
    _duration: number = 1000;
    _status: TimerStatus = "stopped";
    _start: number = 0;
    _measures: {[key: string]: number} = {};
    _timeout: any = null;
    _interval: any = null;

    static readonly Infinity = 86400;

    constructor(options?: TimerOptions) {
        this._options = ifNullThen(options, defaultOptions);
    }

    start(duration: number = 0) {
        if (!+duration && !this._duration) return this;
        // to ms
        duration && (duration *= 1000);

        if (this._timeout && this._status === "started") return this;
        this._duration = ifNullThen(duration, this._duration);

        this._timeout = setTimeout(this.end.bind(this), this._duration);
        if (typeof this._options.ontick === "function") {
            let _this = this;
            this._interval = setInterval(
                () => this.tick(_this.getDuration()),
                +this._options.tick * 1000
            );
        }
        this._start = Date.now();
        this._status = "started";
        this.trigger("onstart");
        return this;
    }

    pause() {
        if (this._status !== "started") return this;
        this._duration -= Date.now() - this._start;
        this.clear(false);
        this._status = "paused";
        this.trigger.call(this, "onpause");
        return this;
    }

    stop() {
        if (!/started|paused/.test(this._status)) return this;
        this.clear(true);
        this._status = "stopped";
        this.trigger.call(this, "onstop");
        return this;
    }

    on(eventType: EventType, value: Fn<any, void>) {
        this._options[eventType] = value;
        return this;
    }

    off(eventType: EventType) {
        this._options[eventType] = <any>defaultOptions[eventType];
    }

    measureStart(label: string) {
        this._measures[label] = Date.now();
        return this;
    }

    measureStop(label: string) {
        return Date.now() - this._measures[label || ""];
    }

    getDuration(): number {
        if (this._status == "started") {
            return this._duration - (Date.now() - this._start);
        } else if (this._status == "paused") {
            return this._duration;
        } else {
            return 0;
        }
    }

    trigger(event: Exclude<EventType, "ontick">) {
        let callback = this._options[event];
        typeof callback === "function" && callback();
    }

    tick(duration: number) {
        let callback = this._options["ontick"];
        typeof callback === "function" && callback(duration);
    }

    clear(clearDuration: boolean) {
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        if (clearDuration === true) {
            this._duration = 0;
        }
    }

    end() {
        this.clear(false);
        this._status = "stopped";
        this.trigger('onend');
    }
}
