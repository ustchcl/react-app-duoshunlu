import React from "react"
import { BrowserRouter as Router, HashRouter, Route, Switch } from "react-router-dom"
import Main from "./Main";
import PersonalCenterAd from "./personalCenter/PersonalCenterAd";
import MyOrders from "./order/MyOrders";
import CreateOrder from "./order/CreateOrder";
import WaitingForAcceptOrders from "./order/WaitingForAcceptOrders";
import OrderInfo from "./order/OrderInfo";
import PersonalCenterSalesman from "./personalCenter/PersonalCenterSalesman";
import PersonalCenterUser from "./personalCenter/PersonalCenterUser";
import CarInfo from "./car/CarInfo";
import MyCars from "./car/MyCars";
import CarOperation, { OpType } from "./car/CarOperation";
import Login from "./login/Login";
import { Register } from "./login/Register";
import { ResetPassword } from "./login/ResetPassword";
import ShareAndInvite from "./share/ShareAndInvite";
import MyTabBar, { MenuTab } from "./components/MyTabBar";
import { Maybe } from "../basic/Maybe";
import CreateCar from "./car/CreateCar";
import GpsPage from "./order/GpsPage";
import { InspectOrder, Car } from "../api/Capability";
import { env } from "../basic/GlobalEnv";

type OrderId = number;
type CarId = number;

export type DslRoute
    = ["Main"]
    | ["SalesmanMain"]
    | ["MyOrders"]
    | ["CreateOrder"]
    | ["WaitingForAcceptOrders"]
    | ["OrderInfo", number]
    | ["PersonalCenterSalesman"]
    | ["PersonalCenterUser"]
    | ["CarInfo", Car]
    | ["CreateCar"]
    | ["MyCars"]
    | ["CarOperation", number]
    | ["Login"]
    | ["Register"]
    | ["ResetPassword"]
    | ["Share"]
    | ["SalesmanOrderInfo", number]
    | ["GPSPage"]

export function routeCodec(route: DslRoute): string {
    switch (route[0]) {
        case "Main": return "/";
        case "SalesmanMain": return "/salesman";
        case "MyOrders": return "/order/list";
        case "CreateOrder": return "/order/create";
        case "WaitingForAcceptOrders": return "/order/unhandledList";
        case "OrderInfo": return "/order/info/" + route[1];
        case "SalesmanOrderInfo": return "/order/salesman/" + route[1];
        case "PersonalCenterSalesman": return "/userinfo/salesman";
        case "PersonalCenterUser": return "/userinfo/normal";
        case "CarInfo": return "/car/info/" + JSON.stringify(route[1]);
        case "CreateCar": return "/car/create";
        case "MyCars": return "/car/list";
        case "CarOperation": return "/car/operation/" + [route[1]];
        case "Login": return "/login";
        case "Register": return "/register";
        case "ResetPassword": return "/resetpassword";
        case "Share": return "/share";
        case "GPSPage": return "/gps_location";
    }
}

export function routeToMenuTab(route: DslRoute): Maybe<MenuTab> {
    switch (route[0]) {
        case "Main": return Maybe.Just("首页");
        case "SalesmanMain": return Maybe.Nothing();
        case "MyOrders": return Maybe.Just("我的订单");
        case "CreateOrder": return Maybe.Just("我要年审");
        case "WaitingForAcceptOrders": return Maybe.Nothing();
        case "OrderInfo": return (env.currentAccount.map(x => x.role == "SALES").getOrElse(false)) ? Maybe.Nothing() : Maybe.Just("我的订单");
        case "SalesmanOrderInfo": return Maybe.Nothing();
        case "PersonalCenterSalesman": return Maybe.Nothing();
        case "PersonalCenterUser": return Maybe.Just("个人中心");
        case "CarInfo": return Maybe.Just("个人中心");
        case "CreateCar": return Maybe.Just("个人中心");
        case "MyCars": return Maybe.Just("个人中心");
        case "CarOperation": return Maybe.Nothing();
        case "Login": return Maybe.Nothing();
        case "Register": return Maybe.Nothing();
        case "ResetPassword": return Maybe.Nothing();
        case "Share": return Maybe.Just("邀请好友");
        case "GPSPage": return Maybe.Just("我要年审");
    }
}

export function redirect(route: DslRoute, thisObj: any) {
    thisObj.props.history.push(routeCodec(route));
}


export const AppRoute = () => (
    <HashRouter>
        <Route exact path="/" component={Main}/>
       
        
        <Route path="/order/list" component={MyOrders}/>
        <Route path="/order/create" component={CreateOrder}/>
        <Route path="/gps_location" component={GpsPage}/>
        
        <Route path="/order/info/:orderId" component={OrderInfo}/>
        <Route path="/userinfo/normal" component={PersonalCenterUser}/>
        <Route path="/car/info/:car" component={CarInfo}/>
        <Route path="/car/create" component={CreateCar}/>
        <Route path="/car/list" component={MyCars}/>
        
        <Switch>
            <Route path="/resetpassword" component={ResetPassword}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/salesman" component={PersonalCenterSalesman}/>
            <Route path="/userinfo/salesman" component={PersonalCenterAd}/>
            <Route path="/car/operation/:orderId" component={CarOperation}/>
            <Route path="/order/salesman/:orderId" component={OrderInfo}/>
            <Route path="/order/unhandledList" component={WaitingForAcceptOrders}/>
            <Route component={MyTabBar}/>
        </Switch>
        
        <Route path="/share" component={ShareAndInvite}/>
        
    </HashRouter>
)