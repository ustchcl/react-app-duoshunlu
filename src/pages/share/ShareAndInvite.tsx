import React from "react";
import { NavBar } from "antd-mobile";
import share from "../../assets/images/share.jpg"
import { MenuSpaceDiv } from "../utils/Utils";

export default function ShareAndInvite() {
  return (
      <div className="w-100"> 
        <div
        style={{ position: "fixed", zIndex: 99, width: "100%", top: 0 }}
        className="flex-container"
        >
        <NavBar mode="light"><b>邀请好友</b></NavBar>
        </div>
        <img src={share} className="w-100" style={{marginTop: "50px"}}/>
        <MenuSpaceDiv/>
    </div>
  );
}
 