import React from 'react';
import { Redirect } from 'react-router-dom';
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
    data: [],
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    expired: false,
    invalid: false
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
    this.setState({ error: false });
    ScheduleHelper.getSchedules()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_fetch_schedules');
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
          this.setState({ errorLog: e.message, error: true });
        } else {
          console.error(e);
          this.setState({ errorLog: 'can_not_parse_schedules', error: true });
        }
      });
  };

  timeout = () => {
    if (new Date(this.state.data[0].endTime * 1000) - new Date() < 0) {
      this.setState({ expired: true });
    } else {
      this.forceUpdate();
    }
  };

  renderContent = () => {
    return (
      <div>
        {(() => {
          if (this.state.expired) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.schedules_expired"
                    defaultMessage="It seems that these schedules have expired, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        <div>
          <PageHeader title={<FormattedMessage id="app.schedules.current" defaultMessage="Current" />} />
          <ScheduleCard key="1" schedule={this.state.data[0]} />
        </div>
        {(() => {
          if (this.state.data.length > 1) {
            return (
              <div>
                <PageHeader
                  title={<FormattedMessage id="app.schedules.next" defaultMessage="Next" />}
                  subTitle={TimeConverter.getRemainedTime(this.state.data[0].endTime)}
                />
                <ScheduleCard key="2" schedule={this.state.data[1]} />
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
                  return <ScheduleCard key={2 + index} schedule={item} />;
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
            <FormattedMessage id="app.problem.troubleshoot.network" defaultMessage="Your network connection" />
          ]}
          extra={[
            [
              <Button onClick={this.updateSchedules} type="primary">
                <FormattedMessage id="app.retry" defaultMessage="Retry" />
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
      this.setState({ loaded: false, error: false, expired: false, invalid: false });
      this.updateSchedules();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

export default SchedulesWindow;
