import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, Alert, Button } from 'antd';

import './DashboardWindow.css';
import icon from './assets/images/character-judd.png';
import leagueIcon from './assets/images/mode-league.png';
import rankedIcon from './assets/images/mode-ranked.png';
import regularIcon from './assets/images/mode-regular.png';
import turfWarIcon from './assets/images/mode-regular.png';
import clamBlitzIcon from './assets/images/rule-clam-blitz.png';
import rainmakerIcon from './assets/images/rule-rainmaker.png';
import splatZonesIcon from './assets/images/rule-splat-zones.png';
import towerControlIcon from './assets/images/rule-tower-control.png';
import ErrorResult from './components/ErrorResult';
import { Mode } from './models/Mode';
import BattleHelper from './utils/BattleHelper';
import TakosError from './utils/ErrorHelper';
import { SPLATNET } from './utils/FileFolderUrl';
import ScheduleHelper from './utils/ScheduleHelper';
import StorageHelper from './utils/StorageHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;

class DashboardWindow extends React.Component {
  state = {
    error: false,
    errorLog: 'unknown_error',
    errorChecklist: []
  };
  render() {
    if (this.state.error) {
      return (
        <ErrorResult
          error={this.state.errorLog}
          checklist={this.state.errorChecklist}
          extra={[
            [
              <Button key="retry" onClick={this.updateBattles} type="primary">
                <FormattedMessage id="app.retry" defaultMessage="Retry" />
              </Button>,
              <Link to="/settings" key="toSettings">
                <Button type="default">
                  <FormattedMessage id="app.to_settings" defaultMessage="To Settings" />
                </Button>
              </Link>,
              <Button
                key="continue"
                onClick={() => {
                  this.setState({ error: false, loaded: true, updated: true });
                }}
                type="default"
              >
                <FormattedMessage id="app.continue" defaultMessage="Continue" />
              </Button>
            ]
          ]}
        />
      );
    } else {
      return (
        <Layout>
          <Header className="DashboardWindow-header" style={{ zIndex: 1 }}>
            <img className="DashboardWindow-header-icon" src={icon} alt="dashboard" />
            <p className="DashboardWindow-header-title">
              <FormattedMessage id="app.dashboard" defaultMessage="Dashboard" />
            </p>
          </Header>
          <Content className="DashboardWindow-content"></Content>
        </Layout>
      );
    }
  }
}

export default DashboardWindow;
