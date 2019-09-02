import React from 'react';
import { Card } from 'antd';

import './ScheduleCard.css';
import Rule from '../Rule';
import { Stage, ScheduledStage } from '../Stage';
import TimeConverter from '../components/TimeConverter';
import turfWarIcon from '../../assets/images/mode-regular.png';
import splatZonesIcon from '../../assets/images/rule-splat-zones.png';
import towerControlIcon from '../../assets/images/rule-tower-control.png';
import rainmakerIcon from '../../assets/images/rule-rainmaker.png';
import clamBlitzIcon from '../../assets/images/rule-clam-blitz.png';
import { ArgumentOutOfRangeError } from 'rxjs';

const { Meta } = Card;

class ScheduleCard extends React.Component {
  iconSelector = () => {
    switch (this.props.rule) {
      case Rule.turfWar:
        return turfWarIcon;
      case Rule.splatZones:
        return splatZonesIcon;
      case Rule.towerControl:
        return towerControlIcon;
      case Rule.rainmaker:
        return rainmakerIcon;
      case Rule.clamBlitz:
        return clamBlitzIcon;
      default:
        throw new ArgumentOutOfRangeError();
    }
  };

  render() {
    return (
      <Card
        className="ScheduleCard-schedule"
        bodyStyle={{
          padding: '6px'
        }}
      >
        <Card
          hoverable
          className="ScheduleCard-schedule-stage"
          bodyStyle={{
            padding: '6px'
          }}
          cover={<img alt="stage 1" src={this.props.stage1.url} />}
        >
          <Meta
            className="ScheduleCard-schedule-stage-meta"
            title={this.props.stage1.name}
          />
        </Card>
        <Card
          hoverable
          className="ScheduleCard-schedule-stage"
          bodyStyle={{
            padding: '6px'
          }}
          cover={<img alt="stage 2" src={this.props.stage2.url} />}
        >
          <Meta
            className="ScheduleCard-schedule-stage-meta"
            title={this.props.stage2.name}
          />
        </Card>
        <Meta
          className="ScheduleCard-schedule-meta"
          avatar={
            <img
              className="ScheduleCard-schedule-meta-image"
              src={this.iconSelector()}
              alt="mode"
            />
          }
          title={this.props.rule.name}
          description={TimeConverter.getSchedulePeriod(
            this.props.startTime,
            this.props.endTime
          )}
        />
      </Card>
    );
  }
}

ScheduleCard.defaultProps = {
  stage1: new ScheduledStage(Stage.theReef, ''),
  stage2: new ScheduledStage(Stage.theReef, ''),
  rule: Rule.turfWar,
  startTime: 0,
  endTime: 0
};

export default ScheduleCard;
