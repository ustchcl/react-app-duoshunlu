import React from "react"
import { NavBar, Icon } from "antd-mobile"
import BaseComponent from "../../basic/BaseComponent";
import * as R from "ramda"
import paizhaoshangchuan from "../../assets/images/bt_paizhaoshangchuan.png"
import { file } from "@babel/types";
import { showMessage, compress } from "../../basic/BaseFunctions";
import { sendRequest, Endpoint } from "../../api/EndPoint";
import { env, getCache } from "../../basic/GlobalEnv";
import { InspectOrder } from "../../api/Capability";

export type OpType = "Withdraw" | "Return"

// type Props = {
//     opType: OpType
// };

type Props = any;

type ImgData = {file: any, data: string, id: string}

type State = {
    imgs: Array<ImgData>,
    opType: OpType,
    order: InspectOrder,
}

type Msg = ["AddImage"] | ["Remove", number] | ["Back"] | ["Upload"]

export default class CarOperation extends BaseComponent<Props, State, Msg> {
    input: HTMLInputElement | null = null;

    constructor(props: Props) {
        super(props);
    }

    async eval (msg: Msg) {
        switch (msg[0]) {
            case "AddImage": {
                if (this.state.imgs.length >= 10) {
                    showMessage(["TextOnly", "最多为10张图片!"]);
                    break;
                }
                if (this.input && this.input.files && this.input.files[0]) {
                    let reader = new FileReader();
                    let file = this.input.files[0]
                    reader.onload = (e: any) => {
                        this.update({imgs: R.append({file: file, data: e.target.result, id: Math.random().toString()})})
                    }
                    reader.readAsDataURL(file);
                }
                break;
            }
            case "Remove": {
                this.update({imgs: R.remove(msg[1], 1)});
                break;
            }
            case "Back": {
                this.goBack();
                break;
            }
            case "Upload": {
                let files = this.state.imgs.map(x => x.file);
                if (files.length == 0) {
                    showMessage(["Fail", "至少上传一张图片"]);
                    break;
                }
                let compressdFiles = await compress(files);
                let endpoint: Endpoint = ["Withdraw", {orderId: this.state.order.id.toString(), files: files}];
                if (this.state.opType == "Return") {
                    endpoint = ["ReturnCar", {orderId: this.state.order.id.toString(), files: compressdFiles}];
                }
                let result = await sendRequest(endpoint);
                if (result.valid) {
                    showMessage(["Success", "图片上传成功"]);
                    this.goBack();
                }
                break;
            }
        }
    }

    render() {
        return this.state ? (
            <div className="w-100">
                <div
                    style={{ position: 'fixed', width: '100%', top: 0 }}
                    className="flex-container"
                >
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"></Icon>}
                        onLeftClick={this.on(["Back"])}
                    ><b>{this.state.opType === "Withdraw" ? "提审车辆" : "归还车辆"}</b></NavBar>
                </div>
                <div className="w-100 d-flex mt-5 flex-column">
                    {R.zipWith((x, n): [ImgData, number] => [x,n], this.state.imgs, R.range(0, this.state.imgs.length)).map(this.renderImage.bind(this))}
                    <div className="w-100 mt-1">
                        <img src={paizhaoshangchuan} onClick={() => this.input && this.input.click()} className="mx-auto" style={{width:"100%"}}/>
                        <input ref={value => this.input = value} onChange={this.on(["AddImage"])} type="file" accept="image/*" style={{display: "none", margin: "0 auto"}} />
                    </div>
                </div>
                <div className="w-100 px-2 mt-3">
                    <button onClick={this.on(["Upload"])} type="button" className="btn btn-warning w-100 text-white" style={{fontSize: "21px"}}>{this.state.opType === "Withdraw" ? "确定提取" : "确定归还"}</button>
                </div>
            </div>
        ) : (<></>)
    }

    renderImage(data: [ImgData, number]) {
        return (
            <div key={`img-${data[1]}`} className="w-100 mt-1" style={{
                width: "100%",
                height: "38vw",
                backgroundPosition: "center center",
                backgroundImage: "url(" + data[0].data + ")",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}>
                <div onClick={this.on(["Remove", data[1]])} className="round-button mt-1 mr-1 ml-auto" style={{fontSize: "18px"}}><i className="far fa-trash-alt"></i></div>
            </div>
        )
    }

    componentDidMount() {
        if (!env.currentAccount.valid) {
            this.goto(["Login"]);
        } else if (env.currentAccount.val.role == "CUSTOMER") {
            this.goto(["Main"]);
        } else {
            if (R.path(['match', 'params', 'orderId'], this.props)) {
                let orderId = this.props.match.params.orderId;
                let cache = getCache(`order_${orderId}`) as InspectOrder;
                if (cache) {
                    this.set({
                        order: cache,
                        opType: cache.process == "WAIT_FOR_WITHDRAW"? "Withdraw" : "Return",
                        imgs: []
                    });
                } else {
                    this.goBack();
                }
            }
        }
    }
}