import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Modal, PageHeader, Descriptions, Tag, Progress, Tooltip, Table, Empty, Button, Divider } from 'antd';

import './JobModal.css';
import { OctolingsDeathIcon } from './CustomIcons';
import goldenEggIcon from '../assets/images/salmon-run-golden-egg.png';
import powerEggIcon from '../assets/images/salmon-run-power-egg.png';
import drizzlerIcon from '../assets/images/salmoniod-drizzler.png';
import flyfishIcon from '../assets/images/salmoniod-flyfish.png';
import goldieIcon from '../assets/images/salmoniod-goldie.png';
import grillerIcon from '../assets/images/salmoniod-griller.png';
import mawsIcon from '../assets/images/salmoniod-maws.png';
import scrapperIcon from '../assets/images/salmoniod-scrapper.png';
import steelEelIcon from '../assets/images/salmoniod-steel-eel.png';
import steelheadIcon from '../assets/images/salmoniod-steelhead.png';
import stingerIcon from '../assets/images/salmoniod-stinger.png';
import { WaterLevel } from '../models/Job';
import { Style } from '../models/Player';
import Salmoniod from '../models/Salmoniod';
import FileFolderUrl from '../utils/FileFolderUrl';
import JobHelper from '../utils/JobHelper';
import TimeConverter from '../utils/TimeConverter';

const { Column } = Table;

class JobModal extends React.Component {
  state = {
    icons: []
  };

  getIcons = () => {
    if (this.props.value !== null) {
      let ids = [];
      let icons = [];
      this.props.value.players.forEach(element => {
        if (
          this.state.icons.find(ele => {
            return ele.id === element.id;
          }) === undefined
        ) {
          ids.push(element.id);
          icons.push(JobHelper.getPlayerIcon(element.id));
        }
      });
      Promise.all(icons)
        .then(values => {
          let result = this.state.icons;
          for (let i = 0; i < values.length; ++i) {
            result.push({ id: ids[i], icon: values[i] });
          }
          this.setState({ icons: result });
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  iconSelector = salmoniod => {
    switch (salmoniod) {
      case Salmoniod.goldie:
        return goldieIcon;
      case Salmoniod.steelhead:
        return steelheadIcon;
      case Salmoniod.flyfish:
        return flyfishIcon;
      case Salmoniod.scrapper:
        return scrapperIcon;
      case Salmoniod.steelEel:
        return steelEelIcon;
      case Salmoniod.stinger:
        return stingerIcon;
      case Salmoniod.maws:
        return mawsIcon;
      case Salmoniod.griller:
        return grillerIcon;
      case Salmoniod.drizzler:
        return drizzlerIcon;
      default:
        throw new RangeError();
    }
  };

  renderJob() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="job" defaultMessage="Job" />} />
        <Descriptions bordered>
          <Descriptions.Item label={<FormattedMessage id="stage" defaultMessage="Stage" />} span={3}>
            <div>
              <img
                className="JobModal-job-stage"
                src={FileFolderUrl.SPLATNET + this.props.value.shift.stage.url}
                alt="stage"
              />
              <br />
              <FormattedMessage id={this.props.value.shift.stage.stage.name} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="job.supplied_weapons" defaultMessage="Supplied Weapons" />}
            span={3}
          >
            <span>
              <Tooltip title={<FormattedMessage id={this.props.value.shift.weapon1.mainWeapon.name} />}>
                <img
                  className="JobModal-job-weapon-image"
                  src={FileFolderUrl.SPLATNET + this.props.value.shift.weapon1.mainWeaponUrl}
                  alt="weapon1"
                />
              </Tooltip>
              <Tooltip title={<FormattedMessage id={this.props.value.shift.weapon2.mainWeapon.name} />}>
                <img
                  className="JobModal-job-weapon-image-adj"
                  src={FileFolderUrl.SPLATNET + this.props.value.shift.weapon2.mainWeaponUrl}
                  alt="weapon1"
                />
              </Tooltip>
              <Tooltip title={<FormattedMessage id={this.props.value.shift.weapon3.mainWeapon.name} />}>
                <img
                  className="JobModal-job-weapon-image-adj"
                  src={FileFolderUrl.SPLATNET + this.props.value.shift.weapon3.mainWeaponUrl}
                  alt="weapon1"
                />
              </Tooltip>
              <Tooltip title={<FormattedMessage id={this.props.value.shift.weapon4.mainWeapon.name} />}>
                <img
                  className="JobModal-job-weapon-image-adj"
                  src={FileFolderUrl.SPLATNET + this.props.value.shift.weapon4.mainWeaponUrl}
                  alt="weapon1"
                />
              </Tooltip>
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="job.result" defaultMessage="Result" />} span={3}>
            <span>
              {(() => {
                if (this.props.value.isClear) {
                  return (
                    <Tag color="green" key="result">
                      <FormattedMessage id={this.props.value.result.name} />
                    </Tag>
                  );
                } else {
                  return (
                    <span>
                      <Tag color="orange" key="fail">
                        <FormattedMessage id="job_result.defeat" defaultMessage="Defeat" />
                      </Tag>
                      <Tag color="orange" key="result">
                        <FormattedMessage id={this.props.value.result.name} />
                      </Tag>
                    </span>
                  );
                }
              })()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="job.hazard_level" defaultMessage="Hazard Level" />} span={3}>
            <span>
              {(() => {
                if (this.props.value.hazardLevel >= 200) {
                  return (
                    <span className="JobModal-job-span">
                      <Progress
                        className="JobModal-job-progress"
                        percent={100}
                        showInfo={false}
                        strokeColor="#fa541c"
                      />
                      <FormattedMessage id="job.hazard_level.max" defaultMessage="Hazard Level MAX!!" />
                    </span>
                  );
                } else {
                  return (
                    <span className="JobModal-job-span">
                      <Progress
                        className="JobModal-job-progress"
                        percent={(this.props.value.hazardLevel / 200) * 100}
                        showInfo={false}
                        strokeColor="#fa8c16"
                      />
                      <FormattedMessage
                        id="job.hazard_level.value"
                        defaultMessage="{value}%"
                        values={{
                          value: this.props.value.hazardLevel
                        }}
                      />
                    </span>
                  );
                }
              })()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <img className="JobModal-job-icon" src={goldenEggIcon} alt="goldenEgg" />
                <FormattedMessage id="job.golden_egg" defaultMessage="Golden Egg" />
              </span>
            }
            span={2}
          >
            {this.props.value.goldenEgg}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <img className="JobModal-job-icon" src={powerEggIcon} alt="powerEgg" />
                <FormattedMessage id="job.power_egg" defaultMessage="Power Egg" />
              </span>
            }
            span={2}
          >
            {this.props.value.powerEgg}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="job.score" defaultMessage="Score" />} span={2}>
            {this.props.value.score}
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="job.grizzco_points" defaultMessage="Grizzco Points" />}
            span={2}
          >
            {this.props.value.grizzcoPoint}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="grade" defaultMessage="Rank" />} span={2}>
            <span>
              {(() => {
                if (this.props.value.gradePointDelta !== 0) {
                  return (
                    <span>
                      <b>
                        {(() => {
                          return <FormattedMessage id={this.props.value.grade.name} />;
                        })()}{' '}
                        / {this.props.value.gradePoint}
                      </b>
                      {(() => {
                        if (this.props.value.gradePointDelta > 0) {
                          return (
                            <Tag className="JobModal-job-tag" color="orange" key="result">
                              <FormattedMessage id="grade.up" defaultMessage="You Got a Raise!'" />
                            </Tag>
                          );
                        } else {
                          return (
                            <Tag className="JobModal-job-tag" color="orange" key="result">
                              <FormattedMessage id="grade.down" defaultMessage="Pay Cut.." />
                            </Tag>
                          );
                        }
                      })()}
                    </span>
                  );
                } else {
                  return (
                    <span>
                      {(() => {
                        return <FormattedMessage id={this.props.value.grade.name} />;
                      })()}{' '}
                      / {this.props.value.gradePoint}
                    </span>
                  );
                }
              })()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="job.rate" defaultMessage="Pay Grade" />} span={2}>
            <FormattedMessage
              id="job.rate.value"
              defaultMessage="{value}%"
              values={{
                value: this.props.value.rate
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="job.time.start" defaultMessage="Start Time" />} span={3}>
            {TimeConverter.formatResultStartTime(this.props.value.startTime)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  renderWaves() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="job.wave" defaultMessage="WAVE" />} />
        <Table
          dataSource={this.props.value.waves}
          locale={{
            emptyText: (
              <Empty
                image={
                  <OctolingsDeathIcon
                    style={{
                      margin: '20px 0',
                      width: '8em',
                      fill: '#fafafa',
                      stroke: '#e1e1e1',
                      strokeWidth: '0.5px'
                    }}
                  />
                }
              />
            )
          }}
          scroll={{ x: 'max-content' }}
          pagination={false}
        >
          <Column
            title={<FormattedMessage id="job.wave.index.prefix" defaultMessage="#" />}
            key="wave"
            align="center"
            render={(text, record, index) => {
              return (
                <FormattedMessage
                  id="job.wave.index"
                  defaultMessage="WAVE {index}"
                  values={{
                    index: index + 1
                  }}
                />
              );
            }}
          />
          <Column
            title={<FormattedMessage id="job.wave.result" defaultMessage="Result" />}
            key="result"
            align="center"
            render={text => {
              if (text.isClear) {
                return (
                  <Tag className="JobModal-waves-tag" color="green" key="result">
                    <FormattedMessage id="job_result.clear" defaultMessage="Clear!" />
                  </Tag>
                );
              } else {
                return (
                  <Tag className="JobModal-waves-tag" color="orange" key="fail">
                    <FormattedMessage id="job_result.defeat" defaultMessage="Defeat" />
                  </Tag>
                );
              }
            }}
          />
          <Column
            title={<FormattedMessage id="water_level" defaultMessage="Water Level" />}
            key="waterLevel"
            align="center"
            render={text => {
              return (
                <Tooltip title={<FormattedMessage id={text.waterLevel.name} />}>
                  <Progress
                    className="JobModal-wave-progress"
                    percent={(() => {
                      switch (text.waterLevel) {
                        case WaterLevel.normal:
                          return 60;
                        case WaterLevel.low:
                          return 20;
                        case WaterLevel.high:
                          return 100;
                        default:
                          throw new RangeError();
                      }
                    })()}
                    showInfo={false}
                    strokeColor="#fa8c16"
                  />
                </Tooltip>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="event_type" defaultMessage="Event Type" />}
            key="eventType"
            align="center"
            render={text => {
              return <FormattedMessage id={text.eventType.name} />;
            }}
          />
          <Column
            title={<FormattedMessage id="job.golden_egg.quota" defaultMessage="Quota" />}
            key="quota"
            align="center"
            dataIndex="quota"
          />
          <Column
            title={<FormattedMessage id="job.golden_egg" defaultMessage="Golden Egg" />}
            key="goldenEgg"
            align="center"
            dataIndex="goldenEgg"
          />
          <Column
            title={<FormattedMessage id="job.golden_egg.pop" defaultMessage="Appearances" />}
            key="goldenEggPop"
            align="center"
            dataIndex="goldenEggPop"
          />
          <Column
            title={<FormattedMessage id="job.power_egg" defaultMessage="Power Egg" />}
            key="powerEgg"
            align="center"
            dataIndex="powerEgg"
          />
        </Table>
      </div>
    );
  }

  renderPlayers() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="players" defaultMessage="Players" />} />
        <Table
          dataSource={this.props.value.players}
          locale={{
            emptyText: (
              <Empty
                image={
                  <OctolingsDeathIcon
                    style={{
                      margin: '20px 0',
                      width: '8em',
                      fill: '#fafafa',
                      stroke: '#e1e1e1',
                      strokeWidth: '0.5px'
                    }}
                  />
                }
              />
            )
          }}
          scroll={{ x: 'max-content' }}
          pagination={false}
          expandRowByClick={true}
          expandedRowRender={(record, index) => {
            return (
              <Table
                className="JobModal-players-expand"
                dataSource={record.bossSalmoniodKills.filter(
                  element => this.props.value.getBossSalmoniodKill(element.salmoniod) !== 0
                )}
                locale={{
                  emptyText: (
                    <Empty
                      image={
                        <OctolingsDeathIcon
                          style={{
                            margin: '20px 0',
                            width: '8em',
                            fill: '#fafafa',
                            stroke: '#e1e1e1'
                          }}
                        />
                      }
                    />
                  )
                }}
                scroll={{ x: 'max-content' }}
                pagination={false}
                footer={(() => {
                  if (index !== 0) {
                    return () => {
                      return (
                        <span>
                          <Link to={'/jobs?with={0}'.format(record.id)}>
                            <Button type="link">
                              <FormattedMessage
                                id="app.jobs.with"
                                defaultMessage="Show jobs with {name}"
                                values={{ name: record.nickname }}
                              />
                            </Button>
                          </Link>
                          <Divider type="vertical" />
                          <Link to={'/stats/jobs?with={0}'.format(record.id)}>
                            <Button type="link">
                              <FormattedMessage id="app.statistics" defaultMessage="Statistics" />
                            </Button>
                          </Link>
                          <Divider type="vertical" />
                          <Link to={'/battles?with={0}'.format(record.id)}>
                            <Button type="link">
                              <FormattedMessage
                                id="app.battles.with"
                                defaultMessage="Show battles with {name}"
                                values={{ name: record.nickname }}
                              />
                            </Button>
                          </Link>
                          <Divider type="vertical" />
                          <Link to={'/stats/battles?with={0}'.format(record.id)}>
                            <Button type="link">
                              <FormattedMessage id="app.statistics" defaultMessage="Statistics" />
                            </Button>
                          </Link>
                        </span>
                      );
                    };
                  }
                })()}
              >
                <Column
                  title={<FormattedMessage id="salmoniod" defaultMessage="Salmoniod" />}
                  key="salmoniod"
                  align="center"
                  render={text => {
                    return (
                      <span>
                        <img
                          className="JobModal-players-expand-icon"
                          src={this.iconSelector(text.salmoniod)}
                          alt="salmoniod"
                        />
                        <FormattedMessage id={text.salmoniod.name} />
                      </span>
                    );
                  }}
                />
                <Column
                  title={<FormattedMessage id="player.salmoniod.kill_ratio" defaultMessage="Splat Ratio" />}
                  key="killRatio"
                  align="center"
                  render={text => {
                    const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
                    const appearance = this.props.value.bossSalmoniodAppearances.find(element => {
                      return element.salmoniod === text.salmoniod;
                    }).appearance;
                    let ratio = 0;
                    if (kill !== 0) {
                      ratio = text.kill / kill;
                    }
                    let ratio2 = 0;
                    if (appearance !== 0) {
                      ratio2 = kill / appearance;
                    }
                    let ratio3 = 0;
                    if (appearance !== 0) {
                      ratio3 = text.kill / appearance;
                    }
                    return (
                      <Tooltip title={ratio.toFixed(2)}>
                        <Progress
                          className="JobModal-players-progress"
                          percent={ratio2 * 100}
                          successPercent={ratio3 * 100}
                          showInfo={false}
                          strokeColor="#fa8c16"
                        />
                      </Tooltip>
                    );
                  }}
                />
                <Column
                  title={<FormattedMessage id="player.salmoniod.kill" defaultMessage="Player's Splat" />}
                  key="thisKill"
                  align="center"
                  render={text => {
                    const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
                    if (kill === text.kill) {
                      return <b>{text.kill}</b>;
                    } else {
                      return text.kill;
                    }
                  }}
                />
                <Column
                  title={<FormattedMessage id="job.salmoniod.kill" defaultMessage="Splat" />}
                  key="kill"
                  align="center"
                  render={text => {
                    const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
                    const appearance = this.props.value.bossSalmoniodAppearances.find(element => {
                      return element.salmoniod === text.salmoniod;
                    }).appearance;
                    if (kill === text.kill || kill === appearance) {
                      return <b>{kill}</b>;
                    } else {
                      return kill;
                    }
                  }}
                />
                <Column
                  title={<FormattedMessage id="job.salmoniod.appearance" defaultMessage="Appearances" />}
                  key="appearance"
                  align="center"
                  render={text => {
                    const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
                    const appearance = this.props.value.bossSalmoniodAppearances.find(element => {
                      return element.salmoniod === text.salmoniod;
                    }).appearance;
                    if (kill === appearance) {
                      return <b>{appearance}</b>;
                    } else {
                      return appearance;
                    }
                  }}
                />
              </Table>
            );
          }}
        >
          <Column
            title={<FormattedMessage id="player.nickname" defaultMessage="Nickname" />}
            key="nickname"
            align="center"
            render={text => {
              return (
                <span className="JobModal-players-span">
                  {(() => {
                    const icon = this.state.icons.find(element => {
                      return element.id === text.id;
                    });
                    if (icon !== undefined) {
                      return <img className="JobModal-players-player-icon" src={icon.icon} alt="icon" />;
                    }
                  })()}
                  {text.nickname}
                  {(() => {
                    if (text.isSelf) {
                      return (
                        <Tag className="JobModal-players-tag" color="magenta" key="self">
                          <FormattedMessage id="player.you" defaultMessage="You" />
                        </Tag>
                      );
                    }
                  })()}
                  {(() => {
                    if (text.id === this.props.highlightPlayer) {
                      switch (text.style) {
                        case Style.girl:
                          return (
                            <Tag className="JobModal-players-tag" color="red" key="her">
                              <FormattedMessage id="player.her" defaultMessage="Her" />
                            </Tag>
                          );
                        case Style.boy:
                          return (
                            <Tag className="JobModal-players-tag" color="blue" key="him">
                              <FormattedMessage id="player.him" defaultMessage="Him" />
                            </Tag>
                          );
                        default:
                          throw new RangeError();
                      }
                    }
                  })()}
                </span>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="weapons" defaultMessage="Weapons" />}
            key="weapons"
            align="center"
            render={text => {
              return text.weapons.map((element, index) => {
                if (index === 0) {
                  return (
                    <Tooltip key={index} title={<FormattedMessage id={element.mainWeapon.name} />}>
                      <img
                        className="JobModal-players-icon"
                        src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                        alt="main"
                      />
                    </Tooltip>
                  );
                } else {
                  return (
                    <Tooltip key={index} title={<FormattedMessage id={element.mainWeapon.name} />}>
                      <img
                        className="JobModal-players-icon-adj"
                        src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                        alt="main"
                      />
                    </Tooltip>
                  );
                }
              });
            }}
          />
          <Column
            title={<FormattedMessage id="weapon.special" defaultMessage="Special Weapon" />}
            key="specialWeapon"
            align="center"
            render={text => {
              return (
                <Tooltip title={<FormattedMessage id={text.specialWeapon.specialWeapon.name} />}>
                  <img
                    className="JobModal-players-icon"
                    src={FileFolderUrl.SPLATNET + text.specialWeapon.specialWeaponUrlA}
                    alt="special"
                  />
                </Tooltip>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="player.special_use" defaultMessage="Special Use" />}
            key="specialUse"
            align="center"
            render={text => {
              let str = '';
              let use = 0;
              text.specialCounts.forEach((element, index) => {
                if (index === 0) {
                  str = str + element;
                } else {
                  str = str + ' - ' + element;
                }
                use = use + element;
              });
              if (use === 2) {
                return <b>{str}</b>;
              } else {
                return str;
              }
            }}
          />
          <Column
            title={<FormattedMessage id="player.golden_egg" defaultMessage="Golden Egg" />}
            key="goldenEgg"
            align="center"
            dataIndex="goldenEgg"
          />
          <Column
            title={<FormattedMessage id="player.power_egg" defaultMessage="Power Egg" />}
            key="powerEgg"
            align="center"
            dataIndex="powerEgg"
          />
          <Column
            title={<FormattedMessage id="player.kill" defaultMessage="Splat" />}
            key="kill"
            align="center"
            dataIndex="kill"
          />
          <Column
            title={<FormattedMessage id="player.help" defaultMessage="Help" />}
            key="help"
            align="center"
            dataIndex="help"
          />
          <Column
            title={<FormattedMessage id="player.death" defaultMessage="Death" />}
            key="death"
            align="center"
            dataIndex="death"
          />
        </Table>
      </div>
    );
  }

  renderSalmoniods() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="salmoniods" defaultMessage="Salmoniods" />} />
        <Table
          dataSource={this.props.value.bossSalmoniodAppearances.filter(element => element.appearance !== 0)}
          locale={{
            emptyText: (
              <Empty
                image={
                  <OctolingsDeathIcon
                    style={{
                      margin: '20px 0',
                      width: '8em',
                      fill: '#fafafa',
                      stroke: '#e1e1e1',
                      strokeWidth: '0.5px'
                    }}
                  />
                }
              />
            )
          }}
          scroll={{ x: 'max-content' }}
          pagination={false}
        >
          <Column
            title={<FormattedMessage id="salmoniod" defaultMessage="Salmoniod" />}
            key="salmoniod"
            align="center"
            render={text => {
              return (
                <span>
                  <img className="JobModal-salmoniods-icon" src={this.iconSelector(text.salmoniod)} alt="salmoniod" />
                  <FormattedMessage id={text.salmoniod.name} />
                </span>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="job.salmoniod.kill_ratio" defaultMessage="Splat Ratio" />}
            key="killRatio"
            align="center"
            render={text => {
              const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
              const appearance = text.appearance;
              let ratio = 0;
              if (appearance !== 0) {
                ratio = kill / appearance;
              }
              return (
                <Tooltip title={ratio.toFixed(2)}>
                  <Progress
                    className="JobModal-salmoniods-progress"
                    percent={ratio * 100}
                    showInfo={false}
                    strokeColor="#fa8c16"
                  />
                </Tooltip>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="job.salmoniod.kill" defaultMessage="Splat" />}
            key="kill"
            align="center"
            render={text => {
              const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
              if (kill === text.appearance) {
                return <b>{kill}</b>;
              } else {
                return kill;
              }
            }}
          />
          <Column
            title={<FormattedMessage id="job.salmoniod.appearance_ratio" defaultMessage="Appearance Ratio" />}
            key="appearanceRatio"
            align="center"
            render={text => {
              const appearance = text.appearance;
              const totalAppearance = this.props.value.appearances;
              let ratio = 0;
              if (totalAppearance !== 0) {
                ratio = appearance / totalAppearance;
              }
              return (
                <Tooltip title={ratio.toFixed(2)}>
                  <Progress
                    className="JobModal-salmoniods-progress"
                    percent={ratio * 100}
                    showInfo={false}
                    strokeColor="#fa8c16"
                  />
                </Tooltip>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="job.salmoniod.appearance" defaultMessage="Appearances" />}
            key="appearance"
            align="center"
            render={text => {
              const kill = this.props.value.getBossSalmoniodKill(text.salmoniod);
              if (kill === text.appearance) {
                return <b>{text.appearance}</b>;
              } else {
                return text.appearance;
              }
            }}
          />
        </Table>
      </div>
    );
  }

  render() {
    return (
      <Modal
        title={(() => {
          return (
            <span>
              <FormattedMessage id="job" defaultMessage="Job" />{' '}
              <FormattedMessage
                id="job.id"
                defaultMessage="#{id}"
                values={{
                  id: (() => {
                    if (this.props.value === undefined || this.props.value === null) {
                      return '';
                    } else {
                      return this.props.value.number.toString();
                    }
                  })()
                }}
              />
            </span>
          );
        })()}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={this.props.footer}
        column={2}
        width={this.props.width}
        centered
      >
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderJob();
          }
        })()}
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderWaves();
          }
        })()}
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderPlayers();
          }
        })()}
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderSalmoniods();
          }
        })()}
      </Modal>
    );
  }

  componentDidMount() {
    this.getIcons();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.getIcons();
    }
  }
}

JobModal.defaultProps = { visible: false, footer: null, width: 800, highlightPlayer: null };

export default JobModal;
