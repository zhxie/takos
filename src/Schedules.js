import React from 'react';
import { Layout, PageHeader } from 'antd';

import './Schedules.css';
import Mode from './library/Mode';
import regularIcon from './assets/images/mode-regular.png';
import rankedIcon from './assets/images/mode-ranked.png';
import leagueIcon from './assets/images/mode-league.png';
import ScheduleCard from './library/components/ScheduleCard';
import { ArgumentOutOfRangeError } from 'rxjs';

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
    return !this.state.loaded ? (
      'Loading'
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
          <PageHeader title="Current" />
          <ScheduleCard />
          <PageHeader title="Next" subTitle="in 1 hour 36 min" />
          <ScheduleCard />
          <PageHeader title="Future" />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
          <ScheduleCard />
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    var url = 'https://splatoon2.ink/data/schedules.json';
    fetch(url)
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(() => {});
  }
}

Schedules.defaultProps = {
  mode: Mode.regularBattle
};

export default Schedules;
