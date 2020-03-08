import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List } from "antd-mobile"
import { Car } from "../../api/Capability";
import { sendRequest } from "../../api/EndPoint";

const Item = List.Item;

type Props = any

type State = {
    cars: Array<Car>
}

type Msg = ["Select", Car] | ["Back"] | ["CreateCar"]


const ForkData: Array<Car> = 
    [ {id: 1, accountId: 1, license: "粤SD7777", vin: "2314"}
    , {id: 2, accountId: 1, license: "粤SD8888", vin: "2314"}
    , {id: 3, accountId: 1, license: "粤SD9999", vin: "2314"}
    , {id: 4, accountId: 1, license: "粤SD6666", vin: "2314"}
    ]

export default class MyCars extends BaseComponent<Props, State, Msg> {
    constructor (props: Props) {
        super(props);
        this.state = {
            cars: []
        }
    }

    eval(msg: Msg) {
        switch (msg[0]) {
            case "Select": {
                this.goto(["CarInfo", msg[1]])
                break;
            }
            case "Back": {
                this.goBack();
                break;
            }
            case "CreateCar": {
                this.goto(["CreateCar"]);
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
                        mode="light"
                        icon={<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    ><b>我的车辆</b></NavBar>
                </div>
                <div className="d-flex flex-column" style={{marginTop: "50px"}}>
                    <List className="mylist" style={{ backgroundColor: 'white' }}>
                        {this.state.cars.map(x => this.renderItem(x))}
                    </List>

                    <div className="w-100 px-1 mt-3">
                        <button onClick={this.on(["CreateCar"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "21px"}}>登记车辆</button>
                    </div>
                </div>
            </div>
        )
    }


    renderItem(car: Car) {
        return (
            <Item
                key={car.id} 
                onClick={this.on(["Select", car])}
                arrow= "horizontal"
            >{car.license}</Item>
        )
    }

    async componentDidMount() {
        let cars = await sendRequest<Array<Car>>(["RetrieveAllCar"]);
        this.set({cars: cars.getOrElse([])});
    }
}