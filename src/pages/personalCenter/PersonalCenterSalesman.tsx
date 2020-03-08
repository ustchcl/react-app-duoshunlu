import React from "react"
import BaseComponent from "../../basic/BaseComponent";
import bg_yewuyuan from "../../assets/images/bg_yewuyuan.jpg"
import { List, Switch, WhiteSpace } from "antd-mobile";
import * as R from "ramda"
import { showOrderProcess, Car } from "../../capability/Resources";
import { displayTime } from "../../basic/BaseFunctions";
import { env, setCache } from "../../basic/GlobalEnv";
import { Account, InspectOrder, StringMessage } from "../../api/Capability";
import { sendRequest } from "../../api/EndPoint";
import { Maybe } from "../../basic/Maybe";

const Item = List.Item;

type Props = {}

type State = {
    username: string,
    orderAmount: number,
    online: "ONLINE" | "REST",
    orders: Array<InspectOrder>
    account: Account | null,
    lisences: {[key: string]: string}
}

type Msg 
    = ["OpenPC"] 
    | ["SwitchOnline"]
    | ["GotoUntakedOrders"]
    | ["OrderInfo", InspectOrder]
    | ["OrderOperation", InspectOrder]
    | ["LogOut"]



export default class PersonalCenterSalesman extends BaseComponent<Props, State, Msg>  {
    constructor (props: Props) {
        super(props);
        this.state = {
            username: "",
            orderAmount: 0,
            online: "REST",
            orders: [],
            account: null,
            lisences: {}
        }
    }

    async eval (msg: Msg) {
        switch (msg[0]) {
            case "SwitchOnline": {
                let monline = await sendRequest(["SetOnlineStatus", {status: this.state.online == "ONLINE" ? "REST" : "ONLINE"}])
                if (monline.valid) {
                    this.update({online: x => x == "ONLINE" ? "REST" : "ONLINE"});
                }
                break;
            }
            case "OpenPC": {
                this.goto(["PersonalCenterSalesman"]);
                break;
            }
            case "GotoUntakedOrders": {
                this.goto(["WaitingForAcceptOrders"]);
                break;
            }
            case "OrderOperation": {
                switch (msg[1].process) {
                    case "WAIT_FOR_APPOINT": {
                        // 确认接取订单
                        let result = await sendRequest(["ConfirmAssignedOrder", {orderId: msg[1].id}]);
                        if (result.valid) {
                            this.requestOrders();
                        }
                        break;
                    }
                    case "WAIT_FOR_WITHDRAW": {
                        // 等待提取
                        setCache(`order_${msg[1].id}`, R.clone(msg[1]));
                        this.goto(["CarOperation", msg[1].id])
                        break;
                    }
                    case "WAIT_FOR_RETURN": {
                        setCache(`order_${msg[1].id}`, R.clone(msg[1]));
                        this.goto(["CarOperation", msg[1].id])
                        // 等待还车
                        break;
                    }
                    case "ON_THE_WAY_TO_STATION": {
                        // 确认进站
                        let result = await sendRequest(["ConfirmInStation",{orderId: msg[1].id}]);
                        if (result.valid) {
                            this.requestOrders();
                        }
                        break;
                    }
                }
                
                this.goto(["CarOperation", msg[1].id]);
                break;
            }
            case "OrderInfo": {
                setCache(`order_${msg[1].id}`, R.clone(msg[1]));
                this.goto(["SalesmanOrderInfo", msg[1].id]);
                break;
            }
            case "LogOut": {
                let result = await sendRequest(["LogOut"]);
                if (result.valid) {
                    env.currentAccount = Maybe.Nothing();
                    this.goto(["Login"]);
                }
                break;
            }
        }
    }

    render() {
        return this.state.account ? (
            <div className="w-100">
                <div className="w-100 d-flex flex-column" style={{
                    height: "59.4vw",
                    backgroundPosition: "center center",
                    backgroundImage: "url(" + bg_yewuyuan + ")",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}>
                    <i className="icon_yewuyuantouxiang mx-auto mt-4"/>
                    <div className="mx-auto mt-1 text-white">{this.state.account.nickname}</div>
                </div>

                <List className="mylist" style={{ backgroundColor: 'white' }}>
                    <Item thumb={<i className="icon_dingdanshu"/>} extra={`${this.state.orderAmount}个`} onClick={() => {}}>今日已接</Item>
                    <Item thumb={<i className="icon_daijiedingdan"/>} onClick={this.on(["GotoUntakedOrders"])} arrow="horizontal">待接订单</Item>
                    <Item thumb={<i className="icon_ID"/>} onClick={this.on(["OpenPC"])} arrow="horizontal">个人中心</Item>
                    <Item thumb={<i className="icon_zaixianzhuangtai"/>} extra={<Switch className="my-auto" checked={this.state.online == "ONLINE"} onChange={this.on(["SwitchOnline"])}></Switch>} onClick={() => {}}>在线状态</Item>
                </List>

                <WhiteSpace/>
                <Item  onClick={this.on(["LogOut"])}><div style={{width: "100%", textAlign: "center"}}>退出登录</div></Item>

                <WhiteSpace/>

                <div className="w-100 d-flex py-2" style={{backgroundColor: "#ffffff", paddingLeft: "15px", borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec"}}>
                    <i className="icon_zhengzaichulidingdan"></i>
                    <div style={{color: "#df9003", fontSize: "17px", marginLeft: "15px"}}>正在处理的订单</div>
                </div>

                <WhiteSpace/>
                <div className="w-100 d-flex flex-column">
                    {this.state.orders.map(x => this.renderRecord(x))}
                </div>
            </div>
        ) : (<div></div>)
    }

    renderRecord(order: InspectOrder) {
        return (
            <div key={order.carId} className="d-block text-dark mb-3 py-2 px-2" style={{background: "#ffffff"}}>
                <div className="d-flex w-100 px-2 mb-2 pb-2 border-bottom" style={{borderBottomColor: "#555555!important", fontSize: "15px"}}>
                    创建时间
                    <div className="ml-2" style={{color: "#afaaaa"}}>{displayTime("yyyy-mm-dd:hh:mm:ss", order.createTime)}</div>
                </div>
                <div className="d-flex w-100 px-2 border-bottom mb-2 pb-2" style={{borderBottomColor: "#555555!important", fontSize: "15px"}}>
                    车牌号
                    <div className="ml-2">{this.state.lisences[order.carId]}</div>
                    <div className="ml-auto" style={order.process=="CLOSED" ? {color: "#0fb11e"} : {color: "#2996c4"}}>{showOrderProcess(order.process)}</div>
                </div>

                <div className="d-flex flex-row-reverse px-2">
                    { ["WAIT_FOR_APPOINT", "WAIT_FOR_RETURN", "WAIT_FOR_WITHDRAW", "ON_THE_WAY_TO_STATION"].indexOf(order.process) != -1 ? 
                        (<div onClick={this.on(["OrderOperation", order])} className="btn rect-button my-auto ml-3" style={{borderRadius: "0px", fontSize: "15px", padding: "3px 15px 3px 15px"}}>{this.getBtnName(order)}</div>)
                        : (<></>) }
                    <div onClick={this.on(["OrderInfo", order])} className="btn rect-button my-auto" style={{borderRadius: "0px", fontSize: "15px", padding: "3px 15px 3px 15px"}}>订单详情</div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
        } else if (env.currentAccount.val.role == "CUSTOMER") {
            this.goto(["Main"]);
        } else {
            this.set({account: env.currentAccount.val})

            this.requestOrders();
            let monline = await sendRequest<{content: "REST" | "ONLINE"}>(["GetOnlineStatus"]);
            this.set({online: monline.map(x => x.content).getOrElse("REST")});
        }
    }

    async requestOrders() {
        let morders = await sendRequest<Array<InspectOrder>>(["RetrieveAllAsigned"]);
        if (morders.valid) {
            this.set({orders: morders.val, orderAmount: morders.val.length})
            let cars = await Promise.all(morders.val.map(x => x.carId).map(carId => sendRequest<Car>(["RetrieveCar", {}, carId])));
            let lisences: {[key: string]: string} = {};
            cars.forEach(c => c.valid && (lisences[c.val.id] = c.val.license));
            this.set({lisences: lisences});
        }
    }


    getBtnName(order: InspectOrder) {
        switch (order.process) {
            case "WAIT_FOR_APPOINT": return "确认接取";
            case "WAIT_FOR_RETURN": return "归还车辆";
            case "WAIT_FOR_WITHDRAW": return "提取车辆";
            case "ON_THE_WAY_TO_STATION": return "确认进站";
            default: return ""
        }
    }
}