import { TabBar } from "antd-mobile";
import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import {
  Empty,
  msg,
  MsgUnit,
  unitMsg,
  Msg,
  unit,
  Tuple1,
  Tuple2
} from "../../types/Type";
import * as R from "ramda";
import { DslRoute, routeToMenuTab } from "../Router";
import { route } from "../../basic/GlobalEnv";
import { TabKey } from "../../basic/Contants";
import { ifNullThen } from "../../basic/BaseFunctions";

type Props = any;
type State = {
  selectedTab: MenuTab;
};

type Message =
  | Tuple1<"SwitchHidden">
  | Tuple1<"SwitchFullScreen">
  | Tuple2<"SelectTab", MenuTab>;

export type MenuTab =
  | "首页"
  | "我要年审"
  | "我的订单"
  | "邀请好友"
  | "个人中心";

const IconSrc = {
  首页: ["icon_shouye", "icon_shouye2"],
  我要年审: ["icon_woyaonianshen1", "icon_woyaonianshen2"],
  我的订单: ["icon_wodedingdan1", "icon_wodedingdan2"],
  邀请好友: ["icon_yaoqinghaoyou1", "icon_yaoqinghaoyou2"],
  个人中心: ["icon_gerenzhongxin1", "icon_gerenzhongxin2"]
};

export default class MyTabBar extends BaseComponent<Props, State, Message> {
  constructor(props: Props) {
    super(props);

    let tab: any = window.localStorage.getItem(TabKey);
    this.state = {
      selectedTab: ifNullThen<MenuTab>(tab, "首页"),
    };
  }

  componentDidMount() {
    this.subs = [
        route.subscribe({ next: route => this.onChangeRoute(route) })
    ];
  }

  eval(msg: Message) {
    console.log(this.props);
    switch (msg[0]) {
      case "SelectTab": {
        // this.setState({selectedTab: msg[1]});
        this.goto(this.tabToLink(msg[1]));
        break;
      }
    }
  }

  renderContent(tab: MenuTab) {
    return <div />;
  }

  render() {
    return (
      <div
        style={{ height: "75px", width: "100%", position: "fixed", bottom: 0, zIndex: 998 }}
      >
        <TabBar
          unselectedTintColor="#afaaaa"
          tintColor="#e69b2e"
          barTintColor="white"
          tabBarPosition="bottom"
          hidden={false}
          noRenderContent={true}
        >
          {this.renderItem("首页")}
          {this.renderItem("我要年审")}
          {this.renderItem("我的订单")}
          {this.renderItem("邀请好友")}
          {this.renderItem("个人中心")}
        </TabBar>
      </div>
    );
  }

  renderItem(tab: MenuTab) {
    return (
      <TabBar.Item
        title={tab}
        key={tab}
        icon={<i className={IconSrc[tab][0]} />}
        selectedIcon={<i className={IconSrc[tab][1]} />}
        selected={this.state.selectedTab === tab}
        onPress={this.on(["SelectTab", tab])}
        data-seed={tab}
      >
        {this.renderContent(tab)}
      </TabBar.Item>
    );
  }

  tabToLink(tab: MenuTab): DslRoute {
    switch (tab) {
      case "个人中心":
        return ["PersonalCenterUser"];
      case "我的订单":
        return ["MyOrders"];
      case "我要年审":
        return ["CreateOrder"];
      case "邀请好友":
        return ["Share"];
      case "首页":
        return ["Main"];
    }
  }

  onChangeRoute(route: DslRoute) {
      if (["MyCars", "CarInfo", "CreateCar"].indexOf(route[0]) != -1) {
          return;
      }
      let mmt = routeToMenuTab(route);
      if (mmt.valid) {
          window.localStorage.setItem(TabKey, mmt.val);
          this.set({selectedTab: mmt.val});
      }
  }
}
