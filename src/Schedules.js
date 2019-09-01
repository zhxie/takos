import React from 'react';

import './Schedules.css';
import ScheduleCard from './library/components/ScheduleCard';

class Schedules extends React.Component {
  render() {
    return (
      <div className="Schedules-content">
        <ScheduleCard />
        <ScheduleCard />
        <ScheduleCard />
        <ScheduleCard />
        <ScheduleCard />
      </div>
    );
  }
}

export default Schedules;
