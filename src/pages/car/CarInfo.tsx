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
    car: Car
}

type Index = number;
type Msg = ["UpdateCar"] | ["DeleteCar"] | ["Back"] | ["LiensceOnChange", string] | ["VinOnChange", string]

export default class CarInfo extends BaseComponent<Props, State, Msg> {
    constructor (props: Props) {
        super(props);
        console.log(props);
        this.state = {
            car: {id: 1, accountId: 1, license: "", vin: ""}
        }
    }

    async eval(msg: Msg) {
        switch(msg[0]) {
            case "Back": {
                this.goBack();
                break;
            }
            case "LiensceOnChange": {
                this.update({car: R.set(R.lensProp('license'), msg[1])});
                break;
            }
            case "VinOnChange": {
                this.update({car: R.set(R.lensProp('vin'), msg[1])});
                break;
            }
            case "UpdateCar": {
                let car = await sendRequest<Car>(["UpdateCar", {license: this.state.car.license, vin: this.state.car.vin}, this.state.car.id]);
                if (car.valid) {
                    this.set({car: car.val});
                }
                break;
            }
            case "DeleteCar": {
                let result = await sendRequest(["DeleteCar", {}, this.state.car.id]);
                if (result.valid) {
                    this.goBack();
                }
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
                    ><b>车辆信息</b></NavBar>
                </div>
                <div className="d-flex flex-column" style={{marginTop: "50px"}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        <Item extra={this.state.car.id}>ID</Item>
                        <InputItem onChange={this.onE(v => ["LiensceOnChange", v])} value={this.state.car.license} type="text" defaultValue="" placeholder="请输入车牌号" style={{textAlign: "right"}}>车牌号</InputItem>
                        <InputItem onChange={this.onE(v => ["VinOnChange", v])} value={this.state.car.vin} type="text" defaultValue="" placeholder="请输入车辆识别码" style={{textAlign: "right"}}>车辆识别码</InputItem>
                    </List>

                    <div className="w-100 px-1 mt-3">
                        <button onClick={this.on(["UpdateCar"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "21px"}}>确定</button>
                        <button onClick={this.on(["DeleteCar"])} type="button" className="btn btn-danger w-100 text-white mt-3" style={{fontSize: "21px"}}>删除</button>
                    </div>
                <MenuSpaceDiv/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (R.path(['match', 'params', 'car'], this.props)) {
            this.set({car: JSON.parse(this.props.match.params.car)})
        }
    }
}