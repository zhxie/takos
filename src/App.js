import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon } from 'antd';

import logo from './assets/images/logo.svg';
import './App.css';
import Mode from './library/Mode';
import Schedules from './Schedules';
import Construction from './library/components/Construction';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  onBreakpoint = broken => {
    console.log(broken);
  };

  showSchedules = mode => {
    switch (mode) {
      case Mode.regular:
      case Mode.ranked:
      case Mode.league:
        ReactDOM.render(
          <Schedules mode={mode} />,
          document.getElementById('App-content')
        );
        break;
      default:
        console.error('App -> showSchedules(mode) -> mode: invalid value');
    }
  };

  showConstruction = () => {
    ReactDOM.render(<Construction />, document.getElementById('App-content'));
  };

  render() {
    return (
      <Layout style={{ display: 'block' }}>
        <div className="App-sider-container">
          <Sider
            breakpoint="md"
            collapsible
            collapsed={this.state.collapsed}
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
            <Menu theme="dark" mode="vertical">
              <Menu.Item key="1" onClick={this.showConstruction}>
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
                <Menu.Item key="6" onClick={this.showConstruction}>
                  Stage
                </Menu.Item>
                <Menu.Item key="7" onClick={this.showConstruction}>
                  Weapon
                </Menu.Item>
                <Menu.Item key="8" onClick={this.showConstruction}>
                  Battles
                </Menu.Item>
                <Menu.Item key="9" onClick={this.showConstruction}>
                  Salmon Run
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="10" onClick={this.showConstruction}>
                <Icon type="menu" />
                <span>Battle</span>
              </Menu.Item>
              <Menu.Item key="11" onClick={this.showConstruction}>
                <Icon type="menu" />
                <span>Salmon Run</span>
              </Menu.Item>
              <Menu.Item key="12" onClick={this.showConstruction}>
                <Icon type="shopping" />
                <span>Gear Shop</span>
              </Menu.Item>
              <Menu.Item key="13" onClick={this.showConstruction}>
                <Icon type="setting" />
                <span>Settings</span>
              </Menu.Item>
            </Menu>
          </Sider>
        </div>
        <Content id="App-content" style={{ height: '100vh' }}>
          <div className="App-content-logo-container">
            <img src={logo} className="App-content-logo" alt="logo" />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default App;
