import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Modal,
  PageHeader,
  Descriptions,
  Tag,
  Progress,
  Tooltip,
  Table,
  Empty,
  Button,
  Row,
  Col,
  Card,
  Statistic,
  Icon
} from 'antd';

import './BattleModal.css';
import { OctolingsDeathIcon } from './CustomIcons';
import leagueIcon from '../assets/images/mode-league.png';
import privateIcon from '../assets/images/mode-private.png';
import turfWarIcon from '../assets/images/mode-regular.png';
import regularIcon from '../assets/images/mode-regular.png';
import splatfestIcon from '../assets/images/mode-splatfest.png';
import clamBlitzIcon from '../assets/images/rule-clam-blitz.png';
import rainmakerIcon from '../assets/images/rule-rainmaker.png';
import rankedIcon from '../assets/images/mode-ranked.png';
import splatZonesIcon from '../assets/images/rule-splat-zones.png';
import towerControlIcon from '../assets/images/rule-tower-control.png';
import { RankedBattle, RankedXBattle, LeagueBattle, SplatfestBattle } from '../models/Battle';
import { Mode, SplatfestMode } from '../models/Mode';
import { Style, RankedBattlePlayer } from '../models/Player';
import Rule from '../models/Rule';
import { Freshness, Badge } from '../models/Weapon';
import BattleHelper from '../utils/BattleHelper';
import FileFolderUrl from '../utils/FileFolderUrl';
import TimeConverter from '../utils/TimeConverter';

const { Column } = Table;

class BattleModal extends React.Component {
  state = {
    icons: []
  };

  modeIconSelector = mode => {
    switch (mode) {
      case Mode.regularBattle:
        return regularIcon;
      case Mode.rankedBattle:
        return rankedIcon;
      case Mode.leagueBattle:
        return leagueIcon;
      case Mode.privateBattle:
        return privateIcon;
      case Mode.splatfest:
        return splatfestIcon;
      default:
        throw new RangeError();
    }
  };

  ruleIconSelector = rule => {
    switch (rule) {
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

  getIcons = () => {
    if (this.props.value !== null) {
      let ids = [];
      let icons = [];
      this.props.value.myTeamMembers.forEach(element => {
        if (
          this.state.icons.find(ele => {
            return ele.id === element.id;
          }) === undefined
        ) {
          ids.push(element.id);
          icons.push(BattleHelper.getPlayerIcon(element.id));
        }
      });
      this.props.value.otherTeamMembers.forEach(element => {
        if (
          this.state.icons.find(ele => {
            return ele.id === element.id;
          }) === undefined
        ) {
          ids.push(element.id);
          icons.push(BattleHelper.getPlayerIcon(element.id));
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

  compare = (a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  sortPlayers = players => {
    const sortedPlayers = players.slice(0).sort((a, b) => {
      if (a instanceof RankedBattlePlayer) {
        const sort = 32 * this.compare(a.sort, b.sort);
        const killAndAssist = 16 * this.compare(a.killAndAssist, b.killAndAssist);
        const special = 8 * this.compare(a.special, b.special);
        const death = 4 * this.compare(a.death, b.death);
        const kill = 2 * this.compare(a.kill, b.kill);
        const nickname = this.compare(a.nickname, b.nickname);
        return -(sort + killAndAssist + special + death + kill + nickname);
      } else {
        const paint = 32 * this.compare(a.paint, b.paint);
        const killAndAssist = 16 * this.compare(a.killAndAssist, b.killAndAssist);
        const special = 8 * this.compare(a.special, b.special);
        const death = 4 * this.compare(a.death, b.death);
        const kill = 2 * this.compare(a.kill, b.kill);
        const nickname = this.compare(a.nickname, b.nickname);
        return -(paint + killAndAssist + special + death + kill + nickname);
      }
    });
    return sortedPlayers;
  };

  renderBattle() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="battle" defaultMessage="Battle" />} />
        <Descriptions bordered>
          <Descriptions.Item label={<FormattedMessage id="mode" defaultMessage="Mode" />} span={2}>
            <span className="BattleModal-battle-span">
              <img
                className="BattleModal-battle-icon"
                src={this.modeIconSelector(this.props.value.gameMode)}
                alt="mode"
              />
              <FormattedMessage id={this.props.value.gameMode.name} />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="rule" defaultMessage="Rule" />} span={2}>
            <span className="BattleModal-battle-span">
              <img className="BattleModal-battle-icon" src={this.ruleIconSelector(this.props.value.rule)} alt="rule" />
              <FormattedMessage id={this.props.value.rule.name} />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="stage" defaultMessage="Stage" />} span={3}>
            <div>
              <img
                className="BattleModal-battle-stage"
                src={FileFolderUrl.SPLATNET + this.props.value.stage.url}
                alt="stage"
              />
              <br />
              <FormattedMessage id={this.props.value.stage.stage.name} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="battle.result" defaultMessage="Result" />} span={3}>
            <span>
              {(() => {
                if (this.props.value.isWin) {
                  return (
                    <Tag color="magenta" key="result">
                      <FormattedMessage id="battle.win" defaultMessage="Win!" />
                    </Tag>
                  );
                } else {
                  return (
                    <Tag color="green" key="result">
                      <FormattedMessage id="battle.lose" defaultMessage="Lose.." />
                    </Tag>
                  );
                }
              })()}
              {(() => {
                if (this.props.value instanceof RankedBattle || this.props.value instanceof LeagueBattle) {
                  if (this.props.value.isKnockOut) {
                    return (
                      <Tag color="red" key="ko">
                        <FormattedMessage id="battle.knock_out" defaultMessage="KO BONUS!" />
                      </Tag>
                    );
                  }
                  if (this.props.value.isKnockedOut) {
                    return (
                      <Tag color="green" key="ko">
                        <FormattedMessage id="battle.knock_out" defaultMessage="KO BONUS!" />
                      </Tag>
                    );
                  }
                }
              })()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="battle.count" defaultMessage="Count" />} span={3}>
            <span className="BattleModal-battle-span">
              <Progress
                className="BattleModal-battle-progress"
                percent={(() => {
                  if (this.props.value.otherTeamCount === 0) {
                    return 100;
                  } else {
                    return (
                      (parseFloat(this.props.value.myTeamCount) /
                        (parseFloat(this.props.value.myTeamCount) + parseFloat(this.props.value.otherTeamCount))) *
                      100
                    );
                  }
                })()}
                showInfo={false}
                strokeLinecap="square"
              />
              {(() => {
                if (this.props.value.rule === Rule.turfWar) {
                  return (
                    <span>
                      <FormattedMessage
                        id="battle.count.percentage"
                        defaultMessage="{count}%"
                        values={{
                          count: this.props.value.myTeamCount
                        }}
                      />{' '}
                      -{' '}
                      <FormattedMessage
                        id="battle.count.percentage"
                        defaultMessage="{count}%"
                        values={{
                          count: this.props.value.otherTeamCount
                        }}
                      />
                    </span>
                  );
                } else {
                  return (
                    <span>
                      {this.props.value.myTeamCount} - {this.props.value.otherTeamCount}
                    </span>
                  );
                }
              })()}
            </span>
          </Descriptions.Item>
          {(() => {
            if (
              this.props.value instanceof RankedBattle &&
              !(this.props.value instanceof RankedXBattle) &&
              this.props.value.gameMode === Mode.rankedBattle
            ) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.ranked" defaultMessage="Power Level" />}
                  span={3}
                >
                  <span>{this.props.value.estimatedRankPower}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof RankedXBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.ranked.x" defaultMessage="X Power Level" />}
                  span={(() => {
                    if (this.props.value.isX) {
                      return 2;
                    } else {
                      return 3;
                    }
                  })()}
                >
                  <span>{this.props.value.estimatedXPower}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof RankedXBattle && this.props.value.isX) {
              return (
                <Descriptions.Item label={<FormattedMessage id="battle.power.x" defaultMessage="X Power" />} span={2}>
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating) {
                        return <FormattedMessage id="battle.power.calculating" defaultMessage="Calculating.." />;
                      } else {
                        return this.props.value.xPowerAfter;
                      }
                    })()}
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof LeagueBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.league.my" defaultMessage="My Team League Power" />}
                  span={2}
                >
                  <span>{this.props.value.myEstimatedLeaguePoint}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof LeagueBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.league.other" defaultMessage="Other Team League Power" />}
                  span={2}
                >
                  <span>{this.props.value.otherEstimatedLeaguePoint}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof LeagueBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.league.current" defaultMessage="Current League Power" />}
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating) {
                        return <FormattedMessage id="battle.power.calculating" defaultMessage="Calculating.." />;
                      } else {
                        if (this.props.value.leaguePoint === this.props.value.maxLeaguePoint) {
                          return <b>{this.props.value.leaguePoint}</b>;
                        } else {
                          return this.props.value.leaguePoint;
                        }
                      }
                    })()}
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof LeagueBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.league.highest" defaultMessage="Highest League Power" />}
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating) {
                        return <FormattedMessage id="battle.power.calculating" defaultMessage="Calculating.." />;
                      } else {
                        return this.props.value.maxLeaguePoint;
                      }
                    })()}
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof SplatfestBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.power.splatfest.my" defaultMessage="My Team Splatfest Power" />}
                  span={2}
                >
                  <span>{this.props.value.myEstimatedSplatfestPower}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof SplatfestBattle) {
              return (
                <Descriptions.Item
                  label={
                    <FormattedMessage id="battle.power.splatfest.other" defaultMessage="Other Team Splatfest Power" />
                  }
                  span={2}
                >
                  <span>{this.props.value.otherEstimatedSplatfestPower}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (
              this.props.value instanceof SplatfestBattle &&
              this.props.value.splatfestMode === SplatfestMode.challenge
            ) {
              return (
                <Descriptions.Item
                  label={
                    <FormattedMessage id="battle.power.splatfest.current" defaultMessage="Current Splatfest Power" />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating) {
                        return <FormattedMessage id="battle.power.calculating" defaultMessage="Calculating.." />;
                      } else {
                        if (this.props.value.splatfestPower === this.props.value.maxSplatfestPower) {
                          return <b>{this.props.value.splatfestPower}</b>;
                        } else {
                          return this.props.value.splatfestPower;
                        }
                      }
                    })()}
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (
              this.props.value instanceof SplatfestBattle &&
              this.props.value.splatfestMode === SplatfestMode.challenge
            ) {
              return (
                <Descriptions.Item
                  label={
                    <FormattedMessage id="battle.power.splatfest.highest" defaultMessage="Highest Splatfest Power" />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating) {
                        return <FormattedMessage id="battle.power.calculating" defaultMessage="Calculating.." />;
                      } else {
                        return this.props.value.maxSplatfestPower;
                      }
                    })()}
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof SplatfestBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.contribution" defaultMessage="Clout" />}
                  span={2}
                >
                  <span>{this.props.value.contributionPoint}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value instanceof SplatfestBattle) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="battle.contribution.total" defaultMessage="Total Clout" />}
                  span={2}
                >
                  <span>{this.props.value.totalContributionPoint}</span>
                </Descriptions.Item>
              );
            }
          })()}
          {(() => {
            if (this.props.value.gameMode === Mode.regularBattle) {
              return (
                <Descriptions.Item label={<FormattedMessage id="freshness" defaultMessage="Freshness" />} span={2}>
                  <span className="BattleModal-battle-span">
                    {this.props.value.winMeter}
                    {(() => {
                      const freshness = Freshness.parse(this.props.value.winMeter);
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
                  </span>
                </Descriptions.Item>
              );
            }
          })()}
          <Descriptions.Item
            label={<FormattedMessage id="battle.total_paint" defaultMessage="Ink Points" />}
            span={(() => {
              if (this.props.value.gameMode === Mode.regularBattle) {
                return 2;
              } else {
                return 4;
              }
            })()}
          >
            <span className="BasttleModal-battle-span">
              {this.props.value.totalPaint}
              {(() => {
                const badge = Badge.parse(this.props.value.totalPaint);
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
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="battle.level" defaultMessage="Level" />}
            span={(() => {
              if (this.props.value instanceof RankedBattle) {
                return 2;
              } else {
                return 4;
              }
            })()}
          >
            {(() => {
              if (this.props.value.isLevelAfterWithStar > this.props.value.selfPlayer.isLevelWithStar) {
                return (
                  <span>
                    <b>
                      {(() => {
                        if (this.props.value.selfPlayer.isLevelWithStar) {
                          return (
                            <span>
                              <Tooltip title={this.props.value.selfPlayer.level}>
                                <span className="BattleModal-battle-star">★</span>
                                {this.props.value.selfPlayer.levelWithStar}
                              </Tooltip>
                            </span>
                          );
                        } else {
                          return this.props.value.selfPlayer.levelWithStar;
                        }
                      })()}{' '}
                      →{' '}
                      {(() => {
                        if (this.props.value.isLevelAfterWithStar) {
                          return (
                            <span>
                              <Tooltip title={this.props.value.levelAfter}>
                                <span className="BattleModal-battle-star">★</span>
                                {this.props.value.levelAfterWithStar}
                              </Tooltip>
                            </span>
                          );
                        } else {
                          return this.props.value.levelAfterWithStar;
                        }
                      })()}
                    </b>
                  </span>
                );
              } else {
                return (
                  <span>
                    {(() => {
                      if (this.props.value.selfPlayer.isLevelWithStar) {
                        return (
                          <span>
                            <Tooltip title={this.props.value.selfPlayer.level}>
                              <span className="BattleModal-battle-star">★</span>
                              {this.props.value.selfPlayer.levelWithStar}
                            </Tooltip>
                          </span>
                        );
                      } else {
                        return this.props.value.selfPlayer.levelWithStar;
                      }
                    })()}{' '}
                    →{' '}
                    {(() => {
                      if (this.props.value.isLevelAfterWithStar) {
                        return (
                          <span>
                            <Tooltip title={this.props.value.levelAfter}>
                              <span className="BattleModal-battle-star">★</span>
                              {this.props.value.levelAfterWithStar}
                            </Tooltip>
                          </span>
                        );
                      } else {
                        return this.props.value.levelAfterWithStar;
                      }
                    })()}
                  </span>
                );
              }
            })()}
          </Descriptions.Item>
          {(() => {
            if (this.props.value instanceof RankedBattle) {
              return (
                <Descriptions.Item label={<FormattedMessage id="battle.rank" defaultMessage="Rank" />} span={2}>
                  {(() => {
                    if (this.props.value.rankAfter !== this.props.value.selfPlayer.rank) {
                      return (
                        <span>
                          <b>
                            <FormattedMessage id={this.props.value.selfPlayer.rank.name} /> →{' '}
                            <FormattedMessage id={this.props.value.rankAfter.name} />
                          </b>
                        </span>
                      );
                    } else {
                      return (
                        <span>
                          <FormattedMessage id={this.props.value.selfPlayer.rank.name} /> →{' '}
                          <FormattedMessage id={this.props.value.rankAfter.name} />
                        </span>
                      );
                    }
                  })()}
                </Descriptions.Item>
              );
            }
          })()}
          <Descriptions.Item label={<FormattedMessage id="battle.time.start" defaultMessage="Start Time" />} span={2}>
            {TimeConverter.formatResultStartTime(this.props.value.startTime)}
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="battle.time.elapsed" defaultMessage="Elapsed Time" />}
            span={2}
          >
            {TimeConverter.formatBattleElapsedTime(this.props.value.elapsedTime)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  renderTeamPlayers = (players, isMy) => {
    return (
      <Table
        dataSource={players}
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
        expandedRowRender={record => {
          let data = [];
          const headgear = record.headgearGear;
          headgear.key = 'headgear';
          const clothes = record.clothesGear;
          clothes.key = 'clothes';
          const shoes = record.shoesGear;
          shoes.key = 'shoes';
          data.push(headgear);
          data.push(clothes);
          data.push(shoes);
          return (
            <Table
              className="BattleModal-players-expand"
              dataSource={data}
              locale={{
                emptyText: (
                  <Empty
                    image={
                      <OctolingsDeathIcon
                        className="BattleModal-players-empty-icon"
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
                if (!record.isSelf) {
                  return () => {
                    return (
                      <Link to={'/battles?with={0}'.format(record.id)}>
                        <Button type="link">
                          <FormattedMessage
                            id="app.battles.with"
                            defaultMessage="Show battles with {name}"
                            values={{ name: record.nickname }}
                          />
                        </Button>
                      </Link>
                    );
                  };
                }
              })()}
            >
              <Column
                title={<FormattedMessage id="gear" defaultMessage="Gear" />}
                key="gear"
                align="center"
                render={text => {
                  return (
                    <Tooltip title={<FormattedMessage id={text.gear.name} />}>
                      <img className="BattleModal-players-icon" src={FileFolderUrl.SPLATNET + text.url} alt="gear" />
                    </Tooltip>
                  );
                }}
              />
              <Column
                title={<FormattedMessage id="brand" defaultMessage="Brand" />}
                key="brand"
                align="center"
                render={text => {
                  return (
                    <Tooltip title={<FormattedMessage id={text.brand.brand.name} />}>
                      <img
                        className="BattleModal-players-icon"
                        src={FileFolderUrl.SPLATNET + text.brand.url}
                        alt="brand"
                      />
                    </Tooltip>
                  );
                }}
              />
              <Column
                title={<FormattedMessage id="brand.favored_ability" defaultMessage="Favored Ability" />}
                key="favoredAbility"
                align="center"
                render={text => {
                  if (text.brand.favoredAbility !== null) {
                    return (
                      <Tooltip title={<FormattedMessage id={text.brand.favoredAbility.ability.name} />}>
                        <img
                          className="BattleModal-players-icon"
                          src={FileFolderUrl.SPLATNET + text.brand.favoredAbility.url}
                          alt="favored"
                        />
                      </Tooltip>
                    );
                  } else {
                    return (
                      <span>
                        <FormattedMessage id="ability.empty" defaultMessage="Empty" />
                      </span>
                    );
                  }
                }}
              />
              <Column
                title={<FormattedMessage id="ability.primary" defaultMessage="Primary Ability" />}
                key="primaryAbility"
                align="center"
                render={text => {
                  return (
                    <Tooltip title={<FormattedMessage id={text.primaryAbility.ability.name} />}>
                      <img
                        className="BattleModal-players-icon"
                        src={FileFolderUrl.SPLATNET + text.primaryAbility.url}
                        alt="primaryAbility"
                      />
                    </Tooltip>
                  );
                }}
              />
              <Column
                title={<FormattedMessage id="ability.secondary" defaultMessage="Secondary Ability" />}
                key="secondaryAbility"
                align="center"
                render={text => {
                  return (
                    <span>
                      {text.secondaryAbilities.map((element, index) => {
                        return (
                          <Tooltip title={<FormattedMessage id={element.ability.name} />} key={index}>
                            <img
                              className="BattleModal-players-icon"
                              src={FileFolderUrl.SPLATNET + element.url}
                              alt="secondaryAbility"
                              style={(() => {
                                if (index !== 0) {
                                  return { marginLeft: '8px' };
                                }
                              })()}
                            />
                          </Tooltip>
                        );
                      })}
                    </span>
                  );
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
              <span className="BattleModal-players-span">
                {(() => {
                  const icon = this.state.icons.find(element => {
                    return element.id === text.id;
                  });
                  if (icon !== undefined) {
                    return <img className="BattleModal-players-player-icon" src={icon.icon} alt="icon" />;
                  }
                })()}
                {text.nickname}
                {(() => {
                  if (text.isSelf) {
                    return (
                      <Tag className="BattleModal-players-tag" color="magenta" key="self">
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
                          <Tag className="BattleModal-players-tag" color="red" key="her">
                            <FormattedMessage id="player.her" defaultMessage="Her" />
                          </Tag>
                        );
                      case Style.boy:
                        return (
                          <Tag className="BattleModal-players-tag" color="blue" key="him">
                            <FormattedMessage id="player.him" defaultMessage="Him" />
                          </Tag>
                        );
                      default:
                        throw new RangeError();
                    }
                  }
                })()}
                {(() => {
                  if (text.isDisconnect) {
                    return (
                      <Tag className="BattleModal-players-tag" key="disconnect">
                        <FormattedMessage id="player.disconnect" defaultMessage="Disconnect" />
                      </Tag>
                    );
                  }
                })()}
              </span>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="weapon" defaultMessage="Weapon" />}
          key="weapon"
          align="center"
          render={text => {
            return (
              <span>
                <Tooltip title={<FormattedMessage id={text.weapon.mainWeapon.name} />}>
                  <img
                    className="BattleModal-players-icon"
                    src={FileFolderUrl.SPLATNET + text.weapon.mainWeaponUrl}
                    alt="main"
                  />
                </Tooltip>
                <Tooltip title={<FormattedMessage id={text.weapon.subWeapon.name} />}>
                  <img
                    className="BattleModal-players-icon"
                    src={(() => {
                      if (isMy) {
                        return FileFolderUrl.SPLATNET + text.weapon.subWeaponUrlA;
                      } else {
                        return FileFolderUrl.SPLATNET + text.weapon.subWeaponUrlB;
                      }
                    })()}
                    alt="sub"
                    style={{ marginLeft: '8px' }}
                  />
                </Tooltip>
                <Tooltip title={<FormattedMessage id={text.weapon.specialWeapon.name} />}>
                  <img
                    className="BattleModal-players-icon"
                    src={(() => {
                      if (isMy) {
                        return FileFolderUrl.SPLATNET + text.weapon.specialWeaponUrlA;
                      } else {
                        return FileFolderUrl.SPLATNET + text.weapon.specialWeaponUrlB;
                      }
                    })()}
                    alt="special"
                    style={{ marginLeft: '8px' }}
                  />
                </Tooltip>
              </span>
            );
          }}
        />
        {(() => {
          if (this.props.value.selfPlayer instanceof RankedBattlePlayer) {
            return (
              <Column
                title={<FormattedMessage id="rank" defaultMessage="Rank" />}
                key="rank"
                align="center"
                render={text => {
                  return (
                    <span>
                      <FormattedMessage id={text.rank.name} />
                    </span>
                  );
                }}
              />
            );
          }
        })()}
        <Column
          title={<FormattedMessage id="player.level" defaultMessage="Level" />}
          key="level"
          align="center"
          render={text => {
            return (
              <span>
                {(() => {
                  if (text.isLevelWithStar) {
                    return (
                      <span>
                        <Tooltip title={text.level}>
                          <span className="BattleModal-players-star">★</span>
                          {text.levelWithStar}
                        </Tooltip>
                      </span>
                    );
                  } else {
                    return text.levelWithStar;
                  }
                })()}
              </span>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="player.paint" defaultMessage="Ink" />}
          key="paint"
          align="center"
          dataIndex="paint"
        />
        <Column
          title={<FormattedMessage id="player.kill_and_death" defaultMessage="K / D" />}
          key="kill"
          align="center"
          render={text => {
            return (
              <Tooltip
                title={() => {
                  if (text.death === 0) {
                    return '99.99';
                  } else {
                    return (text.kill / text.death).toFixed(2);
                  }
                }}
              >
                <span>
                  {(() => {
                    if (text.kill > text.death) {
                      if (text.assist > 0) {
                        return <b>{'{0} ({1})'.format(text.killAndAssist, text.assist)}</b>;
                      } else {
                        return <b>{text.killAndAssist}</b>;
                      }
                    } else {
                      if (text.assist > 0) {
                        return '{0} ({1})'.format(text.killAndAssist, text.assist);
                      } else {
                        return text.killAndAssist;
                      }
                    }
                  })()}{' '}
                  /{' '}
                  {(() => {
                    if (text.death > text.kill) {
                      return <b>{text.death}</b>;
                    } else {
                      return text.death;
                    }
                  })()}
                </span>
              </Tooltip>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="player.special" defaultMessage="Special" />}
          key="special"
          align="center"
          dataIndex="special"
        />
      </Table>
    );
  };

  renderPlayers() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="players" defaultMessage="Players" />} />
        {(() => {
          if (this.props.value.isWin) {
            return (
              <div>
                {this.renderTeamPlayers(this.sortPlayers(this.props.value.myTeamMembers), true)}
                {this.renderTeamPlayers(this.sortPlayers(this.props.value.otherTeamMembers), false)}
              </div>
            );
          } else {
            return (
              <div>
                {this.renderTeamPlayers(this.sortPlayers(this.props.value.otherTeamMembers), false)}
                {this.renderTeamPlayers(this.sortPlayers(this.props.value.myTeamMembers), true)}
              </div>
            );
          }
        })()}
      </div>
    );
  }

  renderStatistics() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="app.battles.statistics" defaultMessage="Statistics" />} />
        <Row gutter={16}>
          <Col className="BattleModal-statistics-col" xs={24} sm={12}>
            <Card className="BattleModal-statistics-card" hoverable>
              <Statistic
                className="BattleModal-statistics-statistic"
                title={<FormattedMessage id="player.paint" defaultMessage="Paint" />}
                prefix={(() => {
                  if (this.props.value.myTeamPaint > this.props.value.otherTeamPaint) {
                    return <Icon type="caret-up" />;
                  } else if (this.props.value.myTeamPaint < this.props.value.otherTeamPaint) {
                    return <Icon type="caret-down" />;
                  }
                })()}
                value={'{0} - {1}'.format(this.props.value.myTeamPaint, this.props.value.otherTeamPaint)}
                valueStyle={(() => {
                  if (this.props.value.myTeamPaint > this.props.value.otherTeamPaint) {
                    return { color: '#eb2f96' };
                  } else if (this.props.value.myTeamPaint < this.props.value.otherTeamPaint) {
                    return { color: '#52c41a' };
                  }
                })()}
              />
            </Card>
          </Col>
          <Col className="BattleModal-statistics-col" xs={24} sm={12}>
            <Card className="BattleModal-statistics-card" hoverable>
              <Statistic
                className="BattleModal-statistics-statistic"
                title={<FormattedMessage id="player.kill" defaultMessage="Kill" />}
                prefix={(() => {
                  if (this.props.value.myTeamKill > this.props.value.otherTeamKill) {
                    return <Icon type="caret-up" />;
                  } else if (this.props.value.myTeamKill < this.props.value.otherTeamKill) {
                    return <Icon type="caret-down" />;
                  }
                })()}
                value={(() => {
                  let myTeamString = '';
                  if (this.props.value.myTeamAssist > 0) {
                    myTeamString = '{0} ({1})'.format(
                      this.props.value.myTeamKillAndAssist,
                      this.props.value.myTeamAssist
                    );
                  } else {
                    myTeamString = '{0}'.format(this.props.value.myTeamKillAndAssist);
                  }
                  let otherTeamString = '';
                  if (this.props.value.otherTeamAssist > 0) {
                    otherTeamString = '{0} ({1})'.format(
                      this.props.value.otherTeamKillAndAssist,
                      this.props.value.otherTeamAssist
                    );
                  } else {
                    otherTeamString = '{0}'.format(this.props.value.otherTeamKillAndAssist);
                  }
                  return '{0} - {1}'.format(myTeamString, otherTeamString);
                })()}
                valueStyle={(() => {
                  if (this.props.value.myTeamKill > this.props.value.otherTeamKill) {
                    return { color: '#eb2f96' };
                  } else if (this.props.value.myTeamKill < this.props.value.otherTeamKill) {
                    return { color: '#52c41a' };
                  }
                })()}
              />
            </Card>
          </Col>
          <Col className="BattleModal-statistics-col" xs={24} sm={12}>
            <Card className="BattleModal-statistics-card" hoverable>
              <Statistic
                className="BattleModal-statistics-statistic"
                title={<FormattedMessage id="player.death" defaultMessage="Death" />}
                prefix={(() => {
                  if (this.props.value.myTeamDeath > this.props.value.otherTeamDeath) {
                    return <Icon type="caret-up" />;
                  } else if (this.props.value.myTeamDeath < this.props.value.otherTeamDeath) {
                    return <Icon type="caret-down" />;
                  }
                })()}
                value={'{0} - {1}'.format(this.props.value.myTeamDeath, this.props.value.otherTeamDeath)}
                valueStyle={(() => {
                  if (this.props.value.myTeamDeath < this.props.value.otherTeamDeath) {
                    return { color: '#eb2f96' };
                  } else if (this.props.value.myTeamDeath > this.props.value.otherTeamDeath) {
                    return { color: '#52c41a' };
                  }
                })()}
              />
            </Card>
          </Col>
          <Col className="BattleModal-statistics-col" xs={24} sm={12}>
            <Card className="BattleModal-statistics-card" hoverable>
              <Statistic
                className="BattleModal-statistics-statistic"
                title={<FormattedMessage id="player.special" defaultMessage="Special" />}
                prefix={(() => {
                  if (this.props.value.myTeamSpecial > this.props.value.otherTeamSpecial) {
                    return <Icon type="caret-up" />;
                  } else if (this.props.value.myTeamSpecial < this.props.value.otherTeamSpecial) {
                    return <Icon type="caret-down" />;
                  }
                })()}
                value={'{0} - {1}'.format(this.props.value.myTeamSpecial, this.props.value.otherTeamSpecial)}
                valueStyle={(() => {
                  if (this.props.value.myTeamSpecial > this.props.value.otherTeamSpecial) {
                    return { color: '#eb2f96' };
                  } else if (this.props.value.myTeamSpecial < this.props.value.otherTeamSpecial) {
                    return { color: '#52c41a' };
                  }
                })()}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <Modal
        title={(() => {
          return (
            <span>
              <FormattedMessage id="battle" defaultMessage="Battle" />{' '}
              <FormattedMessage
                id="battle.id"
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
            return this.renderBattle();
          }
        })()}
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderPlayers();
          }
        })()}
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderStatistics();
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

BattleModal.defaultProps = { visible: false, footer: null, width: 800, highlightPlayer: null };

export default BattleModal;
