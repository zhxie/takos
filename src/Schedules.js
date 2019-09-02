import React from 'react';
import { Layout, PageHeader } from 'antd';

import './Schedules.css';
import regularIcon from './assets/images/mode-regular.png';
import rankedIcon from './assets/images/mode-ranked.png';
import leagueIcon from './assets/images/mode-league.png';
import ScheduleCard from './library/components/ScheduleCard';

const { Header, Content } = Layout;

class Schedules extends React.Component {
  render() {
    return (
      <Layout>
        <Header className="Schedules-header" style={{ zIndex: 1 }}>
          <img className="Schedules-header-icon" src={regularIcon} alt="mode" />
          <p className="Schedules-header-title">Schedules</p>
          <p className="Schedules-header-subtitle">Regular Battle</p>
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
}

export default Schedules;
