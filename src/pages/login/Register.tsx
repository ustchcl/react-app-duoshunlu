import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List, InputItem, Toast, WhiteSpace } from "antd-mobile";
import React from "react"
import { Empty } from "../../types/Type";
import { inRange, ifNullThen } from "../../basic/BaseFunctions";
import * as R from "ramda"
import { InputGroup } from "../utils/Utils";
import logo from "../../assets/images/logo.png"
import { Timer } from "../../basic/Timer";
import { sendRequest } from "../../api/EndPoint";
import { number } from "prop-types";
import { StringMessage, Account } from "../../api/Capability";
import { env } from "../../basic/GlobalEnv";


type VcodeBtnState
    = ["Available"]
    | ["Disable"]
    | ["Wait", number]

type Msg 
    = ["Register"]
    | ["PhoneOnChange", string]
    | ["NicknameOnChange", string]
    | ["PasswordOnChange", string]
    | ["PasswordConfirmOnChange", string]
    | ["VerifyCodeOnChange", string]
    | ["GetVCode"]
    | ["CounterDown", number]
    | ["CounterDownEnd"]
    | ["Back"]

type State = {
    phoneNumber: string,
    nickname: string,
    inviter: string
    password: string,
    passwordConfirm: string,
    verifyCode: string
    vcodeBtnState: VcodeBtnState
}

export class Register extends BaseComponent<Empty, State, Msg> {
    constructor(props: Empty) {
        super(props);
        this.state = {
            phoneNumber: "",
            inviter: "",
            nickname: "",
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
            case "NicknameOnChange": {
                this.set({nickname: msg[1]});
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
                    Toast.fail("手机号码长度不对", 1);
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
            case "CounterDown": {
                this.set({vcodeBtnState: ["Wait", msg[1]]})
                break;
            }
            case "CounterDownEnd": {
                this.set({vcodeBtnState: ["Available"]});
                break;
            }
            case "Register": {
                let params = {phone: this.state.phoneNumber, nickname: this.state.nickname, password: this.state.password, vcode: this.state.verifyCode}
                if (this.state.inviter != "") {
                    params = R.assoc("inviter", this.state.inviter, params);
                }
                let maccount = await sendRequest<Account>(["CreateAccount", params]);
                if (maccount.valid) {
                    env.currentAccount = maccount;
                    this.goto(["Main"]);
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
                >注册新账号</NavBar>

                <div className='container mt-4'>
                    <div className="d-flex justify-content-center align-items-center col-12">
                        <img src={logo} style={{maxWidth: "60%"}}></img>
                    </div>
                    <form className="col-12 p-0 mt-4">
                        <InputGroup onChange={this.onE(e => ["PhoneOnChange", e.target.value])} id="phone" icon="fas fa-mobile-alt" maxLength={11} placeholder="手机号码" required={true} value={this.state.phoneNumber} type="text"/>
                        <div className="input-group px-3 mb-3">
                            <div className="input-group-prepend">
                                <span id={`inviter-prepend`} className="input-group-text d-flex justify-content-center" style={{width: "50px"}}>
                                    <i className="fas fa-user-alt"></i>
                                </span>
                            </div>
                            <input readOnly={true} type="text" className="form-control" id="validation-inviter" required={false} value={this.state.inviter}></input>
                            <div className="invalid-feedback"></div>
                        </div>
                        <InputGroup onChange={this.onE(e => ["NicknameOnChange", e.target.value])}  id="phone" icon="fas fa-user-alt" placeholder="昵称" required={true} value={this.state.nickname} type="text"/>
                        <InputGroup onChange={this.onE(e => ["PasswordOnChange", e.target.value])} id="password" icon="fas fa-unlock-alt" placeholder="输入密码" required={true} value={this.state.password} type="password"/>
                        <InputGroup onChange={this.onE(e => ["PasswordConfirmOnChange", e.target.value])} id="passwordConfirm" icon="fas fa-unlock-alt" placeholder="重新输入密码" required={true} value={this.state.passwordConfirm} type="password"/>
                        
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
                                        case "Wait": return `(${this.state.vcodeBtnState[1]}s后重试)`
                                    }
                                })()}
                            </button>
                            <div className="invalid-feedback"></div>
                        </div>
                    </form>
                    <div className="w-100  px-3  mt-3">
                        <button onClick={this.on(["Register"])} type="button" className="btn blue-btn w-100 text-white" style={{fontSize: "22px"}}>注册</button>
                    </div>
                </div>
                <WhiteSpace/>
                
            </div>
        )
    }

    counterDown(duration: number) {
        let t = Math.ceil(duration/1000);
        this.on(["CounterDown", t])();
    }

    componentDidMount() {
        let href = window.location.href;
        let index = href.indexOf('inviter_id=');
        if (index === -1) {
            this.set({inviter: ""});
        } else {
            this.set({inviter: href.slice(index+11)});
        }
    }

}