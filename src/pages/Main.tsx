import BaseComponent from "../basic/BaseComponent";
import { Carousel, Grid, WhiteSpace } from "antd-mobile";
import React from "react";
import img001 from "../assets/images/001.jpg";
import img002 from "../assets/images/002.jpg";
import img003 from "../assets/images/003.jpg";
import img004 from "../assets/images/004.jpg";
import { MenuSpaceDiv } from "./utils/Utils";
import { env } from "../basic/GlobalEnv";
import is from "ramda/es/is";

type Props = any;
type State = {
  data: Array<string>;
  imgHeight: number | string;
};
type Msg = ["我要年审"] | ["我的订单"] | ["邀请好友"] | ["个人中心"];

export default class Main extends BaseComponent<Props, State, Msg> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [img001, img002, img003, img004],
      imgHeight: 176
    };
  }

  eval(msg: Msg) {
    switch (msg[0]) {
      case "我要年审": {
        this.goto(["CreateOrder"]);
        break;
      }
      case "我的订单": {
        this.goto(["MyOrders"]);
        break;
      }
      case "个人中心": {
        this.goto(["PersonalCenterUser"]);
        break;
      }
      case "邀请好友": {
        this.goto(["Share"]);
        break;
      }
    }
  }

  render() {
    return (
      <div>
        <Carousel
          autoplay={true}
          infinite
          //   beforeChange={(from, to) =>
          //     console.log(`slide from ${from} to ${to}`)
          //   }
          //   afterChange={index => console.log("slide to", index)}
        >
          {this.state.data.map((val, index) => (
            <a
              key={index}
              style={{
                display: "inline-block",
                width: "100%",
                height: this.state.imgHeight
              }}
            >
              <img
                src={val}
                alt=""
                style={{ width: "100%", verticalAlign: "top" }}
                onLoad={() => {
                  window.dispatchEvent(new Event("resize"));
                  this.setState({ imgHeight: "auto" });
                }}
              />
            </a>
          ))}
        </Carousel>
        {/* <div style={{border: "0px", background:"rgba(255,255,255,1)", borderRadius: "15px", width:"100px", height: "100px"}}>

        </div> */}
        <div className="w-100 d-flex flex-column mt-2">
          <div className="w-100 d-flex ">
            <div
              className="main-button btn d-flex"
              style={{
                marginLeft: 0.02 * window.innerWidth,
                marginRight: 0.02 * window.innerWidth
              }}
              onClick={this.on(["我要年审"])}
            >
              {this.renderMainBtn("icon_woyaonianshen", "我要年审")}
            </div>
            <div
              className="main-button btn d-flex"
              onClick={this.on(["我的订单"])}
            >
              {this.renderMainBtn("icon_wodedingdan", "我的订单")}
            </div>
          </div>
          <WhiteSpace />
          <div className="w-100 d-flex">
            <div
              className="main-button btn d-flex"
              style={{
                marginLeft: 0.02 * window.innerWidth,
                marginRight: 0.02 * window.innerWidth
              }}
              onClick={this.on(["邀请好友"])}
            >
              {this.renderMainBtn("icon_yaoqinghaoyou", "邀请好友")}
            </div>
            <div
              className="main-button btn d-flex"
              onClick={this.on(["个人中心"])}
            >
              {this.renderMainBtn("icon_gerenzhongxin", "个人中心")}
            </div>
          </div>
        </div>
        <MenuSpaceDiv />
      </div>
    );
  }

  renderMainBtn(iconSrc: string, title: string) {
    return (
      <div className="m-auto d-flex  flex-column">
        <div
          className={`mx-auto ${iconSrc}`}
          style={{
            width: 0.25 * window.innerWidth,
            height: 0.25 * window.innerWidth
          }}
        />
        <div className="mx-auto" style={{ fontSize: "18px" }}>
          {title}
        </div>
      </div>
    );
  }

  componentDidMount() {
      console.log("Main")
    if (!env.currentAccount.valid) {
        this.goto(["Login"]);
    }
  }
}
