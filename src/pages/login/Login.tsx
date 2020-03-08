import React from "react"
import BaseComponent from "../../basic/BaseComponent";
import bg_login from "../../assets/images/bg_tupian.png";
import logo from "../../assets/images/logo.png";
import { InputGroup } from "../utils/Utils";
import { sendRequest } from "../../api/EndPoint";
import { env } from "../../basic/GlobalEnv";
import { Account } from "../../api/Capability";


type Props = {};
type State = {
    phoneNumber: string,
    password: string
}
type Msg 
    = ["Login"]
    | ["PhoneOnChange", string]
    | ["PasswordOnChange", string]
    | ["GotoResetPassword"]
    | ["GotoRegister"]
    | ["LoginWithWechat"]


export default class Login extends BaseComponent<Props, State, Msg> {
    constructor (props: Props) {
        super(props);
        this.state = {
            phoneNumber: "",
            password: ''
        }
    }

    async eval (msg: Msg) {
        switch (msg[0]) {
            case "Login": {
                await sendRequest(["Login", {phone: this.state.phoneNumber, password: this.state.password}]);
                let maccount = await sendRequest<Account>(["Mine"]);
                console.log(maccount);
                env.currentAccount = maccount;
                if (maccount.valid) {
                    if (maccount.val.role == "CUSTOMER") {
                        this.goto(["Main"]);
                    } else {
                        this.goto(["SalesmanMain"]);
                    }
                }
                break;
            }
            case "PasswordOnChange": {
                this.set({password: msg[1]});
                break;
            }
            case "PhoneOnChange": {
                this.set({phoneNumber: msg[1]});
                break;
            }
            case "GotoRegister": {
                this.goto(["Register"]);
                break;
            }
            case "GotoResetPassword": {
                this.goto(["ResetPassword"]);
                break;
            }
            case "LoginWithWechat": {
                console.log("LoginWithWechat");
                break;
            }
        }
    }

    render () {
        return (
            <div className="w-100 d-flex flex-column" style={{
                backgroundPosition: "center top",
                backgroundImage: "url(" + bg_login + ")",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
            }}>  
                <div style={{
                    width: "100%",
                    height: window.innerWidth * 0.3
                }}></div>
                <div className="mx-auto d-flex flex-column" style={{
                    borderRadius: "15px",
                    border: "1px solid #f5f5f5",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 0 10px gray",
                    width: "92%",
                }}>
                    <img className="mx-auto mt-4" src={logo} style={{
                        width: "37%",
                        height: "21.8vw"
                    }}/>
                    <div className="px-4" style={{marginTop: "30px"}}>
                        <InputGroup maxLength={11} className="input-group px-3 mb-4" onChange={this.onE(e => ["PhoneOnChange", e.target.value])}  id="phone" icon="icon_shoujihaoma" placeholder="手机号码" required={true} value={this.state.phoneNumber} type="text"/>
                        <InputGroup onChange={this.onE(e => ["PasswordOnChange", e.target.value])} id="password" icon="icon_mima" placeholder="输入密码" required={true} value={this.state.password} type="password"/>
                        <div className="px-3 w-100">
                            <button onClick={this.on(["Login"])} className="btn btn-primary mt-3 w-100" style={{fontSize: "20px"}}>登录</button>
                        </div>
                    </div>
                    <div className="d-flex mx-auto my-3" style={{width: "80%", color: "#8b8a8a"}}>
                        <div className="btn" onClick={this.on(["GotoResetPassword"])}>忘记密码?</div>
                        <div className="ml-auto btn" onClick={this.on(["GotoRegister"])}>注册新账号</div>
                    </div>
                </div>
                <div className="mt-4 w-100 d-flex align-items-center justify-content-center" style={{color: "#bfbfbf"}}>
                    <div className="border w-25 mr-2" style={{height: "0px"}}></div>
                    第三方登录
                    <div className="border w-25 ml-2" style={{height: "0px"}}></div>
                </div>
                <div className="mt-3 d-flex">
                    <i className="mx-auto icon_weixin"></i>
                </div>
            </div>
        )
    }
}