import React from 'react';
import { Layout, Menu, Icon } from 'antd';

import logo from './assets/images/logo.svg';
import './MainWindow.css';
import Mode from './models/Mode';
import SchedulesWindow from './SchedulesWindow';
import SettingsWindow from './SettingsWindow';
import ConstructionResult from './components/ConstructionResult';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

class MainWindow extends React.Component {
  state = {
    collapsed: false,
    index: 0
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  renderLogo = () => {
    return (
      <div className="MainWindow-content-logo-container">
        <img src={logo} className="MainWindow-content-logo" alt="logo" />
      </div>
    );
  };

  renderConstruction = () => {
    return <ConstructionResult />;
  };

  renderSchedules = mode => {
    return <SchedulesWindow mode={mode} />;
  };

  renderSettings = () => {
    return <SettingsWindow />;
  };

  render() {
    return (
      <Layout style={{ display: 'block' }}>
        <div className="MainWindow-sider-container">
          <Sider
            breakpoint="md"
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            style={{
              height: '100vh',
              position: 'relative'
            }}
          >
            <div className="MainWindow-logo">
              <img src={logo} alt="logo" />
            </div>
            <Menu theme="dark" mode="vertical">
              <Menu.Item
                key="1"
                onClick={() => {
                  this.setState({ index: 1 });
                }}
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
                  onClick={() => {
                    this.setState({ index: 2 });
                  }}
                >
                  Regular Battle
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={() => {
                    this.setState({ index: 3 });
                  }}
                >
                  Ranked Battle
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={() => {
                    this.setState({ index: 4 });
                  }}
                >
                  League Battle
                </Menu.Item>
                <Menu.Item
                  key="5"
                  onClick={() => {
                    this.setState({ index: 5 });
                  }}
                >
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
                <Menu.Item
                  key="6"
                  onClick={() => {
                    this.setState({ index: 6 });
                  }}
                >
                  Stage
                </Menu.Item>
                <Menu.Item
                  key="7"
                  onClick={() => {
                    this.setState({ index: 7 });
                  }}
                >
                  Weapon
                </Menu.Item>
                <Menu.Item
                  key="8"
                  onClick={() => {
                    this.setState({ index: 8 });
                  }}
                >
                  Battles
                </Menu.Item>
                <Menu.Item
                  key="9"
                  onClick={() => {
                    this.setState({ index: 9 });
                  }}
                >
                  Salmon Run
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                key="10"
                onClick={() => {
                  this.setState({ index: 10 });
                }}
              >
                <Icon type="menu" />
                <span>Battle</span>
              </Menu.Item>
              <Menu.Item
                key="11"
                onClick={() => {
                  this.setState({ index: 11 });
                }}
              >
                <Icon type="menu" />
                <span>Salmon Run</span>
              </Menu.Item>
              <Menu.Item
                key="12"
                onClick={() => {
                  this.setState({ index: 12 });
                }}
              >
                <Icon type="shopping" />
                <span>Gear Shop</span>
              </Menu.Item>
              <Menu.Item
                key="13"
                onClick={() => {
                  this.setState({ index: 13 });
                }}
              >
                <Icon type="setting" />
                <span>Settings</span>
              </Menu.Item>
            </Menu>
          </Sider>
        </div>
        <Content id="MainWindow-content" style={{ height: '100vh' }}>
          {(() => {
            switch (this.state.index) {
              case 1:
                return this.renderConstruction();
              case 0:
                return this.renderLogo();
              case 2:
                return this.renderSchedules(Mode.regularBattle);
              case 3:
                return this.renderSchedules(Mode.rankedBattle);
              case 4:
                return this.renderSchedules(Mode.leagueBattle);
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
              case 10:
              case 11:
              case 12:
                return this.renderConstruction();
              case 13:
                return this.renderSettings();
              default:
                throw new RangeError();
            }
          })()}
        </Content>
      </Layout>
    );
  }
}

export default MainWindow;
