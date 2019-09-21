import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import logo from './assets/images/logo.svg';
import './MainWindow.css';
import SchedulesWindow from './SchedulesWindow';
import BattlesWindow from './BattlesWindow';
import SettingsWindow from './SettingsWindow';
import ConstructionResult from './components/ConstructionResult';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

class MainWindow extends React.Component {
  state = {
    collapsed: false
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
              <Menu.Item key="1">
                <Icon type="dashboard" />
                <span>Dashboard</span>
                <Link to="/dashboard" />
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
                <Menu.Item key="2">
                  Regular Battle
                  <Link to="/schedules/regular" />
                </Menu.Item>
                <Menu.Item key="3">
                  Ranked Battle
                  <Link to="/schedules/ranked" />
                </Menu.Item>
                <Menu.Item key="4">
                  League Battle
                  <Link to="/schedules/league" />
                </Menu.Item>
                <Menu.Item key="5">
                  Salmon Run
                  <Link to="/schedules/salmon" />
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
                <Menu.Item key="6">
                  Stage
                  <Link to="/stats/stages" />
                </Menu.Item>
                <Menu.Item key="7">
                  Weapon
                  <Link to="/stats/weapons" />
                </Menu.Item>
                <Menu.Item key="8">
                  Battles
                  <Link to="/stats/battles" />
                </Menu.Item>
                <Menu.Item key="9">
                  Salmon Run
                  <Link to="/stats/salmon" />
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="10">
                <Icon type="menu" />
                <span>Battle</span>
                <Link to="/battles" />
              </Menu.Item>
              <Menu.Item key="11">
                <Icon type="menu" />
                <span>Salmon Run</span>
                <Link to="/salmon" />
              </Menu.Item>
              <Menu.Item key="12">
                <Icon type="shopping" />
                <span>Gear Shop</span>
                <Link to="/shop" />
              </Menu.Item>
              <Menu.Item key="13">
                <Icon type="setting" />
                <span>Settings</span>
                <Link to="/settings" />
              </Menu.Item>
            </Menu>
          </Sider>
        </div>
        <Content id="MainWindow-content" style={{ height: '100vh' }}>
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={this.renderLogo} />
            <Route exact path={`${this.props.match.url}dashboard`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}schedules/salmon`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}schedules/:mode`} component={SchedulesWindow} />
            <Route exact path={`${this.props.match.url}stats/stages`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}stats/weapons`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}stats/battles`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}stats/salmon`} component={ConstructionResult} />
            <Route path={`${this.props.match.url}battles`} component={BattlesWindow} />
            <Route path={`${this.props.match.url}salmon`} component={ConstructionResult} />
            <Route path={`${this.props.match.url}shop`} component={ConstructionResult} />
            <Route exact path={`${this.props.match.url}settings`} component={SettingsWindow} />
            <Redirect from="*" to="/404" />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default MainWindow;
