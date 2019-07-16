import BaseComponent from "../../basic/BaseComponent";
import * as R from "ramda";
import React from "react"
import { Empty } from "../../types/Type";

type Props = Empty

type State = {
    count: number;
    double: boolean;
}

type Msg 
    = ["Inc"]
    | ["Dec"]
    | ["Set", number]
    | ["Switch"]
    | ["Reset"]
    
export class Counter extends BaseComponent<Props, State, Msg> {
  constructor(props: Props) {
    super(props);
    this.state = {
      count: 0,
      double: false
    };

    this.setState((state, props) => ({count: state.count + 1}))
  }

  eval(msg: Msg) {
    switch(msg[0]) {
        case "Inc": {
            this.update({ count: R.add(1) })
            break;
        }
        case "Dec": {
            this.update({ count: R.subtract(R.__, 1) });
            break;
        }
        case "Set": {
            this.set({ count: msg[1] });
            break;
        }
        case "Switch": {
            this.update({ double: R.not });
            break;
        }
        case "Reset": {
            this.update({
                count: R.always(0),
                double: R.always(false)
            });
            break;
        }
    }
  }

  render() {
      return (
          <div>
              <p> Counter: {this.state.double ? this.state.count * 2 : this.state.count} </p>
              <p> State: {"{ count: " + this.state.count + ", double: " + this.state.double + "  }"}  </p>
              <button onClick={this.on(["Inc"])}> +1 </button>
              <button onClick={this.on(["Dec"])}> -1 </button>
              <button onClick={this.on(["Set", 999])}> set999 </button>
              <button onClick={this.on(["Switch"])}> {this.state.double ? "un" : ""}double </button>
              <button onClick={this.on(["Reset"])}> reset </button>
          </div>
      )
  }
}