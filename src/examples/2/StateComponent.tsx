import { Empty } from "../../types/Type";
import { add } from "ramda"
import BaseComponent from "../../basic/BaseComponent";
import React from "react"

type Props = Empty;
type State = {
    seconds: number
}
type Msg = ["Tick"]

export class Timer extends BaseComponent<Props, State, Msg>  {
    interval: any;

    constructor(props: Props) {
        super(props);
        this.state = { seconds: 0 };
    }

    eval(msg: Msg) {
        switch (msg[0]) {
            case "Tick": {
                this.update({ seconds: add(1) })
                break;
            }
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.on(["Tick"]), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                Seconds: {this.state.seconds}
            </div>
        );
    }
}