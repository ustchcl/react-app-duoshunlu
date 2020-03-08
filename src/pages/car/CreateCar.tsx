import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List, InputItem } from "antd-mobile"
import { Car } from "../../capability/Resources";
import { MenuSpaceDiv } from "../utils/Utils";
import * as R from "ramda"
import { sendRequest } from "../../api/EndPoint";

const Item = List.Item;

type Props = any;

type State = {
    license: string,
    vin: string
}

type Index = number;
type Msg = ["CreateCar"] | ["Back"] | ["LicenseOnChange", string] | ["VinOnChange", string]

export default class CreateCar extends BaseComponent<Props, State, Msg> {
    constructor (props: Props) {
        super(props);
        console.log(props);
        this.state = {
            license: "",
            vin: ""
        }
    }

    async eval(msg: Msg) {
        switch(msg[0]) {
            case "Back": {
                this.goBack();
                break;
            }
            case "CreateCar": {
                let result = await sendRequest(["CreateCar", {license: this.state.license, vin: this.state.vin}]);
                if (result.valid) {
                    this.goBack();
                }
                break;
            }
            case "LicenseOnChange": {
                this.set({license: msg[1]});
                break;
            }
            case "VinOnChange": {
                this.set({vin: msg[1]});
                break;
            }
        }
    }

    render() {
        return (
            <div className="w-100">
                <div
                    style={{ position: 'fixed', zIndex: 99, width: '100%', top: 0 }}
                    className="flex-container"
                >
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    ><b>添加车辆</b></NavBar>
                </div>
                <div className="d-flex flex-column" style={{marginTop: "50px"}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        <InputItem onChange={this.onE(v => ["LicenseOnChange", v])} value={this.state.license} type="text" defaultValue="" placeholder="请输入车牌号" style={{textAlign: "right"}}>车牌号</InputItem>
                        <InputItem onChange={this.onE(v => ["VinOnChange", v])} maxLength={4} value={this.state.vin} type="text" defaultValue="" placeholder="请输入车辆识别码" style={{textAlign: "right"}}>车辆识别码</InputItem>
                    </List>

                    <div className="w-100 px-1 mt-3">
                        <button onClick={this.on(["CreateCar"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "21px"}}>确定</button>
                    </div>
                <MenuSpaceDiv/>
                </div>
            </div>
        )
    }
}