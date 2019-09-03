import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { ArgumentOutOfRangeError } from 'rxjs';

import logo from './assets/images/logo.svg';
import './App.css';
import Mode from './library/Mode';
import Schedules from './Schedules';
import ConstructionResult from './library/components/ConstructionResult';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
    index: 0
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
      case Mode.regularBattle:
        this.setState({ index: 2 });
        break;
      case Mode.rankedBattle:
        this.setState({ index: 3 });
        break;
      case Mode.leagueBattle:
        this.setState({ index: 4 });
        break;
      default:
        throw new ArgumentOutOfRangeError();
    }
  };

  showConstruction = () => {
    this.setState({ index: -1 });
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
                  onClick={this.showSchedules.bind(this, Mode.regularBattle)}
                >
                  Regular Battle
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={this.showSchedules.bind(this, Mode.rankedBattle)}
                >
                  Ranked Battle
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={this.showSchedules.bind(this, Mode.leagueBattle)}
                >
                  League Battle
                </Menu.Item>
                <Menu.Item key="5" onClick={this.showConstruction}>
                  Salmon Run
                </Menu.Item>
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
          {(() => {
            switch (this.state.index) {
              case -1:
                return <ConstructionResult />;
              case 0:
                return (
                  <div className="App-content-logo-container">
                    <img src={logo} className="App-content-logo" alt="logo" />
                  </div>
                );
              case 2:
                return <Schedules mode={Mode.regularBattle} />;
              case 3:
                return <Schedules mode={Mode.rankedBattle} />;
              case 4:
                return <Schedules mode={Mode.leagueBattle} />;
              default:
                throw new ArgumentOutOfRangeError();
            }
          })()}
        </Content>
      </Layout>
    );
  }
}

export default App;
