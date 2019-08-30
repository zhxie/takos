import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon } from 'antd';
import logo from './logo.svg';
import logo_grayscale from './logo-grayscale.svg';
import './App.css';
import { Mode } from './class/Mode.js';
import Dashboard from "./Dashboard";
import Schedules from "./Schedules";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  onBreakpoint = broken => {
    console.log(broken);
  };

  showDashboard = () => {
    ReactDOM.render(<Dashboard />, document.getElementById('App-content'));
  };

  showSchedules = mode => {
    switch(mode) {
      case Mode.regular:
      case Mode.ranked:
      case Mode.league:
        ReactDOM.render(<Schedules mode={mode} />, document.getElementById('App-content'));
        break;
      default:
        console.error('App -> showSchedules(mode) -> mode: invalid value');
    }
  };

  render() {
    return (
      <Layout>
        <div className="App-sider-container">
          <Sider
            breakpoint='md'
            collapsible collapsed={this.state.collapsed}
            onBreakpoint={this.onBreakpoint}
            onCollapse={this.onCollapse}
            style={{
              height: '100vh',
              position: 'relative'
            }}
          >
            <div className="App-logo">
              <img src={logo} alt="logo" />
            </div>
            <Menu theme="dark" mode="inline">
              <Menu.Item
                key="1"
                onClick={this.showDashboard}
              >
                <Icon type="dashboard" />
                <span>Dashboard</span>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="schedule" />
                    <span>Schedules</span>
                  </span>
                }
              >
                <Menu.Item
                  key="2"
                  onClick={this.showSchedules.bind(this, Mode.regular)}
                >
                  Regular Battle
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={this.showSchedules.bind(this, Mode.ranked)}
                >
                  Ranked Battle
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={this.showSchedules.bind(this, Mode.league)}
                >
                  League Battle
                </Menu.Item>
                <Menu.Item key="5">Salmon Run</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="line-chart" />
                    <span>Statistics</span>
                  </span>
                }
              >
                <Menu.Item key="6">Stages</Menu.Item>
                <Menu.Item key="7">Weapons</Menu.Item>
                <Menu.Item key="8">Battle</Menu.Item>
                <Menu.Item key="9">Salmon Run</Menu.Item>
              </SubMenu>
              <Menu.Item key="10">
                <Icon type="menu" />
                <span>Battle</span>
              </Menu.Item>
              <Menu.Item key="11">
                <Icon type="menu" />
                <span>Salmon Run</span>
              </Menu.Item>
              <Menu.Item key="12">
                <Icon type="setting" />
                <span>Settings</span>
              </Menu.Item>
            </Menu>
          </Sider>
        </div>
        <Content id="App-content" className="App-content" style={{ height: '100vh' }}>
          <div className="App-content-logo-container">
            <img src={logo_grayscale} className="App-content-logo" alt="logo" />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default App;
