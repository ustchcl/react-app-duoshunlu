import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List } from "antd-mobile";
import React from "react"
import { Empty } from "../../types/Type";
import { env } from "../../basic/GlobalEnv";
import { Account, InspectOrder } from "../../api/Capability";
import { sendRequest } from "../../api/EndPoint";

const Item = List.Item;


type State = {
    account: Account,
    orderAmount: number,
}
type Msg = ["Back"]


export default class PersonalCenterAd extends BaseComponent<Empty, State, Msg> {
    constructor(props: Empty) {
        super(props);
    }

    eval(msg: Msg) {
        switch (msg[0]) {
            case "Back": {
                this.goBack();
                break;
            }
        }
    }

    render() {
        return this.state ? (
            <div className="d-flex flex-column w-100">
                <div 
                style={{ position: 'fixed', zIndex: 99, width: '100%', top: 0 }}
                className="flex-container"
                >
                    <NavBar
                        mode = "light"
                        icon = {<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    >个人中心</NavBar>
                </div>

                <div style={{marginTop: '50px'}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        {this.renderItem('ID', 'icon_ID', this.state.account.id.toString())}
                        {this.renderItem('昵称', 'icon_nicheng', this.state.account.nickname)}
                        {this.renderItem('已接订单数', 'icon_dingdanshu', this.state.orderAmount.toString())}
                    </List>
                </div>
                {/* <MyTabBar style={{ height: 400, width: "100%", position: 'fixed', bottom: 0}}/> */}
            </div>
        ) : (<></>)
    }

    renderItem(title: string, className: string, extra: string, showArrow: boolean = false) {
        return (
            <Item 
                thumb={<i className={className} style={{maxWidth: "12px", maxHeight: "12px"}}></i>}
                extra={extra}
                onClick={() => {}}
                arrow= {showArrow ? "horizontal" : ""}
            >{title}</Item>
        )
    }

    async componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
        } else if (env.currentAccount.val.role == "CUSTOMER") {
            this.goto(["Main"]);
        } else {
            let morders = await sendRequest<Array<InspectOrder>>(["RetrieveAllAsigned"]);
            this.set({account: env.currentAccount.val, orderAmount: morders.map(x => x.length).getOrElse(0)})
        }
    }

}