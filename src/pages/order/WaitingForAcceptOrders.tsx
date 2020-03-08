import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, WhiteSpace } from "antd-mobile"
import { showOrderProcess } from "../../capability/Resources";
import { displayTime } from "../../basic/BaseFunctions";
import { sendRequest } from "../../api/EndPoint";
import { InspectOrder, Car } from "../../api/Capability";
import { env, setCache } from "../../basic/GlobalEnv";

type Props = {}

type State = {
    orders: Array<InspectOrder>,
    carLisences: {[key: number]: string}
}

type Index = number;
type Msg = ["Select", InspectOrder] | ["Back"]



export default class WaitingForAcceptOrders extends BaseComponent<Props, State, Msg> {
    constructor (props: Props) {
        super(props);
        this.state = {
            orders: [],
            carLisences: {}
        }
    }

    eval(msg: Msg) {
        switch (msg[0]) {
            case "Select": {
                setCache(`order_${msg[1].id}`, msg[1]);
                this.goto(["SalesmanOrderInfo", msg[1].id]);
                break;
            }
            case "Back": {
                this.goBack();
                break;
            }
        }
    }

    render() {
        return (
            <div className="d-flex flex-column">
            <div
                style={{ position: 'fixed', zIndex: 99, width: '100%', top: 0 }}
                className="flex-container"
            >
                <NavBar
                    mode="light"
                    icon={<Icon type="left"></Icon>}
                    onLeftClick={this.on(["Back"])}
                ><b>待接订单</b></NavBar>
            </div>
                <div style={{marginTop: "50px"}}>
                    {this.state.orders.map(x => this.renderRecord(x))}
                </div>
            </div>
        )
    }


    renderRecord(order: InspectOrder) {
        return (
            <div onClick={this.on(["Select", order])} key={order.id} className="d-block text-dark mb-3 py-2 px-2" style={{background: "#ffffff"}}>
                <div className="d-flex w-100 px-2 mb-2 pb-2 border-bottom" style={{borderBottomColor: "#555555!important", fontSize: "15px"}}>
                    创建时间
                    <div className="ml-2" style={{color: "#afaaaa"}}>{displayTime("yyyy-mm-dd:hh:mm:ss", order.createTime)}</div>
                    
                </div>
                <div className="d-flex w-100 px-2">
                    车牌号
                    <div className="ml-2">{this.state.carLisences[order.carId]}</div>
                    <div className="ml-auto" style={{color: "#e73c1a"}}>{showOrderProcess(order.process)}</div>
                </div>
            </div>
        )
    }


    async componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
            return;
        } else if (env.currentAccount.val.role == "CUSTOMER") {
            this.goto(["Main"]);
            return;
        }
        let morders = await sendRequest<Array<InspectOrder>>(["RetrieveAllUnassigned"]);
        if (morders.valid) {
            this.set({orders: morders.val});
            let cars = await Promise.all(morders.val.map(x => x.carId).map(carId => sendRequest<Car>(["RetrieveCar", {}, carId])));
            let lisences: {[key: string]: string} = {};
            cars.forEach(c => c.valid && (lisences[c.val.id] = c.val.license));
            this.set({carLisences: lisences});
        }
    }
}