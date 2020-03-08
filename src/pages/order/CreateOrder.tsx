import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, List, InputItem, DatePicker, Picker } from "antd-mobile"
import { Order } from "../../capability/Resources";
import { displayTime, ifNullThen, compress, showMessage } from "../../basic/BaseFunctions";
import bt_zhaoxiang from "../../assets/images/bt_zhaoxiang.png";
import { Maybe } from "../../basic/Maybe";
import { MenuSpaceDiv } from "../utils/Utils";
import { Car } from "../../api/Capability";
import OrderInfo from "./OrderInfo";
import { OrderKey } from "../../basic/Contants";
import { sendRequest } from "../../api/EndPoint";
import * as R from "ramda"
import { env } from "../../basic/GlobalEnv";

const Item = List.Item;

type Props = {}

type State = {
    order: Order,
    cars: Array<Car>,
    withdrawTimeRange: Array<string>,

    car: Maybe<Car>,
    dateDay: Maybe<Date>,
    dateTimeRange: Maybe<number>,
    locationGPS: string,
    locationDetail: string,
    invoiceHead: string,
    invoiceNumber: string,

    img1: string,
    img2: string,
    img3: string,

    img1File: any,
    img2File: any,
    img3File: any
}

type Index = number;

type ImageType = "行驶证正本" | "行驶证副本" | "车辆登记证"

type Msg 
    = ["GotoMyCars"] 
    | ["SelectCar", Maybe<Car>]
    | ["TimePickDate", Date]
    | ["TimePickTime", Maybe<number>]
    | ["GPSLocation"]
    | ["ReadImage", ImageType]
    | ["LocationDetailOnChange", string]
    | ["InvoiceHeadOnChange", string]
    | ["InvoidceNumberOnChange", string]
    | ["CreateOrder"]


const ForkData: Array<Car> = 
    [ {id: 1, accountId: 1, license: "粤SD7777", vin: "2314"}
    , {id: 2, accountId: 1, license: "粤SD8888", vin: "2314"}
    , {id: 3, accountId: 1, license: "粤SD9999", vin: "2314"}
    , {id: 4, accountId: 1, license: "粤SD6666", vin: "2314"}
    ]

const TimeRange = [
    {value: 1, label: "08:30-09:30"},
    {value: 2, label: "09:30-10:30"},
    {value: 3, label: "10:30-11:30"},
    {value: 4, label: "14:00-15:00"},
    {value: 5, label: "15:00-16:00"},
    {value: 6, label: "16:00-17:00"}
]

export default class CreateOrder extends BaseComponent<Props, State, Msg> {
    input1: HTMLInputElement | null = null;
    input2: HTMLInputElement | null = null;
    input3: HTMLInputElement | null = null;

    constructor (props: Props) {
        super(props);
        this.state = {
            order: {createTime: 12, carId: "", process: "WAIT_FOR_PAYMENT"},
            cars: [],
            withdrawTimeRange: [],
            dateDay: Maybe.Nothing(),
            dateTimeRange: Maybe.Nothing(),
            car: Maybe.Nothing(),
            locationGPS: "",
            locationDetail: "",
            invoiceHead: "",
            invoiceNumber: "",
            img1: '',
            img2: '',
            img3: '',
            img1File: "",
            img2File: "",
            img3File: ""
        }
    }

    async eval(msg: Msg) {
        switch(msg[0]) {
            case "GotoMyCars": {
                this.goto(["MyCars"]);
                break;
            }
            case "SelectCar": {
                if (msg[1].valid) {
                    window.localStorage.setItem(OrderKey.car, JSON.stringify(msg[1].val));
                }
                this.set({car: msg[1]})
                break;
            }
            case "TimePickDate": {
                window.localStorage.setItem(OrderKey.dateDay, msg[1].getTime().toString());
                this.set({dateDay: Maybe.Just(msg[1])});
                break;
            }
            case "TimePickTime": {
                if (msg[1].valid) {
                    window.localStorage.setItem(OrderKey.dateTimeRange, msg[1].val.toString());
                }
                this.set({dateTimeRange: msg[1]});
                break;
            }
            case "GPSLocation": {
                this.goto(["GPSPage"]);
                break;
            }
            case "LocationDetailOnChange": {
                window.localStorage.setItem(OrderKey.locationDetail, msg[1]);
                this.set({locationDetail: msg[1]});
                break;
            }
            case "InvoiceHeadOnChange": {
                window.localStorage.setItem(OrderKey.invoiceHead, msg[1]);
                this.set({invoiceHead: msg[1]});
                break;
            }
            case "InvoidceNumberOnChange": {
                window.localStorage.setItem(OrderKey.invoiceNumber, msg[1]);
                this.set({invoiceNumber: msg[1]});
                break;
            }
            case "ReadImage": {
                switch (msg[1]) {
                    case "行驶证正本": {
                        let input = this.input1;
                        if (input && input.files && input.files[0]) {
                            let reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.set({img1: e.target.result})
                            }
                            this.setState({img1File: input.files[0]})
                            reader.readAsDataURL(input.files[0]);
                        }
                        break;
                    }
                    case "行驶证副本": {
                        let input = this.input2;
                        if (input && input.files && input.files[0]) {
                            let reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.set({img2: e.target.result})
                            }
                            this.setState({img2File: input.files[0]})
                            reader.readAsDataURL(input.files[0]);
                        }
                        break;
                    }
                    case "车辆登记证": {
                        let input = this.input3;
                        if (input && input.files && input.files[0]) {
                            let reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.set({img3: e.target.result})
                            }
                            this.setState({img3File: input.files[0]})
                            reader.readAsDataURL(input.files[0]);
                        }
                        break;
                    }
                }
                
                break;
            }
            case "CreateOrder": {
                if (this.state.dateDay.valid 
                    && this.state.car.valid
                    && this.state.dateTimeRange.valid) {
                    let day = displayTime("yyyy/mm/dd", this.state.dateDay.val.getTime());
                    let [from, end] = TimeRange[this.state.dateTimeRange.val - 1].label.split('-');
                    let [file1, file2, file3] = await compress([
                        this.state.img1File,
                        this.state.img2File,
                        this.state.img3File
                    ]);
                    let result = await sendRequest(["CreateOrder", {
                        carId: this.state.car.val.id,
                        startDate: day + " " + from,
                        endDate: day + " " + end,
                        appointmentLocation: this.state.locationGPS + "\n" + this.state.locationDetail, 
                        invoiceHead: this.state.invoiceHead, 
                        invoiceNumber: this.state.invoiceNumber,
                        openid: '111',
                        licensePicA: file1,
                        licensePicB: file2, 
                        registrationPic: file3
                    }]);
                    console.log(result);
                    if (result.valid) {
                        showMessage(["Success", "订单创建成功"]);
                        let resultPay = await sendRequest(["PayForOrder"]);
                        if (resultPay.valid) {
                            showMessage(["Success", "订单支付成功"]);
                            this.goto(["MyOrders"]);
                        }
                    }
                }
                break;
            }
        }
    }

    render() {
        return (
            <div className="w-100">
                <div className="w-100 d-flex flex-column">
                    <div
                        style={{ position: 'fixed', width: '100%', top: 0, zIndex: 99 }}
                        className="flex-container"
                    >
                        <NavBar
                            mode="light"
                        ><b>创建年审订单</b></NavBar>
                    </div>
                    <List className="mylist" style={{ backgroundColor: 'white', marginTop: "50px"}}>
                        <Item onClick={this.on(["GotoMyCars"])} thumb={<i className="icon_tianjiacheliang"></i>} arrow="horizontal">我的车辆</Item>
                        <Picker 
                            onChange={this.onE(e => ["SelectCar", new Maybe<Car>(R.find(x => !!e && x.id == e[0], this.state.cars))])} 
                            value={this.state.car.map(x => R.of(x.id)).getOrElse([])} 
                            data={this.state.cars.map(x => ({value: x.id, label: x.license}))} 
                            cols={1} 
                            className="forss">
                            <Item thumb={<i className="icon_cheliangxuanze"></i>} arrow="horizontal">车辆选择</Item>
                        </Picker>
                        
                        <DatePicker
                            mode="date"
                            title="预约日期"
                            extra="请选择"
                            value={this.state.dateDay.valid ? this.state.dateDay.val : undefined}
                            onChange={this.onE(d => ["TimePickDate", d])}
                        >
                            <Item thumb={<i className="icon_ticheqidian"></i>} extra={this.state.dateDay}  arrow="horizontal">预约日期</Item>
                        </DatePicker>
                        <Picker data={TimeRange}  onChange={this.onE(e => ["TimePickTime", new Maybe<any>(!!e && e[0])])} value={this.state.dateTimeRange.map(x => R.of(x)).getOrElse([])} cols={1}>
                            <Item thumb={<i className="icon_tichezhongdian"></i>} arrow="horizontal">预约时段</Item>
                        </Picker>

                        <Item 
                            onClick={this.on(["GPSLocation"])}
                            arrow="horizontal"
                            multipleLine 
                            align="top"
                            wrap
                        ><i className='icon_yuyuedidian' style={{marginRight: "15px"}}></i>提车地址定位<div style={{fontSize: "15px", color: "#888", marginLeft: "37px"}}>{this.state.locationGPS}</div></Item>
                        <InputItem onChange={this.onE(e => ["LocationDetailOnChange", e])} type="text" value={this.state.locationDetail} defaultValue="" placeholder="详细地址" style={{textAlign: "right"}}>详细地址</InputItem>
                        <InputItem onChange={this.onE(e => ["InvoiceHeadOnChange", e])} type="text" value={this.state.invoiceHead} defaultValue="" placeholder="请输入发票开头" style={{textAlign: "right"}}>发票抬头</InputItem>
                        <InputItem onChange={this.onE(e => ["InvoidceNumberOnChange", e])} type="text" value={this.state.invoiceNumber} defaultValue="" placeholder="请输入发票税号" style={{textAlign: "right"}}>发票税号</InputItem>
                    </List>

                    <div className="mt-2 mx-auto" style={{
                        width: "98%",
                        height: "2px",
                        backgroundImage: "linear-gradient(to right, #878787 0%, #878787 50%, transparent 50%)",
                        backgroundSize: "20px 2px",
                        backgroundRepeat: "repeat-x"
                    }}/>

                    <div className="w-100 mx-0 d-flex mt-3">
                        <div className="d-flex col-4 flex-column p-1" style={{textAlign: "center", color: "#909090"}}>
                            行驶证正本
                            {/* <img src={this.state.img1 == "" ? bt_zhaoxiang : this.state.img1} onClick={() => this.input1 && this.input1.click()} className="mt-2 mx-auto" style={{width:"100%"}}/> */}
                            <div className="w-100 mt-1 mx-auto" onClick={() => this.input1 && this.input1.click()} style={{
                                height: "33vw",
                                backgroundPosition: "center center",
                                backgroundImage: "url(" + (this.state.img1 == "" ? bt_zhaoxiang : this.state.img1) + ")",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}>
                            </div>
                            <input id="input1" ref={value => this.input1 = value} onChange={this.on(["ReadImage", "行驶证正本"])} type="file" accept="image/*" style={{display: "none", margin: "0 auto"}} />
                        </div>
                        <div className="d-flex col-4 flex-column p-1" style={{textAlign: "center", color: "#909090"}}>
                            行驶证副本
                            <div className="w-100 mt-1 mx-auto" onClick={() => this.input2 && this.input2.click()} style={{
                                height: "33vw",
                                backgroundPosition: "center center",
                                backgroundImage: "url(" + (this.state.img2 == "" ? bt_zhaoxiang : this.state.img2) + ")",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}></div>
                            {/* <img src={this.state.img2 == "" ? bt_zhaoxiang : this.state.img2} onClick={() => this.input2 && this.input2.click()} className="mt-2 mx-auto" style={{width:"100%"}}/> */}
                            <input id="input2" ref={value => this.input2 = value} onChange={this.on(["ReadImage", "行驶证副本"]) } type="file" accept="image/*" style={{display: "none", margin: "0 auto"}} />
                        </div>
                        <div className="d-flex col-4 flex-column p-1" style={{textAlign: "center", color: "#909090"}}>
                            车辆登记证
                            <div className="w-100 mt-1 mx-auto" onClick={() => this.input3 && this.input3.click()} style={{
                                height: "33vw",
                                backgroundPosition: "center center",
                                backgroundImage: "url(" + (this.state.img3 == "" ? bt_zhaoxiang : this.state.img3) + ")",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}></div>
                            {/* <img src={this.state.img3 == "" ? bt_zhaoxiang : this.state.img3} onClick={() => this.input3 && this.input3.click()} className="mt-2 mx-auto" style={{width:"100%"}}/> */}
                            <input id="input3" ref={value => this.input3 = value} onChange={this.on(["ReadImage", "车辆登记证"])} type="file" accept="image/*" style={{display: "none", margin: "0 auto"}} />
                        </div>
                    </div>

                    <div className="w-100 px-2 mt-3">
                        <button  onClick={this.on(["CreateOrder"])} type="button" className="btn btn-primary w-100 text-white" style={{fontSize: "21px"}}>提交订单</button>
                    </div>
                    
                    <MenuSpaceDiv/>

                </div>
            </div>
        )
    }

    async componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
            return;
        }
        let mcars = await sendRequest<Array<Car>>(["RetrieveAllCar"]);
        let cars = mcars.getOrElse([]);
        console.log(cars);
        
        let func = (key: string) => window.localStorage.getItem(key);
        let carStr = func(OrderKey.car);
        let datedayStr = func(OrderKey.dateDay);
        let dateTimeRange = func(OrderKey.dateTimeRange);
        let locationGPS = func(OrderKey.locationGPS);
        let locationDetail = func(OrderKey.locationDetail);
        let invoiceHead = func(OrderKey.invoiceHead);
        let invoiceNumber = func(OrderKey.invoiceNumber);


        console.log(locationGPS);
        this.set({
            cars: cars,
            car: carStr ? Maybe.Just(JSON.parse(carStr)) : Maybe.Nothing(),
            dateDay: datedayStr ? Maybe.Just(new Date(parseInt(datedayStr))) : Maybe.Nothing(),
            dateTimeRange: new Maybe(dateTimeRange).map(x => parseInt(x)),
            locationGPS: ifNullThen<string>(locationGPS, ""),
            locationDetail: ifNullThen<string>(locationDetail, ""),
            invoiceHead: ifNullThen<string>(invoiceHead, ""),
            invoiceNumber: ifNullThen<string>(invoiceNumber, "")
        })
    }
}