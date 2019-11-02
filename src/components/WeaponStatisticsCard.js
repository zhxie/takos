import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Descriptions, Row, Col, Tooltip, Progress, Tag } from 'antd';

import './WeaponStatisticsCard.css';
import { Freshness, Badge } from '../models/Weapon';
import FileFolderUrl from '../utils/FileFolderUrl';

class WeaponStatisticsCard extends React.Component {
  render() {
    return (
      <Card hoverable bordered={false} bodyStyle={{ padding: 0 }} style={{ cursor: 'default' }}>
        <Descriptions bordered style={this.props.style} column={4}>
          <Descriptions.Item label={<FormattedMessage id="weapon" defaultMessage="Weapon" />} span={4}>
            <span>
              <Tooltip title={<FormattedMessage id={this.props.weapon.weapon.mainWeapon.name} />}>
                <img
                  className="WeaponStatisticsCard-img"
                  src={FileFolderUrl.SPLATNET + this.props.weapon.weapon.mainWeaponUrl}
                  alt="main"
                />
              </Tooltip>
              {(() => {
                if (!this.props.weapon.isSalmonRun) {
                  return (
                    <Tooltip title={<FormattedMessage id={this.props.weapon.weapon.subWeapon.name} />}>
                      <img
                        className="WeaponStatisticsCard-img-adj"
                        src={FileFolderUrl.SPLATNET + this.props.weapon.weapon.subWeaponUrlA}
                        alt="sub"
                      />
                    </Tooltip>
                  );
                }
              })()}
              {(() => {
                if (!this.props.weapon.isSalmonRun) {
                  return (
                    <Tooltip title={<FormattedMessage id={this.props.weapon.weapon.specialWeapon.name} />}>
                      <img
                        className="WeaponStatisticsCard-img-adj"
                        src={FileFolderUrl.SPLATNET + this.props.weapon.weapon.specialWeaponUrlA}
                        alt="special"
                      />
                    </Tooltip>
                  );
                }
              })()}
            </span>
          </Descriptions.Item>
          {(() => {
            if (!this.props.weapon.isSalmonRun) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="app.weapons.win_ratio" defaultMessage="Win Ratio" />}
                  span={4}
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Tooltip
                        title={(() => {
                          let ratio = 0;
                          if (this.props.weapon.win + this.props.weapon.lose > 0) {
                            ratio = this.props.weapon.win / (this.props.weapon.win + this.props.weapon.lose);
                          }
                          return ratio.toFixed(2);
                        })()}
                      >
                        <Progress
                          percent={(() => {
                            if (this.props.weapon.win + this.props.weapon.lose > 0) {
                              return (this.props.weapon.win / (this.props.weapon.win + this.props.weapon.lose)) * 100;
                            } else {
                              return 0;
                            }
                          })()}
                          showInfo={false}
                          strokeColor="#eb2f96"
                        />
                      </Tooltip>
                    </Col>
                    <Col span={12}>
                      {this.props.weapon.win} - {this.props.weapon.lose}
                    </Col>
                  </Row>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (!this.props.weapon.isSalmonRun) {
              return (
                <Descriptions.Item label={<FormattedMessage id="freshness" defaultMessage="Freshness" />} span={4}>
                  {this.props.weapon.winMeter}
                  {(() => {
                    const freshness = Freshness.parse(this.props.weapon.winMeter);
                    switch (freshness) {
                      case Freshness.dry:
                        return (
                          <Tag style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.raw:
                        return (
                          <Tag color="green" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.fresh:
                        return (
                          <Tag color="volcano" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.superfresh:
                      case Freshness.superfresh2:
                        return (
                          <Tag color="cyan" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.superfresh3:
                        return (
                          <Tag color="gold" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      default:
                        throw new RangeError();
                    }
                  })()}
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (!this.props.weapon.isSalmonRun) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="freshness.max" defaultMessage="Max Freshness" />}
                  span={4}
                >
                  {this.props.weapon.maxWinMeter}
                  {(() => {
                    const freshness = Freshness.parse(this.props.weapon.maxWinMeter);
                    switch (freshness) {
                      case Freshness.dry:
                        return (
                          <Tag style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.raw:
                        return (
                          <Tag color="green" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.fresh:
                        return (
                          <Tag color="volcano" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.superfresh:
                      case Freshness.superfresh2:
                        return (
                          <Tag color="cyan" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      case Freshness.superfresh3:
                        return (
                          <Tag color="gold" style={{ marginLeft: '8px' }}>
                            <FormattedMessage id={freshness.name} />
                          </Tag>
                        );
                      default:
                        throw new RangeError();
                    }
                  })()}
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (!this.props.weapon.isSalmonRun) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.total_paint" defaultMessage="Ink Points" />}
                  span={4}
                >
                  {this.props.weapon.totalPaint}
                  {(() => {
                    const badge = Badge.parse(this.props.weapon.totalPaint);
                    switch (badge) {
                      case Badge.noBadge:
                        break;
                      case Badge.red:
                        return (
                          <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                            <Tag color="red" style={{ marginLeft: '8px' }}>
                              <FormattedMessage id={badge.name} />
                            </Tag>
                          </Tooltip>
                        );
                      case Badge.bronze:
                        return (
                          <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                            <Tag color="volcano" style={{ marginLeft: '8px' }}>
                              <FormattedMessage id={badge.name} />
                            </Tag>
                          </Tooltip>
                        );
                      case Badge.silver:
                        return (
                          <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                            <Tag color="cyan" style={{ marginLeft: '8px' }}>
                              <FormattedMessage id={badge.name} />
                            </Tag>
                          </Tooltip>
                        );
                      case Badge.gold:
                        return (
                          <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                            <Tag color="gold" style={{ marginLeft: '8px' }}>
                              <FormattedMessage id={badge.name} />
                            </Tag>
                          </Tooltip>
                        );
                      default:
                        throw new RangeError();
                    }
                  })()}
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.weapon.isSalmonRun) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="app.weapons.clear_ratio" defaultMessage="Clear Ratio" />}
                  span={4}
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Tooltip
                        title={(() => {
                          let ratio = 0;
                          if (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut > 0) {
                            ratio =
                              this.props.weapon.clear /
                              (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut);
                          }
                          return ratio.toFixed(2);
                        })()}
                      >
                        <Progress
                          percent={(() => {
                            if (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut > 0) {
                              return (
                                (this.props.weapon.clear /
                                  (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut)) *
                                100
                              );
                            } else {
                              return 0;
                            }
                          })()}
                          showInfo={false}
                          strokeColor="#fa8c16"
                        />
                      </Tooltip>
                    </Col>
                    <Col span={12}>
                      {this.props.weapon.clear} - {this.props.weapon.timeLimit + this.props.weapon.wipeOut}
                      {(() => {
                        if (this.props.weapon.timeLimit + this.props.weapon.wipeOut > 0) {
                          return (
                            <span>
                              {' '}
                              (
                              <FormattedMessage id="job_result.time_limit.abbreviation" defaultMessage="Time Up" />{' '}
                              <Tooltip
                                title={(
                                  this.props.weapon.timeLimit /
                                  (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut)
                                ).toFixed(2)}
                              >
                                {this.props.weapon.timeLimit}
                              </Tooltip>{' '}
                              / <FormattedMessage id="job_result.wipe_out.abbreviation" defaultMessage="DEFEAT" />{' '}
                              <Tooltip
                                title={(
                                  this.props.weapon.wipeOut /
                                  (this.props.weapon.clear + this.props.weapon.timeLimit + this.props.weapon.wipeOut)
                                ).toFixed(2)}
                              >
                                {this.props.weapon.wipeOut}
                              </Tooltip>
                              )
                            </span>
                          );
                        }
                      })()}
                    </Col>
                  </Row>
                </Descriptions.Item>
              );
            }
          })()}
        </Descriptions>
      </Card>
    );
  }
}

export default WeaponStatisticsCard;
