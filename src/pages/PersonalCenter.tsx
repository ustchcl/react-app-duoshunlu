import { Empty, Msg, Unit } from "../types/Type";
import BaseComponent from "../basic/BaseComponent";
import { NavBar, Icon, List } from "antd-mobile";
import React from "react"
import { MyTabBar } from "./components/MyTabBar";

const Item = List.Item;

type Message = Msg<Unit, Unit>

export class PersonalCenter extends BaseComponent<Empty, Empty, Message> {
    constructor(props: Empty) {
        super(props);
    }

    eval(msg: Message) {

    }

    render() {
        return (
            <div 
            style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
            className="flex-container"
            >
                <NavBar
                    mode = "light"
                    icon = {<Icon type="left"></Icon>}
                    onLeftClick={ () => console.log("onLeftClick")}
                >个人中心</NavBar>

                <div style={{marginTop: '16px'}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        {this.renderItem('ID', 'far fa-user', '001')}
                        {this.renderItem('昵称', 'far fa-question-circle', '昵称啊', true)}
                        {this.renderItem('会员经验值', 'far fa-star', '999999')}
                        {this.renderItem('会员等级', 'fas fa-star', '9')}
                        {this.renderItem('当前积分', 'far fa-question-circle', '12304')}
                    </List>

                </div>
                {/* <MyTabBar style={{ height: 400, width: "100%", position: 'fixed', bottom: 0}}/> */}
            </div>
        )
    }

    renderItem(title: string, className: string, extra: string, showArrow: boolean = false) {
        return (
            <Item 
                thumb={<i className={className}></i>}
                extra={extra}
                onClick={() => {}}
                arrow= {showArrow ? "horizontal" : ""}
            >{title}</Item>
        )
    }

}
