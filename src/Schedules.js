import React from 'react';
import { Layout, PageHeader, Alert } from 'antd';

import './Schedules.css';
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

class Schedules extends React.Component {
  state = {
    loaded: false,
    error: false,
    expired: false
  };

  iconSelector = () => {
    switch (this.props.mode) {
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

  renderError = () => {
    return <ErrorResult error={this.state.errorLog} />;
  };

  renderLoading = () => {
    return <LoadingResult />;
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
    if (this.state.error) {
      return this.renderError();
    } else {
      return (
        <Layout>
          <Header className="Schedules-header" style={{ zIndex: 1 }}>
            <img className="Schedules-header-icon" src={this.iconSelector()} alt="mode" />
            <p className="Schedules-header-title">Schedules</p>
            <p className="Schedules-header-subtitle">{this.props.mode.name}</p>
          </Header>
          <Content className="Schedules-content">
            {(() => {
              if (!this.state.loaded) {
                return this.renderLoading();
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
        switch (this.props.mode) {
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
    if (this.props.mode !== prevProps.mode) {
      this.setState({ loaded: false, error: false, expired: false });
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

export default Schedules;
