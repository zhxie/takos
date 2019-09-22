import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
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
    collapsed: false,
    selected: []
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  refreshMenu = () => {
    if (this.props.location.pathname.startsWith('/dashboard')) {
      this.setState({ selected: ['dashboard'] });
    } else if (this.props.location.pathname.startsWith('/schedules/regular')) {
      this.setState({ selected: ['schedules.regular_battle'] });
    } else if (this.props.location.pathname.startsWith('/schedules/ranked')) {
      this.setState({ selected: ['schedules.ranked_battle'] });
    } else if (this.props.location.pathname.startsWith('/schedules/league')) {
      this.setState({ selected: ['schedules.league_battle'] });
    } else if (this.props.location.pathname.startsWith('/schedules/salmon')) {
      this.setState({ selected: ['schedules.salmon_run'] });
    } else if (this.props.location.pathname.startsWith('/stats/stages')) {
      this.setState({ selected: ['statistics.stages'] });
    } else if (this.props.location.pathname.startsWith('/stats/weapons')) {
      this.setState({ selected: ['statistics.weapons'] });
    } else if (this.props.location.pathname.startsWith('/stats/battles')) {
      this.setState({ selected: ['statistics.battles'] });
    } else if (this.props.location.pathname.startsWith('/stats/salmon')) {
      this.setState({ selected: ['statistics.salmon_run'] });
    } else if (this.props.location.pathname.startsWith('/battles')) {
      this.setState({ selected: ['battles'] });
    } else if (this.props.location.pathname.startsWith('/salmon')) {
      this.setState({ selected: ['salmon_run'] });
    } else if (this.props.location.pathname.startsWith('/shop')) {
      this.setState({ selected: ['gear_shop'] });
    } else if (this.props.location.pathname.startsWith('/settings')) {
      this.setState({ selected: ['settings'] });
    } else {
      this.setState({ selected: [] });
    }
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
            <Menu selectedKeys={this.state.selected} theme="dark" mode="vertical">
              <Menu.Item key="dashboard">
                <Icon type="dashboard" />
                <FormattedMessage id="app.dashboard" defaultMessage="Dashboard" />
                <Link to="/dashboard" />
              </Menu.Item>
              <SubMenu
                key="schedules"
                title={
                  <span>
                    <Icon type="schedule" />
                    <FormattedMessage id="app.schedules" defaultMessage="Schedules" />
                  </span>
                }
              >
                <Menu.Item key="schedules.regular_battle">
                  <FormattedMessage id="mode.regular_battle" defaultMessage="Regular Battle" />
                  <Link to="/schedules/regular" />
                </Menu.Item>
                <Menu.Item key="schedules.ranked_battle">
                  <FormattedMessage id="mode.ranked_battle" defaultMessage="Ranked Battle" />
                  <Link to="/schedules/ranked" />
                </Menu.Item>
                <Menu.Item key="schedules.league_battle">
                  <FormattedMessage id="mode.league_battle" defaultMessage="League Battle" />
                  <Link to="/schedules/league" />
                </Menu.Item>
                <Menu.Item key="schedules.salmon_run">
                  <FormattedMessage id="app.salmon_run" defaultMessage="Salmon Run" />
                  <Link to="/schedules/salmon" />
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="stats"
                title={
                  <span>
                    <Icon type="line-chart" />
                    <FormattedMessage id="app.statistics" defaultMessage="Statistics" />
                  </span>
                }
              >
                <Menu.Item key="statistics.stages">
                  <FormattedMessage id="app.stages" defaultMessage="Stages" />
                  <Link to="/stats/stages" />
                </Menu.Item>
                <Menu.Item key="statistics.weapons">
                  <FormattedMessage id="app.weapons" defaultMessage="Weapons" />
                  <Link to="/stats/weapons" />
                </Menu.Item>
                <Menu.Item key="statistics.battles">
                  <FormattedMessage id="app.battles" defaultMessage="Battles" />
                  <Link to="/stats/battles" />
                </Menu.Item>
                <Menu.Item key="statistics.salmon">
                  <FormattedMessage id="app.salmon_run" defaultMessage="Salmon Run" />
                  <Link to="/stats/salmon" />
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="battles">
                <Icon type="menu" />
                <FormattedMessage id="app.battles" defaultMessage="Battles" />
                <Link to="/battles" />
              </Menu.Item>
              <Menu.Item key="salmon">
                <Icon type="menu" />
                <FormattedMessage id="app.salmon_run" defaultMessage="Salmon Run" />
                <Link to="/salmon" />
              </Menu.Item>
              <Menu.Item key="gear_shop">
                <Icon type="shopping" />
                <FormattedMessage id="app.gear_shop" defaultMessage="Gear Shop" />
                <Link to="/shop" />
              </Menu.Item>
              <Menu.Item key="settings">
                <Icon type="setting" />
                <FormattedMessage id="app.settings" defaultMessage="Settings" />
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

  componentDidMount() {
    this.refreshMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.refreshMenu();
    }
  }
}

export default MainWindow;
