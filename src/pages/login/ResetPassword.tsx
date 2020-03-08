import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List, InputItem } from "antd-mobile";
import React from "react"
import MyTabBar from "../components/MyTabBar";
import { Empty } from "../../types/Type";
import { inRange, showMessage } from "../../basic/BaseFunctions";
import * as R from "ramda"
import { InputGroup } from "../utils/Utils";
import logo from "../../assets/images/logo.png"
import { sendRequest } from "../../api/EndPoint";
import { StringMessage } from "../../api/Capability";
import { Timer } from "../../basic/Timer";


type VcodeBtnState
    = ["Available"]
    | ["Disable"]
    | ["Wait", number]

type Msg 
    = ["ResetPassword"]
    | ["PhoneOnChange", string]
    | ["PasswordOnChange", string]
    | ["PasswordConfirmOnChange", string]
    | ["VerifyCodeOnChange", string]
    | ["GetVCode"]
    | ["CounterDown", number]
    | ["CounterDownEnd"]
    | ["Back"]

type State = {
    phoneNumber: string,
    password: string,
    passwordConfirm: string,
    verifyCode: string
    vcodeBtnState: VcodeBtnState
}

export class ResetPassword extends BaseComponent<Empty, State, Msg> {
    constructor(props: Empty) {
        super(props);
        this.state = {
            phoneNumber: "",
            password: "",
            passwordConfirm: "",
            verifyCode: "",
            vcodeBtnState: ["Available"]
        }
    }

    async eval(msg: Msg) {
        switch(msg[0]) {
            case "PhoneOnChange": {
                this.set({phoneNumber: msg[1]});
                break;
            }
            case "PasswordOnChange": {
                this.set({password: msg[1]});
                break;
            }
            case "PasswordConfirmOnChange": {
                this.set({passwordConfirm: msg[1]});
                break;
            }
            case "VerifyCodeOnChange": {
                this.set({verifyCode: msg[1]});
                break;
            }
            case "GetVCode": {
                if (this.state.phoneNumber.length != 11) {
                    showMessage(["Fail", "手机号码长度不对"]);
                    break;
                }
                let vcode = await sendRequest<StringMessage>(["CreateVCode", {phone: this.state.phoneNumber}]);
                console.log(vcode);
                let timer = new Timer();
                let total = 60;
                timer.on('ontick', this.counterDown.bind(this)).on("onend", this.on(["CounterDownEnd"]).bind(this)).start(total);
                this.set({vcodeBtnState: ["Wait", total]})
                break;
            }
            case "ResetPassword": {
                if (this.state.verifyCode.length == 0) {
                    showMessage(["Fail", "请填写验证码"]);
                    break;
                }
                if (this.state.passwordConfirm != this.state.password) {
                    showMessage(["Fail", "两次输入的密码不一致"]);
                    break;
                }
                let result = await sendRequest(["ResetPassword", {
                    phone: this.state.phoneNumber,
                    password: this.state.password,
                    vcode: this.state.verifyCode
                }])
                if (result.valid) {
                    this.goto(["Login"]);
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
        return (
            <div
                style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
                className="flex-container"
            >
                <NavBar
                    mode="light"
                    icon={<Icon type="left"></Icon>}
                    onLeftClick={this.on(["Back"])}
                >修改密码</NavBar>

                <div className='container mt-4'>
                    <div className="d-flex justify-content-center align-items-center col-12">
                        <img src={logo} style={{width: "50%"}}></img>
                    </div>
                    <form className="col-12 p-0 mt-5">
                        <InputGroup maxLength={11} onChange={this.onE(e => ["PhoneOnChange", e.target.value])}  id="phone" icon="fas fa-mobile-alt" placeholder="手机号码" required={true} value={this.state.phoneNumber} type="text"/>
     
                        <div className="input-group px-3 mb-3">
                            <div className="input-group-prepend">
                                <span id="vcode-prepend" className="input-group-text d-flex justify-content-center" style={{width: "50px"}}>
                                    <i className="fa fa-comments"></i>
                                </span>
                            </div>
                            <input onChange={this.onE(e => ["VerifyCodeOnChange", e.target.value])} type="text" className="form-control" id={`validation-vcode`} required={true} placeholder="输入验证码" value={this.state.verifyCode}></input>
                            <button type="button" className="btn btn-secondary ml-2" onClick={this.on(["GetVCode"])} disabled={this.state.vcodeBtnState[0] != "Available"}>
                                {(() => {
                                    switch(this.state.vcodeBtnState[0]) {
                                        case "Available": return "点击获取";
                                        case "Disable": return "点击获取";
                                        case "Wait":  return `(${this.state.vcodeBtnState[1]}s后重试)`;
                                    }
                                })()}
                            </button>
                            <div className="invalid-feedback"></div>
                        </div>

                        <InputGroup onChange={this.onE(e => ["PasswordOnChange", e.target.value])} id="password" icon="fas fa-unlock-alt" placeholder="输入密码" required={true} value={this.state.password} type="password"/>
                        <InputGroup onChange={this.onE(e => ["PasswordConfirmOnChange", e.target.value])} id="passwordConfirm" icon="fas fa-unlock-alt" placeholder="重新输入密码" required={true} value={this.state.passwordConfirm} type="password"/>
                    </form>
                    <div className="w-100  px-3  mt-3">
                        <button onClick={this.on(["ResetPassword"])} type="button" className="blue-btn btn w-100 text-white" style={{fontSize: "22px"}}>重置</button>
                    </div>
                </div>
                
            </div>
        )
   
    }

    counterDown(duration: number) {
        let t = Math.ceil(duration/1000);
        this.on(["CounterDown", t])();
    }

}