import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Row, Col } from 'antd';

import './ScheduleCard.css';
import turfWarIcon from '../assets/images/mode-regular.png';
import clamBlitzIcon from '../assets/images/rule-clam-blitz.png';
import rainmakerIcon from '../assets/images/rule-rainmaker.png';
import splatZonesIcon from '../assets/images/rule-splat-zones.png';
import towerControlIcon from '../assets/images/rule-tower-control.png';
import Rule from '../models/Rule';
import FileFolderUrl from '../utils/FileFolderUrl';
import TimeConverter from '../utils/TimeConverter';

const { Meta } = Card;

class ScheduleCard extends React.Component {
  iconSelector = () => {
    switch (this.props.schedule.rule) {
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
        throw new RangeError();
    }
  };

  render() {
    return (
      <Card
        className="ScheduleCard-schedule"
        hoverable={this.props.hoverable}
        bordered={this.props.bordered}
        bodyStyle={{
          padding: '6px'
        }}
        style={(() => {
          if (this.props.pointer) {
            return {
              cursor: 'pointer'
            };
          }
        })()}
      >
        <Row>
          <Col xs={24} sm={12}>
            <Card
              className="ScheduleCard-schedule-stage"
              hoverable
              cover={
                <img
                  className="ScheduleCard-schedule-stage-cover"
                  alt="stage 1"
                  src={FileFolderUrl.SPLATNET + this.props.schedule.stage1.url}
                />
              }
              bodyStyle={{
                padding: '6px'
              }}
              style={(() => {
                if (this.props.pointer) {
                  return {
                    cursor: 'pointer'
                  };
                }
              })()}
            >
              <Meta
                className="ScheduleCard-schedule-stage-meta"
                title={<FormattedMessage id={this.props.schedule.stage1.stage.name} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              className="ScheduleCard-schedule-stage"
              hoverable
              cover={
                <img
                  className="ScheduleCard-schedule-stage-cover"
                  alt="stage 2"
                  src={FileFolderUrl.SPLATNET + this.props.schedule.stage2.url}
                />
              }
              bodyStyle={{
                padding: '6px'
              }}
              style={(() => {
                if (this.props.pointer) {
                  return {
                    cursor: 'pointer'
                  };
                }
              })()}
            >
              <Meta
                className="ScheduleCard-schedule-stage-meta"
                title={<FormattedMessage id={this.props.schedule.stage2.stage.name} />}
              />
            </Card>
          </Col>
        </Row>

        <Meta
          className="ScheduleCard-schedule-meta"
          avatar={<img className="ScheduleCard-schedule-meta-image" src={this.iconSelector()} alt="mode" />}
          title={<FormattedMessage id={this.props.schedule.rule.name} />}
          description={TimeConverter.formatSchedulePeriod(this.props.schedule.startTime, this.props.schedule.endTime)}
        />
      </Card>
    );
  }
}

ScheduleCard.defaultProps = {
  bordered: true,
  hoverable: true,
  pointer: false
};

export default ScheduleCard;
