import { Empty, Msg, Unit } from "../../types/Type";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List, WhiteSpace } from "antd-mobile";
import React from "react"
import { Account, InviteeStat } from "../../api/Capability";
import { env } from "../../basic/GlobalEnv";
import { sendRequest } from "../../api/EndPoint";
import { MenuSpaceDiv } from "../utils/Utils";
import { Maybe } from "../../basic/Maybe";

const Item = List.Item;

type Message = ["SwitchToMyCars"] | ["LogOut"]

type State = {
    account: Account,
    inviteeStat: InviteeStat,
}

export default class PersonalCenterUser extends BaseComponent<any, State, Message> {
    constructor(props: any) {
        super(props);
        this.state = {
            account: {
                id: 1,
                inviter: 1,
                createTime: Date.now(),
                lastLoginTime: Date.now(),
                nickname: "",
                phone:  "",
                role: "CUSTOMER",
                exp: 0,
                wxUnionId: "",
                point: 0
            },
            inviteeStat: {
                direct: 0,
                indirect: 0
            }
        }
    }

    async eval(msg: Message) {
        switch (msg[0]) {
            case "SwitchToMyCars": {
                this.goto(["MyCars"]);
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
        return (
            <div>
                <div 
                style={{ position: 'fixed', zIndex: 99, width: '100%', top: 0 }}
                className="flex-container"
                >
                    <NavBar
                        mode = "light"
                    ><b>个人中心</b></NavBar>
                </div>

                    <div style={{marginTop: '50px'}}>
                        <List className="mylist" style={{ backgroundColor: 'white' }}>
                            {this.renderItem('ID', 'icon_ID', String(this.state.account.id))}
                            {this.renderItem('昵称', 'icon_nicheng', this.state.account.nickname)}
                            {this.renderItem('会员经验值', 'icon_huiyuanjingyan', String(this.state.account.exp))}
                            {this.renderItem('会员等级', 'icon_huiyuandengji', String(this.state.account.exp))}
                            {this.renderItem('当前积分', 'icon_danqianjifen', String(this.state.account.point))}
                            {this.renderItem('1级好友数量', 'icon_yijihaoyou', '12304')}
                            {this.renderItem('2级好友数量', 'icon_erjihaoyou', '12304')}
                            {this.renderItem('我的车辆', 'icon_tianjiacheliang', '', true, this.on(["SwitchToMyCars"]))}

                            
                        </List>

                        <WhiteSpace/>
                        <Item  onClick={this.on(["LogOut"])}><div style={{width: "100%", textAlign: "center"}}>退出登录</div></Item>
                    </div>
                    <MenuSpaceDiv/>
                    {/* <MyTabBar style={{ height: 400, width: "100%", position: 'fixed', bottom: 0}}/> */}
            </div>
        )
    }

    renderItem(title: string, className: string, extra: string, showArrow: boolean = false, callback = () => {}) {
        return (
            <Item 
                thumb={<i className={className} style={{maxWidth: "12px", maxHeight: "12px"}}></i>}
                extra={extra}
                onClick={callback}
                arrow= {showArrow ? "horizontal" : ""}
            >{title}</Item>
        )
    }

    componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
        } else {
            this.set({account: env.currentAccount.val});

            sendRequest<InviteeStat>(["QueryInviteeStat"]).then(_ => {
                if (_.valid) {
                    this.set({inviteeStat: _.val})
                }
            })
        }
    }

}
