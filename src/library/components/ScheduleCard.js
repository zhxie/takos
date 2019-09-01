import React from 'react';
import { Card, Avatar } from 'antd';

import './ScheduleCard.css';
import turfWarIcon from '../../assets/images/mode-regular.png';
import splatZonesIcon from '../../assets/images/rule-splat-zones.png';
import towerControlIcon from '../../assets/images/rule-tower-control.png';
import rainmakerIcon from '../../assets/images/rule-rainmaker.png';
import clamBlitzIcon from '../../assets/images/rule-clam-blitz.png';

const { Meta } = Card;

class ScheduleCard extends React.Component {
  render() {
    return (
      <Card
        className="ScheduleCard-schedule"
        bodyStyle={{
          padding: '6px'
        }}
      >
        <Card
          className="ScheduleCard-schedule-stage"
          bodyStyle={{
            padding: '6px'
          }}
          cover={
            <img
              alt="stage 1"
              src="https://splatoon2.ink/assets/splatnet/images/stage/070d7ee287fdf3c5df02411950c2a1ce5b238746.png"
            />
          }
        >
          <Meta
            className="ScheduleCard-schedule-stage-meta"
            title="Manta Maria"
          />
        </Card>
        <Card
          className="ScheduleCard-schedule-stage"
          bodyStyle={{
            padding: '6px'
          }}
          cover={
            <img
              alt="stage 2"
              src="https://splatoon2.ink/assets/splatnet/images/stage/070d7ee287fdf3c5df02411950c2a1ce5b238746.png"
            />
          }
        >
          <Meta
            className="ScheduleCard-schedule-stage-meta"
            title="Manta Maria"
          />
        </Card>
        <Meta
          className="ScheduleCard-schedule-meta"
          avatar={
            <img
              className="ScheduleCard-schedule-meta-image"
              src={turfWarIcon}
              alt="mode"
            />
          }
          title="Turf War"
          description="12:00 - 14:00 (in 1 hour 36 mins)"
        />
      </Card>
    );
  }
}

export default ScheduleCard;
