import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Button } from 'antd';

import './SchedulesWindow.css';
import leagueIcon from './assets/images/mode-league.png';
import rankedIcon from './assets/images/mode-ranked.png';
import regularIcon from './assets/images/mode-regular.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import ScheduleCard from './components/ScheduleCard';
import { Mode } from './models/Mode';
import TakosError from './utils/ErrorHelper';
import ScheduleHelper from './utils/ScheduleHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;

class SchedulesWindow extends React.Component {
  state = {
    // Data
    data: [],
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    expired: false,
    invalid: false,
    updated: false
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

  updateSchedules = () => {
    if (!this.modeSelector()) {
      return;
    }
    this.setState({ error: false, updated: false });
    ScheduleHelper.getSchedules()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_get_schedules');
        } else {
          let schedules;
          switch (this.mode) {
            case Mode.regularBattle:
              schedules = res.regularSchedules;
              break;
            case Mode.rankedBattle:
              schedules = res.rankedSchedules;
              break;
            case Mode.leagueBattle:
              schedules = res.leagueSchedules;
              break;
            default:
              throw new RangeError();
          }
          schedules.forEach(element => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          if (schedules.length > 0) {
            this.setState({ data: schedules, loaded: true });
            // Set update interval
            this.timer = setInterval(this.timeout, 60000);
          } else {
            throw new TakosError('can_not_parse_schedules');
          }
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message, updated: true });
        } else {
          console.error(e);
          this.setState({ error: true, errorLog: 'can_not_parse_schedules', updated: true });
        }
      });
  };

  timeout = () => {
    if (this.state.data instanceof Array && this.state.data.length > 0) {
      if (new Date(this.state.data[0].endTime * 1000) - new Date() < 0) {
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
              />
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.schedules.current" defaultMessage="Current" />} />
                <div className="SchedulesWindow-content-card" key="1">
                  <ScheduleCard schedule={this.state.data[0]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 1) {
            return (
              <div>
                <PageHeader
                  title={<FormattedMessage id="app.schedules.next" defaultMessage="Next" />}
                  subTitle={TimeConverter.getTimeTo(this.state.data[0].endTime)}
                />
                <div className="SchedulesWindow-content-card" key="2">
                  <ScheduleCard schedule={this.state.data[1]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 2) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.schedules.future" defaultMessage="Future" />} />
                {this.state.data.slice(2).map((item, index) => {
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
              <Button key="update" onClick={this.updateSchedules} type="primary">
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
        <Layout>
          <Header className="SchedulesWindow-header" style={{ zIndex: 1 }}>
            <img className="SchedulesWindow-header-icon" src={this.iconSelector()} alt="mode" />
            <p className="SchedulesWindow-header-title">
              <FormattedMessage id="app.schedules" defaultMessage="Schedules" />
            </p>
            <p className="SchedulesWindow-header-subtitle">
              <FormattedMessage id={this.mode.name} />
            </p>
          </Header>
          <Content className="SchedulesWindow-content">
            {(() => {
              if (!this.state.loaded) {
                return <LoadingResult />;
              } else {
                return this.renderContent();
              }
            })()}
          </Content>
        </Layout>
      );
    }
  }

  componentDidMount() {
    this.updateSchedules();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.mode !== prevProps.match.params.mode) {
      this.setState({ loaded: false, error: false, expired: false });
      this.updateSchedules();
    }
  }

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.timer);
  }
}

export default SchedulesWindow;
