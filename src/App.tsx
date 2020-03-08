import React from 'react';
// import { Button }  from "antd-mobile"
// import { PersonalCenter } from './pages/PersonalCenter';
// import { Counter } from './pages/components/Counter';
// import { HelloMessage } from './examples/1/HelloTaylor';
// import { Timer } from './examples/2/StateComponent';
// import { TodoApp } from './examples/3/TODO';
// import Main from './pages/Main';
// import { Register } from './pages/Register';
// import ShareAndInvite from './pages/ShareAndInvite';
// import PersonalCenterAd from './pages/PersonalCenterAd';
// import Orders from './pages/order/OrderInfo';
// import MyOrders from './pages/order/MyOrders';
// import MyCars from './pages/car/MyCars';
// import CarInfo from './pages/car/CarInfo';
// import WaitingForAcceptOrders from './pages/order/WaitingForAcceptOrders';
import CreateOrder from './pages/order/CreateOrder';
import CarOperation from './pages/car/CarOperation';
import Login from './pages/login/Login';
import { ResetPassword } from './pages/login/ResetPassword';
import { AppRoute } from './pages/Router';
import {HashRouter} from "react-router-dom";
import MyTabBar from './pages/components/MyTabBar';
import { initEnv } from './basic/GlobalEnv';
import { wait } from './basic/BaseFunctions';

// const App: React.FC = () => {

//     return (
//             <div>
//                 {/* <PersonalCenter>S?tart</PersonalCenter> */}
//                 {/* <Counter></Counter> */}
//                 {/* <HelloMessage name="Talor"/> */}
//                 {/* <Timer/> */}
//                 {/* <ShareAndInvite/> */}
//                 {/* <Register /> */}
//                 {/* <PersonalCenterAd/> */}
//                 {/* <PersonalCenterSalesman/> */}
//                 {/* <Login/> */}
//                 {/* <ResetPassword/> */}
//                 <AppRoute/>
//                 {/* <CarOperation opType="Return"/> */}
//             </div>
//     )
// }


type State = {
    init: boolean
}
class App extends React.Component<{}, State> {
    constructor (props: any) {
        super(props);
        this.state = {
            init: false
        }
    }

    render() {
        return this.state.init ? (<div><AppRoute/></div>) : (<div></div>)
    }

    // 初始化
    async componentDidMount() {
        console.log("App")
        await initEnv();
        this.setState({init: true});
    }
}

export default App;
