import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, WhiteSpace } from "antd-mobile"
import { showOrderProcess, Car } from "../../capability/Resources";
import { displayTime } from "../../basic/BaseFunctions";
import { MenuSpaceDiv } from "../utils/Utils";
import { InspectOrder } from "../../api/Capability";
import { sendRequest } from "../../api/EndPoint";
import { setCache, env } from "../../basic/GlobalEnv";

type Props = {}

type State = {
    orders: Array<InspectOrder>,
    carLisences: {[key: number]: string}
}

type Msg = ["Select", InspectOrder]



export default class MyOrders extends BaseComponent<Props, State, Msg> {
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
                this.goto(["OrderInfo", msg[1].id]);
                break;
            }
        }
    }

    render() {
        return (
            <div className="w-100 d-flex flex-column">
                <div
                    style={{ position: 'fixed', width: '100%', top: 0, zIndex: 99 }}
                    className="flex-container d-flex flex-column"
                >
                    <NavBar
                        mode="light"
                    ><b>我的订单</b></NavBar>
                </div>
                <div className="d-flex flex-column" style={{marginTop: "50px"}}>
                    {this.state.orders.map(x => this.renderRecord(x))}
                </div>
                <MenuSpaceDiv/>
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
                    <div className="ml-auto" style={order.process=="CLOSED" ? {color: "#0fb11e"} : {color: "#2996c4"}}>{showOrderProcess(order.process)}</div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
            return;
        }
        let morders = await sendRequest<Array<InspectOrder>>(["RetrieveAllOrder"]);
        if (morders.valid) {
            this.set({orders: morders.val});

            let mcars = await sendRequest<Array<Car>>(["RetrieveAllCar"]);
            if (mcars.valid) {
                let cars = mcars.getOrElse([]);
                let lisences: {[key: number]: string} = {};
                cars.forEach(car => {
                    lisences[car.id] = car.license;
                });
                this.set({carLisences: lisences})
            }
        }
    }
}