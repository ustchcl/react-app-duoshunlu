/* tslint: disable */

import React from "react";
import BaseComponent from "../../basic/BaseComponent";
import { NavBar, Icon, WhiteSpace } from "antd-mobile"
import { Order, showOrderProcess } from "../../capability/Resources";
import { displayTime, showMessage } from "../../basic/BaseFunctions";
import { MenuSpaceDiv } from "../utils/Utils";
import * as R from "ramda"
import { OrderKey } from "../../basic/Contants";

type Props = {}

type State = {
    position: any;
    address: string;
}

type Msg = ["Back"]


export default class GpsPage extends BaseComponent<Props, State, Msg> {
    mapContainer: HTMLDivElement | null = null;

    constructor (props: Props) {
        super(props);
        this.state = {
            position: {},
            address: "定位中"
        }
    }

    eval(msg: Msg) {
        switch (msg[0]) {
            case "Back" : {
                this.goBack();
                break;
            }
        }
    }

    render() {
        return (
            <div className="w-100 d-flex flex-column">
                <div
                    style={{ position: 'fixed', width: '100%', top: 0, zIndex: 99 }}
                    className="flex-container d-flex flex-column"
                >
                    <NavBar
                        mode="light"
                        icon = {<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    ><b>地址选择</b></NavBar>
                </div>

                <div className="card w-50 ml-auto" style={{marginTop: "45px", zIndex: 89}}>
                    <div className="card-body">
                        <h6 className="card-subtitle text-muted">地址</h6>
                        <p className="card-text">{this.state.address}</p>
                    </div>

                </div>


                <div id="mapContainer" ref={value => this.mapContainer = value} style={{position: "fixed", width: "100%", height: "100%"}}>
                </div>
                
                <MenuSpaceDiv/>
            </div>
        )
    }

    componentDidMount() {
        let _this = this;
        let position = [116.39,39.9];
        let key: any = "AMap";
        let AMap: any = window[key];
        if (!AMap) {
            return;
        }
        let map = new AMap.Map("mapContainer", {
            resizeEnable: true
        });

        AMap.plugin('AMap.Geolocation', () => {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition((status : any, result : any) => {
                if(status=='complete'){
                    position = result.position;
                    regeoCode();
                }
            });
        });
    
        let geocoder: any = null;
        let marker: any = null;
        function regeoCode() {
            if(!geocoder){
                geocoder = new AMap.Geocoder();
            }
            console.log("regeoCode", position)
            var lnglat  = position; //.split(',');
            if(!marker){
                marker = new AMap.Marker();
                map.add(marker);
            }
            marker.setPosition(lnglat);
            
            geocoder.getAddress(lnglat, function(status: any, result: any) {
                if (status === 'complete'&&result.regeocode) {
                    var address = result.regeocode.formattedAddress;
                    window.localStorage.setItem(OrderKey.locationGPS, address);
                    _this.set({address: address});
                }else{
                    showMessage(["Fail", '获取地址失败'])
                }
            });
        }
        
        map.on('click',(e: any) => {
            position = e.lnglat;
            regeoCode();
        })
    }

}