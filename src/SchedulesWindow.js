import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { PageHeader, Alert, Button } from 'antd';

import './SchedulesWindow.css';
import leagueIcon from './assets/images/mode-league.png';
import rankedIcon from './assets/images/mode-ranked.png';
import regularIcon from './assets/images/mode-regular.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import ScheduleCard from './components/ScheduleCard';
import WindowLayout from './components/WindowLayout';
import { Mode } from './models/Mode';
import TakosError from './utils/ErrorHelper';
import ScheduleHelper from './utils/ScheduleHelper';
import TimeConverter from './utils/TimeConverter';

class SchedulesWindow extends React.Component {
  state = {
    // Data
    data: null,
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    invalid: false,
    updated: false,
    expired: false
  };

  constructor(props) {
    super(props);
    if (!this.modeSelector()) {
      this.state.invalid = true;
    }
  }

  modeSelector = () => {
    switch (this.props.match.params.mode) {
      case 'regular':
        this.mode = Mode.regularBattle;
        break;
      case 'ranked':
        this.mode = Mode.rankedBattle;
        break;
      case 'league':
        this.mode = Mode.leagueBattle;
        break;
      default:
        return false;
    }
    return true;
  };

  iconSelector = () => {
    switch (this.mode) {
      case Mode.regularBattle:
        return regularIcon;
      case Mode.rankedBattle:
        return rankedIcon;
      case Mode.leagueBattle:
        return leagueIcon;
      default:
        throw new RangeError();
    }
  };

  dataSelector = () => {
    switch (this.mode) {
      case Mode.regularBattle:
        return this.state.data.regularSchedules;
      case Mode.rankedBattle:
        return this.state.data.rankedSchedules;
      case Mode.leagueBattle:
        return this.state.data.leagueSchedules;
      default:
        throw new RangeError();
    }
  };

  updateData = () => {
    if (!this.modeSelector()) {
      return;
    }
    this.setState({ error: false, updated: false, expired: false });
    return ScheduleHelper.updateSchedules((res) => {
      this.setState({ data: res, loaded: true });
      // Set update interval
      this.timer = setInterval(this.timeout, 60000);
    })
      .then((res) => {
        if (res instanceof TakosError) {
          throw res;
        }
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message, updated: true });
        } else {
          this.setState({ error: true, errorLog: 'can_not_update_schedules', updated: true });
        }
      });
  };

  timeout = () => {
    if (this.state.data != null) {
      if (new Date(this.state.data.regularSchedules[0].endTime * 1000) - new Date() < 0) {
        this.setState({ expired: true });
      } else {
        // Force update the page to update the remaining and coming time
        this.forceUpdate();
      }
    }
  };

  renderContent = () => {
    return (
      <div>
        {(() => {
          if (this.state.updated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.schedules_can_not_update"
                    defaultMessage="Takos can not update schedules, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        {(() => {
          if (this.state.expired) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.schedules_expired"
                    defaultMessage="It seems that these schedules have expired, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        {(() => {
          if (this.state.data !== null && this.dataSelector().length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.schedules.current" defaultMessage="Current" />} />
                <div className="SchedulesWindow-content-card" key="1">
                  <ScheduleCard schedule={this.dataSelector()[0]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data !== null && this.dataSelector().length > 1) {
            return (
              <div>
                <PageHeader
                  title={<FormattedMessage id="app.schedules.next" defaultMessage="Next" />}
                  subTitle={TimeConverter.getTimeTo(this.dataSelector()[0].endTime)}
                />
                <div className="SchedulesWindow-content-card" key="2">
                  <ScheduleCard schedule={this.dataSelector()[1]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data !== null && this.dataSelector().length > 2) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.schedules.future" defaultMessage="Future" />} />
                {this.dataSelector()
                  .slice(2)
                  .map((item, index) => {
                    return (
                      <div className="SchedulesWindow-content-card" key={2 + index}>
                        <ScheduleCard schedule={item} />
                      </div>
                    );
                  })}
              </div>
            );
          }
        })()}
      </div>
    );
  };

  render() {
    if (this.state.invalid) {
      return <Redirect to="/404" />;
    } else if (this.state.error) {
      return (
        <ErrorResult
          error={this.state.errorLog}
          checklist={[
            <FormattedMessage
              key="network"
              id="app.problem.troubleshoot.network"
              defaultMessage="Your network connection"
            />
          ]}
          extra={[
            [
              <Button key="update" onClick={this.updateData} type="primary">
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
                  this.setState({ error: false, loaded: true });
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
        <WindowLayout
          icon={this.iconSelector()}
          title={<FormattedMessage id="app.schedules" defaultMessage="Schedules" />}
          subtitle={<FormattedMessage id={this.mode.name} />}
        >
          {(() => {
            if (!this.state.loaded) {
              return <LoadingResult />;
            } else {
              return this.renderContent();
            }
          })()}
        </WindowLayout>
      );
    }
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.mode !== prevProps.match.params.mode) {
      // Instead of update schedules, just switch to another view
      // this.setState({ loaded: false, error: false, expired: false });
      // this.updateData();
      this.modeSelector();
    }
  }

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.timer);
  }
}

export default SchedulesWindow;
