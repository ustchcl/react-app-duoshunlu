import { Empty  } from "../../types/Type";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List } from "antd-mobile";
import React from "react"
import { MenuSpaceDiv } from "../utils/Utils";
import { Order, showOrderProcess } from "../../capability/Resources";
import * as R from "ramda"
import { sendRequest } from "../../api/EndPoint";
import { getCache, env } from "../../basic/GlobalEnv";
import { displayTime, showMessage } from "../../basic/BaseFunctions";
import { Maybe } from "../../basic/Maybe";
import { InspectOrder, Car, StringMessage } from "../../api/Capability";
import CarInfo from "../car/CarInfo";

const Item = List.Item;
const Brief = Item.Brief;

type Msg = ["Accept"] | ["Delete"] | ["Recheck"] | ["Back"]

type Props = any;

type State =  {
    order: InspectOrder,
    carVin: string,
    creatorName: string,
    salesmanName: string,
}

export default class OrderInfo extends BaseComponent<Props, State, Msg> {
    constructor(props: Props) {
        super(props);
    }

    async eval(msg: Msg) {
        switch (msg[0]) {
            case "Accept": {
                let result = await sendRequest(["TakeOrder", {orderId: this.state.order.id + ''}]);
                if (result.valid) {
                    showMessage(["Success", "订单接取成功"]);
                    this.goBack();
                }
                break;
            }
            case "Delete": {
                let result = await sendRequest(["DeleteOrder"]);
                if (result.valid) {
                    this.goBack();
                }
                break;
            }
            case "Recheck": {
                let result = await sendRequest(["Replay"]);
                if (result.valid) {
                    this.goBack();
                }
                break;
            }
            case "Back": {
                this.goBack();
                break;
            }
        }
    }

    render() {
        let _this = this;
        return (this.state && this.state.order) ? (
            <div>
                <div 
                style={{ position: 'fixed', zIndex: 99, width: '100%', top: 0 }}
                className="flex-container"
                >
                    <NavBar
                        mode = "light"
                        icon = {<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    >订单信息</NavBar>
                </div>

                <div style={{marginTop: '50px'}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        {this.renderItem('ID', 'icon_ID', this.state.order.id.toString())}
                        {this.renderItem('创建时间', 'icon_ticheqidian', displayTime('yyyy-mm-dd:hh:mm:ss', this.state.order.createTime))} 
                        {this.renderItem('创建者', 'icon_nicheng', this.state.creatorName)}
                        {this.renderItem('业务员', 'icon_zhengzaichulidingdan', this.state.salesmanName)}
                        {this.renderItem('车牌号码', 'icon_chepaihaoma', this.state.carVin)}
                        {this.renderItem('预约时间', 'icon_yuyueshijian', this.state.order.appointmentFrom + '-' + this.state.order.appointmentTo.split(' ')[1])}
                        {/* {this.renderItem('预约地点', 'icon_yuyuedidian', <div></div>)} */}
                        <Item 
                            onClick={() => {}}
                            multipleLine 
                            align="top"
                            wrap
                        ><i className='icon_yuyuedidian' style={{marginRight: "15px"}}></i>预约地点<div style={{fontSize: "15px", color: "#888", marginLeft: "37px"}}>{this.state.order.appointmentLocation}</div></Item>
                        {this.renderItem('订单进度', 'icon_dingdanjindu', showOrderProcess(this.state.order.process))}
                        {this.renderItem('审核结果', 'icon_shenchajieguo', '未进行年审')}
                    </List>


                    <div className="w-100 px-1 mt-3">
                        { function () {
                            switch (_this.state.order.process) {
                                case "WAIT_FOR_PAYMENT": return (<button onClick={_this.on(["Delete"])} type="button" className="btn btn-danger w-100 text-white" style={{fontSize: "22px"}}>删除</button>);
                                case "WAIT_FOR_APPOINT": return (env.currentAccount.map(x => x.role == "SALES").getOrElse(false)) ? (<button onClick={_this.on(["Accept"])} type="button" className="btn btn-warning w-100 text-white" style={{fontSize: "22px"}}>接取</button>) : (<></>)
                                default: return (_this.state.order.inspectResult == false) ? (<button onClick={_this.on(["Recheck"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "22px"}}>复检</button>) : (<></>)
                            }
                            // <button onClick={this.on(["Accept"])} type="button" className="btn btn-warning w-100 text-white" style={{fontSize: "22px"}}>接取</button>
                            // <button onClick={this.on(["Recheck"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "22px"}}>复检</button>
                            // <button onClick={this.on(["Delete"])} type="button" className="btn btn-danger w-100 text-white" style={{fontSize: "22px"}}>删除</button>
                        }()}
                    </div>

                </div>
                <MenuSpaceDiv/>
            </div>
        ) : (<div></div>)
    }

    renderItem(title: string, className: string, extra: string | any, showArrow: boolean = false) {
        return (
            <Item 
                thumb={<i className={className}></i>}
                extra={extra}
                onClick={() => {}}
                arrow= {showArrow ? "horizontal" : ""}
            >{title}</Item>
        )
    }

    async componentDidMount() {
        if (R.path(['match', 'params', 'orderId'], this.props)) {
            let orderId = this.props.match.params.orderId;
            let cache = getCache(`order_${orderId}`) as InspectOrder;
            if (cache) {
                let creatorId = cache.customerId;
                let salesmanId = cache.salesId;
                let creatorName = "";
                let salesmanName = "";

                // 查询名字
                if (creatorId) {
                    let resultCreatorName = await sendRequest<StringMessage>(["QueryNickname", {}, creatorId])
                    creatorName = resultCreatorName.map(x => x.content).getOrElse('');
                }
                if (salesmanId) {
                    let resultSalesmanName = await sendRequest<StringMessage>(["QueryNickname", {}, salesmanId])
                    salesmanName = resultSalesmanName.map(x => x.content).getOrElse('');
                }

                this.set({order: cache, creatorName: creatorName, salesmanName: salesmanName});

                let mCar = await sendRequest<Car>(["RetrieveCar", {}, cache.carId]);
                this.set({carVin: mCar.map(x => x.vin).getOrElse('')})
            } else {
                this.goBack();
            }
        }
    }

}
