import React from 'react';
import { Layout, PageHeader } from 'antd';
import { ArgumentOutOfRangeError } from 'rxjs';

import './Schedules.css';
import {
  USER_AGENT,
  SPLATOON2_INK_API,
  SPLATOON2_INK_SCHEDULES
} from './library/FileFolderUrl';
import Mode from './library/Mode';
import Schedule from './library/Schedule';
import TimeConverter from './library/components/TimeConverter';
import regularIcon from './assets/images/mode-regular.png';
import rankedIcon from './assets/images/mode-ranked.png';
import leagueIcon from './assets/images/mode-league.png';
import ScheduleCard from './library/components/ScheduleCard';

const { Header, Content } = Layout;

class Schedules extends React.Component {
  state = {
    loaded: false,
    error: false
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
        throw new ArgumentOutOfRangeError();
    }
  };

  render() {
    return this.state.error ? (
      this.state.errorLog
    ) : (
      <Layout>
        <Header className="Schedules-header" style={{ zIndex: 1 }}>
          <img
            className="Schedules-header-icon"
            src={this.iconSelector()}
            alt="mode"
          />
          <p className="Schedules-header-title">Schedules</p>
          <p className="Schedules-header-subtitle">{this.props.mode.name}</p>
        </Header>
        <Content className="Schedules-content">
          {(() => {
            if (!this.state.loaded) {
              return 'Loading...';
            } else {
              return (
                <div>
                  <PageHeader title="Current" />
                  <ScheduleCard schedule={this.state.data[0]} />
                  <PageHeader
                    title="Next"
                    subTitle={TimeConverter.getRemainedTime(
                      this.state.data[1].startTime
                    )}
                  />
                  <ScheduleCard schedule={this.state.data[1]} />
                  <PageHeader title="Future" />
                  <ScheduleCard schedule={this.state.data[2]} />
                  <ScheduleCard schedule={this.state.data[3]} />
                  <ScheduleCard schedule={this.state.data[4]} />
                  <ScheduleCard schedule={this.state.data[5]} />
                  <ScheduleCard schedule={this.state.data[6]} />
                  <ScheduleCard schedule={this.state.data[7]} />
                  <ScheduleCard schedule={this.state.data[8]} />
                  <ScheduleCard schedule={this.state.data[9]} />
                  <ScheduleCard schedule={this.state.data[10]} />
                  <ScheduleCard schedule={this.state.data[11]} />
                </div>
              );
            }
          })()}
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    var url = SPLATOON2_INK_API + SPLATOON2_INK_SCHEDULES;
    var headers = new Headers({
      'User-Agent': USER_AGENT
    });
    var init = {
      method: 'GET',
      headers: headers
    };
    fetch(url, init)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // Parse data
        var schedulesData;
        var schedules = [];
        switch (this.props.mode) {
          case Mode.regularBattle:
            schedulesData = data.regular;
            break;
          case Mode.rankedBattle:
            schedulesData = data.gachi;
            break;
          case Mode.leagueBattle:
            schedulesData = data.league;
            break;
          default:
            throw new ArgumentOutOfRangeError();
        }
        try {
          for (let i in schedulesData) {
            var schedule = Schedule.parse(schedulesData[i]);
            if (schedule.e != null) {
              this.setState({ errorLog: schedule.e, error: true });
              return;
            }
            schedules.push(schedule);
          }
          if (schedules.length === 12) {
            this.setState({ data: schedules, loaded: true });
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
      this.setState({ loaded: false });
      this.componentDidMount();
    }
  }
}

export default Schedules;
