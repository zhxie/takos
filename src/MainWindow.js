import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, Menu, Icon } from 'antd';

import './MainWindow.css';
import BattlesStatisticsWindow from './BattlesStatisticsWindow';
import BattlesWindow from './BattlesWindow';
import DashboardWindow from './DashboardWindow';
import GearShopWindow from './GearShopWindow';
import GearsStatisticsWindow from './GearsStatisticsWindow';
import JobsStatisticsWindow from './JobsStatisticsWindow';
import JobsWindow from './JobsWindow';
import SchedulesWindow from './SchedulesWindow';
import SettingsWindow from './SettingsWindow';
import ShiftsWindow from './ShiftsWindow';
import StagesStatisticsWindow from './StagesStatisticsWindow';
import WeaponsStatisticsWindow from './WeaponsStatisticsWindow';
import logo from './assets/images/logo.svg';
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
    } else if (this.props.location.pathname.startsWith('/shifts')) {
      this.setState({ selected: ['shifts'] });
    } else if (this.props.location.pathname.startsWith('/stats/stages')) {
      this.setState({ selected: ['statistics.stages'] });
    } else if (this.props.location.pathname.startsWith('/stats/weapons')) {
      this.setState({ selected: ['statistics.weapons'] });
    } else if (this.props.location.pathname.startsWith('/stats/gears')) {
      this.setState({ selected: ['statistics.gears'] });
    } else if (this.props.location.pathname.startsWith('/stats/battles')) {
      this.setState({ selected: ['statistics.battles'] });
    } else if (this.props.location.pathname.startsWith('/stats/jobs')) {
      this.setState({ selected: ['statistics.jobs'] });
    } else if (this.props.location.pathname.startsWith('/battles')) {
      this.setState({ selected: ['battles'] });
    } else if (this.props.location.pathname.startsWith('/jobs')) {
      this.setState({ selected: ['jobs'] });
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
                <span>
                  <FormattedMessage id="app.dashboard" defaultMessage="Dashboard" />
                </span>
                <Link to="/dashboard" />
              </Menu.Item>
              <SubMenu
                key="schedules"
                title={
                  <div>
                    <Icon type="schedule" />
                    <span>
                      <FormattedMessage id="app.schedules" defaultMessage="Schedules" />
                    </span>
                  </div>
                }
              >
                <Menu.Item key="schedules.regular_battle">
                  <span>
                    <FormattedMessage id="mode.regular_battle" defaultMessage="Regular Battle" />
                  </span>
                  <Link to="/schedules/regular" />
                </Menu.Item>
                <Menu.Item key="schedules.ranked_battle">
                  <span>
                    <FormattedMessage id="mode.ranked_battle" defaultMessage="Ranked Battle" />
                  </span>
                  <Link to="/schedules/ranked" />
                </Menu.Item>
                <Menu.Item key="schedules.league_battle">
                  <span>
                    <FormattedMessage id="mode.league_battle" defaultMessage="League Battle" />
                  </span>
                  <Link to="/schedules/league" />
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="shifts">
                <Icon type="schedule" />
                <span>
                  <FormattedMessage id="app.shifts" defaultMessage="Shifts" />
                </span>
                <Link to="/shifts" />
              </Menu.Item>
              <SubMenu
                key="stats"
                title={
                  <div>
                    <Icon type="line-chart" />
                    <span>
                      <FormattedMessage id="app.statistics" defaultMessage="Statistics" />
                    </span>
                  </div>
                }
              >
                <Menu.Item key="statistics.stages">
                  <span>
                    <FormattedMessage id="app.stages" defaultMessage="Stages" />
                  </span>
                  <Link to="/stats/stages" />
                </Menu.Item>
                <Menu.Item key="statistics.weapons">
                  <span>
                    <FormattedMessage id="app.weapons" defaultMessage="Weapons" />
                  </span>
                  <Link to="/stats/weapons" />
                </Menu.Item>
                <Menu.Item key="statistics.gears">
                  <span>
                    <FormattedMessage id="app.gears" defaultMessage="Gears" />
                  </span>
                  <Link to="/stats/gears" />
                </Menu.Item>
                <Menu.Item key="statistics.battles">
                  <span>
                    <FormattedMessage id="app.battles" defaultMessage="Battles" />
                  </span>
                  <Link to="/stats/battles" />
                </Menu.Item>
                <Menu.Item key="statistics.jobs">
                  <span>
                    <FormattedMessage id="app.jobs" defaultMessage="Salmon Run" />
                  </span>
                  <Link to="/stats/jobs" />
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="battles">
                <Icon type="menu" />
                <span>
                  <FormattedMessage id="app.battles" defaultMessage="Battles" />
                </span>
                <Link to="/battles" />
              </Menu.Item>
              <Menu.Item key="jobs">
                <Icon type="menu" />
                <span>
                  <FormattedMessage id="app.jobs" defaultMessage="Jobs" />
                </span>
                <Link to="/jobs" />
              </Menu.Item>
              <Menu.Item key="gear_shop">
                <Icon type="shopping" />
                <span>
                  <FormattedMessage id="app.gear_shop" defaultMessage="Gear Shop" />
                </span>
                <Link to="/shop" />
              </Menu.Item>
              <Menu.Item key="settings">
                <Icon type="setting" />
                <span>
                  <FormattedMessage id="app.settings" defaultMessage="Settings" />
                </span>
                <Link to="/settings" />
              </Menu.Item>
            </Menu>
          </Sider>
        </div>
        <Content id="MainWindow-content" style={{ height: '100vh' }}>
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={this.renderLogo} />
            <Route exact path={`${this.props.match.url}dashboard`} component={DashboardWindow} />
            <Route exact path={`${this.props.match.url}schedules/:mode`} component={SchedulesWindow} />
            <Route exact path={`${this.props.match.url}shifts`} component={ShiftsWindow} />
            <Route exact path={`${this.props.match.url}stats/stages`} component={StagesStatisticsWindow} />
            <Route exact path={`${this.props.match.url}stats/weapons`} component={WeaponsStatisticsWindow} />
            <Route exact path={`${this.props.match.url}stats/gears`} component={GearsStatisticsWindow} />
            <Route exact path={`${this.props.match.url}stats/battles`} component={BattlesStatisticsWindow} />
            <Route exact path={`${this.props.match.url}stats/jobs`} component={JobsStatisticsWindow} />
            <Route path={`${this.props.match.url}battles`} component={BattlesWindow} />
            <Route path={`${this.props.match.url}jobs`} component={JobsWindow} />
            <Route exact path={`${this.props.match.url}shop`} component={GearShopWindow} />
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
