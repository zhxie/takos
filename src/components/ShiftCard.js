import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Card, Row, Col, Tooltip } from 'antd';

import './ShiftCard.css';
import icon from '../assets/images/salmon-run.png';
import FileFolderUrl from '../utils/FileFolderUrl';
import TimeConverter from '../utils/TimeConverter';

const { Meta } = Card;

class ShiftCard extends React.Component {
  render() {
    return (
      <Card
        className="ShiftCard-shift"
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
        {(() => {
          if (this.props.shift.stage !== null) {
            return (
              <Row className="ShiftCard-shift-row">
                <Col xs={24} sm={12}>
                  <Link to={'/stats/stages#{0}'.format(this.props.shift.stage.stage.value)}>
                    <Card
                      className="ShiftCard-shift-stage"
                      hoverable
                      cover={
                        <img
                          className="ShiftCard-shift-stage-cover"
                          alt="stage"
                          src={FileFolderUrl.SPLATNET + this.props.shift.stage.url}
                        />
                      }
                      bodyStyle={{
                        padding: '6px'
                      }}
                    >
                      <Meta
                        className="ShiftCard-shift-stage-meta"
                        title={<FormattedMessage id={this.props.shift.stage.stage.name} />}
                      />
                    </Card>
                  </Link>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    className="ShiftCard-shift-weapon"
                    hoverable
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
                    <Row gutter={16}>
                      <Col className="ShiftCard-shift-weapon-col" xs={6} sm={12}>
                        <Link to={'/stats/weapons?salmon=1#{0}'.format(this.props.shift.weapon1.mainWeapon.value)}>
                          <Tooltip title={<FormattedMessage id={this.props.shift.weapon1.mainWeapon.name} />}>
                            <img
                              className="ShiftCard-shift-weapon-img"
                              src={FileFolderUrl.SPLATNET + this.props.shift.weapon1.mainWeaponUrl}
                              alt="weapon1"
                            />
                          </Tooltip>
                        </Link>
                      </Col>
                      <Col className="ShiftCard-shift-weapon-col" xs={6} sm={12}>
                        <Link to={'/stats/weapons?salmon=1#{0}'.format(this.props.shift.weapon2.mainWeapon.value)}>
                          <Tooltip title={<FormattedMessage id={this.props.shift.weapon2.mainWeapon.name} />}>
                            <img
                              className="ShiftCard-shift-weapon-img"
                              src={FileFolderUrl.SPLATNET + this.props.shift.weapon2.mainWeaponUrl}
                              alt="weapon2"
                            />
                          </Tooltip>
                        </Link>
                      </Col>
                      <Col className="ShiftCard-shift-weapon-col" xs={6} sm={12}>
                        <Link to={'/stats/weapons?salmon=1#{0}'.format(this.props.shift.weapon3.mainWeapon.value)}>
                          <Tooltip title={<FormattedMessage id={this.props.shift.weapon3.mainWeapon.name} />}>
                            <img
                              className="ShiftCard-shift-weapon-img"
                              src={FileFolderUrl.SPLATNET + this.props.shift.weapon3.mainWeaponUrl}
                              alt="weapon3"
                            />
                          </Tooltip>
                        </Link>
                      </Col>
                      <Col className="ShiftCard-shift-weapon-col" xs={6} sm={12}>
                        <Link to={'/stats/weapons?salmon=1#{0}'.format(this.props.shift.weapon4.mainWeapon.value)}>
                          <Tooltip title={<FormattedMessage id={this.props.shift.weapon4.mainWeapon.name} />}>
                            <img
                              className="ShiftCard-shift-weapon-img"
                              src={FileFolderUrl.SPLATNET + this.props.shift.weapon4.mainWeaponUrl}
                              alt="weapon4"
                            />
                          </Tooltip>
                        </Link>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            );
          }
        })()}
        <Meta
          className="ShiftCard-shift-meta"
          avatar={<img className="ShiftCard-shift-meta-image" src={icon} alt="icon" />}
          title={<FormattedMessage id="app.salmon_run" defaultMessage="Salmon Run" />}
          description={TimeConverter.formatShiftPeriod(this.props.shift.startTime, this.props.shift.endTime)}
        />
      </Card>
    );
  }
}

ShiftCard.defaultProps = {
  bordered: true,
  hoverable: true,
  pointer: false
};

export default ShiftCard;
