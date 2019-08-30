import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Icon } from 'antd';

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
  }

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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="home" />
                <span>Home</span>
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
                <Menu.Item key="2">Regular Battle</Menu.Item>
                <Menu.Item key="3">Ranked Battle</Menu.Item>
                <Menu.Item key="4">League Battle</Menu.Item>
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
        <Content className="App-content" style={{ height: '100vh' }}>
          <Content style={{ background: '#fff', height: '2000px', margin: '16px' }} />
        </Content>
      </Layout>
    );
  }
}

export default App;
