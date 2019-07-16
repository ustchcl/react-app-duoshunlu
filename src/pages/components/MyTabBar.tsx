import { TabBar } from 'antd-mobile';
import React from "react"
import BaseComponent from '../../basic/BaseComponent';
import { Empty, msg, MsgUnit, unitMsg, Msg, unit, Tuple1, Tuple2 } from '../../types/Type';

type Props = {
    style: React.CSSProperties
}

type State = {
    selectedTab: SelectedTab,
    hidden: boolean,
    fullScreen: boolean
}

type Message 
    = Tuple1<"SwitchHidden">
    | Tuple1<"SwitchFullScreen">
    | Tuple2<"SelectTab", SelectedTab>
    
type SelectedTab = "tab1" | "tab2" | "tab3" | "tab4"

export class MyTabBar extends BaseComponent<Props, State, Message> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTab: "tab1",
      hidden: false,
      fullScreen: false,
    };
  }

  eval (msg: Message) {
    switch (msg[0]) {
        case "SelectTab": {
            this.setState({selectedTab: msg[1]});
            break;
        }
        case "SwitchFullScreen": {
            this.setState({fullScreen: !this.state.fullScreen});
            break;
        }
        case "SwitchHidden": {
            this.setState({hidden: !this.state.hidden});
            break;
        }
    }
  }

  renderContent(pageText: string) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={this.onE((e) => {
            return ["SwitchHidden"]
          })}
        >
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={this.onE((e) => {
            return ["SwitchFullScreen"];
          })}
        >
          Click to switch fullscreen
        </a>
      </div>
    );
  }

  render() {
    return (
      <div style={this.props.style}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="Life"
            key="Life"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selected={this.state.selectedTab === 'tab1'}
            badge={1}
            onPress={this.on(["SelectTab", "tab1"])}
            data-seed="logId"
          >
            {this.renderContent('Life')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="Koubei"
            key="Koubei"
            badge={'new'}
            selected={this.state.selectedTab === 'tab2'}
            onPress={this.on(["SelectTab", "tab2"])}
            data-seed="logId1"
          >
            {this.renderContent('Koubei')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="Friend"
            key="Friend"
            dot
            selected={this.state.selectedTab === 'tab3'}
            onPress={this.on(["SelectTab", "tab3"])}
          >
            {this.renderContent('Friend')}
          </TabBar.Item>
          <TabBar.Item
            icon={{ uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg' }}
            selectedIcon={{ uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg' }}
            title="My"
            key="my"
            selected={this.state.selectedTab === 'tab4'}
            onPress={this.on(["SelectTab", "tab4"])}
          >
            {this.renderContent('My')}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}