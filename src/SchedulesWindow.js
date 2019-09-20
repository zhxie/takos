import React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, PageHeader, Alert } from 'antd';

import './SchedulesWindow.css';
import { USER_AGENT, SPLATOON2_INK, SPLATOON2_INK_SCHEDULES } from './utils/FileFolderUrl';
import Mode from './models/Mode';
import Schedule from './models/Schedule';
import TimeConverter from './utils/TimeConverter';
import LoadingResult from './components/LoadingResult';
import ErrorResult from './components/ErrorResult';
import ScheduleCard from './components/ScheduleCard';
import regularIcon from './assets/images/mode-regular.png';
import rankedIcon from './assets/images/mode-ranked.png';
import leagueIcon from './assets/images/mode-league.png';

const { Header, Content } = Layout;

class SchedulesWindow extends React.Component {
  state = {
    loaded: false,
    error: false,
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
                message="Warning"
                description="It seems that these schedules have expired, please refresh this page to update."
                type="warning"
                showIcon
              />
            );
          }
        })()}
        <div>
          <PageHeader title="Current" />
          <ScheduleCard key="1" schedule={this.state.data[0]} />
        </div>
        {(() => {
          if (this.state.data.length > 1) {
            return (
              <div>
                <PageHeader title="Next" subTitle={TimeConverter.getRemainedTime(this.state.data[0].endTime)} />
                <ScheduleCard key="2" schedule={this.state.data[1]} />
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 2) {
            return (
              <div>
                <PageHeader title="Future" />
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
      return <ErrorResult error={this.state.errorLog} />;
    } else {
      return (
        <Layout>
          <Header className="SchedulesWindow-header" style={{ zIndex: 1 }}>
            <img className="SchedulesWindow-header-icon" src={this.iconSelector()} alt="mode" />
            <p className="SchedulesWindow-header-title">Schedules</p>
            <p className="SchedulesWindow-header-subtitle">{this.mode.name}</p>
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
    if (!this.modeSelector()) {
      return;
    }
    const init = {
      method: 'GET',
      headers: new Headers({
        'User-Agent': USER_AGENT
      })
    };
    fetch(SPLATOON2_INK + SPLATOON2_INK_SCHEDULES, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let schedulesData;
        let schedules = [];
        switch (this.mode) {
          case Mode.regularBattle:
            schedulesData = res.regular;
            break;
          case Mode.rankedBattle:
            schedulesData = res.gachi;
            break;
          case Mode.leagueBattle:
            schedulesData = res.league;
            break;
          default:
            throw new RangeError();
        }
        try {
          for (const i in schedulesData) {
            const schedule = Schedule.parse(schedulesData[i]);
            if (schedule.e != null) {
              this.setState({ errorLog: schedule.e, error: true });
              return;
            }
            schedules.push(schedule);
          }
          if (schedules.length > 0) {
            this.setState({ data: schedules, loaded: true });
            // Set update interval
            this.timer = setInterval(this.timeout, 60000);
          } else {
            this.setState({ errorLog: 'can_not_parse_schedules', error: true });
          }
        } catch (e) {
          console.error(e);
          this.setState({ errorLog: 'can_not_parse_schedules', error: true });
        }
      })
      .catch(e => {
        console.error(e);
        this.setState({ errorLog: 'can_not_fetch_schedules', error: true });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.mode !== prevProps.match.params.mode) {
      this.setState({ loaded: false, error: false, expired: false, invalid: false });
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

export default SchedulesWindow;
