import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, PageHeader, Descriptions, Tag, Progress, Tooltip, Table, Empty, Collapse } from 'antd';

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
import { RankedBattlePlayer } from '../models/Player';
import Rule from '../models/Rule';
import { Freshness, Badge } from '../models/Weapon';
import { SPLATNET } from '../utils/FileFolderUrl';
import TimeConverter from '../utils/TimeConverter';

const { Column } = Table;
const { Panel } = Collapse;

class BattleModal extends React.Component {
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
        const killAndAssist = 16 * this.compare(a.killAndAssist(), b.killAndAssist());
        const special = 8 * this.compare(a.special, b.special);
        const death = 4 * this.compare(a.death, b.death);
        const kill = 2 * this.compare(a.kill, b.kill);
        const nickname = this.compare(a.nickname, b.nickname);
        return -(sort + killAndAssist + special + death + kill + nickname);
      } else {
        const paint = 32 * this.compare(a.paint, b.paint);
        const killAndAssist = 16 * this.compare(a.killAndAssist(), b.killAndAssist());
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
        <PageHeader title={<FormattedMessage id="app.battle" defaultMessage="Battle" />} />
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
              <img className="BattleModal-battle-stage" src={SPLATNET + this.props.value.stage.url} alt="stage" />
              <br />
              <FormattedMessage id={this.props.value.stage.stage.name} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="app.battle.result" defaultMessage="Result" />} span={3}>
            <span>
              {(() => {
                if (this.props.value.isWin()) {
                  return (
                    <Tag color="magenta" key="result">
                      <FormattedMessage id="app.battle.win" defaultMessage="Win!" />
                    </Tag>
                  );
                } else {
                  return (
                    <Tag color="green" key="result">
                      <FormattedMessage id="app.battle.lose" defaultMessage="Lose.." />
                    </Tag>
                  );
                }
              })()}
              {(() => {
                if (this.props.value instanceof RankedBattle || this.props.value instanceof LeagueBattle) {
                  if (this.props.value.isKnockOut()) {
                    return (
                      <Tag color="red" key="ko">
                        <FormattedMessage id="app.battle.knock_out" defaultMessage="KO BONUS!" />
                      </Tag>
                    );
                  }
                  if (this.props.value.isKnockedOut()) {
                    return (
                      <Tag color="green" key="ko">
                        <FormattedMessage id="app.battle.knock_out" defaultMessage="KO BONUS!" />
                      </Tag>
                    );
                  }
                }
              })()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="app.battle.count" defaultMessage="Count" />} span={3}>
            <span className="BattleModal-battle-span">
              <Progress
                className="BattlesModal-battle-progress"
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
              {this.props.value.myTeamCount} - {this.props.value.otherTeamCount}
            </span>
          </Descriptions.Item>
          {(() => {
            if (this.props.value instanceof RankedBattle && !(this.props.value instanceof RankedXBattle)) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="app.battle.power_level" defaultMessage="Power Level" />}
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
                  label={<FormattedMessage id="app.battle.x_power_level" defaultMessage="X Power Level" />}
                  span={(() => {
                    if (this.props.value.isX()) {
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
            if (this.props.value instanceof RankedXBattle && this.props.value.isX()) {
              return (
                <Descriptions.Item
                  label={<FormattedMessage id="app.battle.x_power" defaultMessage="X Power" />}
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating()) {
                        return <FormattedMessage id="app.battle.calculating" defaultMessage="Calculating.." />;
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
                  label={
                    <FormattedMessage id="app.battle.my_team_league_power" defaultMessage="My Team League Power" />
                  }
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
                  label={
                    <FormattedMessage
                      id="app.battle.other_team_league_power"
                      defaultMessage="Other Team League Power"
                    />
                  }
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
                  label={
                    <FormattedMessage id="app.battle.current_league_power" defaultMessage="Current League Power" />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating()) {
                        return <FormattedMessage id="app.battle.calculating" defaultMessage="Calculating.." />;
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
                  label={
                    <FormattedMessage id="app.battle.highest_league_power" defaultMessage="Highest League Power" />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating()) {
                        return <FormattedMessage id="app.battle.calculating" defaultMessage="Calculating.." />;
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
                  label={
                    <FormattedMessage
                      id="app.battle.my_team_splatfest_power"
                      defaultMessage="My Team Splatfest Power"
                    />
                  }
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
                    <FormattedMessage
                      id="app.battle.other_team_splatfest_power"
                      defaultMessage="Other Team Splatfest Power"
                    />
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
                    <FormattedMessage
                      id="app.battle.current_splatfest_power"
                      defaultMessage="Current Splatfest Power"
                    />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating()) {
                        return <FormattedMessage id="app.battle.calculating" defaultMessage="Calculating.." />;
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
                    <FormattedMessage
                      id="app.battle.highest_splatfest_power"
                      defaultMessage="Highest Splatfest Power"
                    />
                  }
                  span={2}
                >
                  <span>
                    {(() => {
                      if (this.props.value.isCalculating()) {
                        return <FormattedMessage id="app.battle.calculating" defaultMessage="Calculating.." />;
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
                            <Tag className="BattleMoal-battle-tag-adjacent">
                              <FormattedMessage id={freshness.name} />
                            </Tag>
                          );
                        case Freshness.raw:
                          return (
                            <Tag className="BattleMoal-battle-tag-adjacent" color="green">
                              <FormattedMessage id={freshness.name} />
                            </Tag>
                          );
                        case Freshness.fresh:
                          return (
                            <Tag className="BattleMoal-battle-tag-adjacent" color="volcano">
                              <FormattedMessage id={freshness.name} />
                            </Tag>
                          );
                        case Freshness.superfresh:
                        case Freshness.superfresh2:
                          return (
                            <Tag className="BattleMoal-battle-tag-adjacent" color="cyan">
                              <FormattedMessage id={freshness.name} />
                            </Tag>
                          );
                        case Freshness.superfresh3:
                          return (
                            <Tag className="BattleMoal-battle-tag-adjacent" color="gold">
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
            label={<FormattedMessage id="app.battle.total_paint" defaultMessage="Ink Points" />}
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
                        <Tag className="BattleMoal-battle-tag-adjacent" color="red">
                          <FormattedMessage id={badge.name} />
                        </Tag>
                      </Tooltip>
                    );
                  case Badge.bronze:
                    return (
                      <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                        <Tag className="BattleMoal-battle-tag-adjacent" color="volcano">
                          <FormattedMessage id={badge.name} />
                        </Tag>
                      </Tooltip>
                    );
                  case Badge.silver:
                    return (
                      <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                        <Tag className="BattleMoal-battle-tag-adjacent" color="cyan">
                          <FormattedMessage id={badge.name} />
                        </Tag>
                      </Tooltip>
                    );
                  case Badge.gold:
                    return (
                      <Tooltip title={<FormattedMessage id="badge" defaultMessage="Weapon Badge" />}>
                        <Tag className="BattleMoal-battle-tag-adjacent" color="gold">
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
            label={<FormattedMessage id="app.battle.level" defaultMessage="Level" />}
            span={(() => {
              if (this.props.value instanceof RankedBattle) {
                return 2;
              } else {
                return 4;
              }
            })()}
          >
            {(() => {
              if (this.props.value.isLevelAfterWithStar() > this.props.value.selfPlayer().isLevelWithStar) {
                return (
                  <span>
                    <b>
                      {(() => {
                        if (this.props.value.selfPlayer().isLevelWithStar()) {
                          return (
                            <span>
                              <Tooltip title={this.props.value.selfPlayer().level}>
                                <span className="BattleModal-battle-star">★</span>
                                {this.props.value.selfPlayer().levelWithStar()}
                              </Tooltip>
                            </span>
                          );
                        } else {
                          return this.props.value.selfPlayer().levelWithStar();
                        }
                      })()}{' '}
                      →{' '}
                      {(() => {
                        if (this.props.value.isLevelAfterWithStar()) {
                          return (
                            <span>
                              <Tooltip title={this.props.value.levelAfter}>
                                <span className="BattleModal-battle-star">★</span>
                                {this.props.value.levelAfterWithStar()}
                              </Tooltip>
                            </span>
                          );
                        } else {
                          return this.props.value.levelAfterWithStar();
                        }
                      })()}
                    </b>
                  </span>
                );
              } else {
                return (
                  <span>
                    {(() => {
                      if (this.props.value.selfPlayer().isLevelWithStar()) {
                        return (
                          <span>
                            <Tooltip title={this.props.value.selfPlayer().level}>
                              <span className="BattleModal-battle-star">★</span>
                              {this.props.value.selfPlayer().levelWithStar()}
                            </Tooltip>
                          </span>
                        );
                      } else {
                        return this.props.value.selfPlayer().levelWithStar();
                      }
                    })()}{' '}
                    →{' '}
                    {(() => {
                      if (this.props.value.isLevelAfterWithStar()) {
                        return (
                          <span>
                            <Tooltip title={this.props.value.levelAfter}>
                              <span className="BattleModal-battle-star">★</span>
                              {this.props.value.levelAfterWithStar()}
                            </Tooltip>
                          </span>
                        );
                      } else {
                        return this.props.value.levelAfterWithStar();
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
                <Descriptions.Item label={<FormattedMessage id="app.battle.rank" defaultMessage="Rank" />} span={2}>
                  {(() => {
                    if (this.props.value.rankAfter !== this.props.value.selfPlayer().rank) {
                      return (
                        <span>
                          <b>
                            <FormattedMessage id={this.props.value.selfPlayer().rank.name} /> →{' '}
                            <FormattedMessage id={this.props.value.rankAfter.name} />
                          </b>
                        </span>
                      );
                    } else {
                      return (
                        <span>
                          <FormattedMessage id={this.props.value.selfPlayer().rank.name} /> →{' '}
                          <FormattedMessage id={this.props.value.rankAfter.name} />
                        </span>
                      );
                    }
                  })()}
                </Descriptions.Item>
              );
            }
          })()}
          <Descriptions.Item
            label={<FormattedMessage id="app.battle.start_time" defaultMessage="Start Time" />}
            span={2}
          >
            {TimeConverter.formatStartTime(this.props.value.startTime)}
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="app.battle.elapsed_time" defaultMessage="Elapsed Time" />}
            span={2}
          >
            {TimeConverter.formatElapsedTime(this.props.value.elapsedTime)}
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
            <Table dataSource={data} scroll={{ x: 'max-content' }} pagination={false}>
              <Column
                title={<FormattedMessage id="gear" defaultMessage="Gear" />}
                key="gear"
                align="center"
                render={text => {
                  return (
                    <Tooltip title={<FormattedMessage id={text.gear.name} />}>
                      <img className="BattleModal-players-icon" src={SPLATNET + text.url} alt="gear" />
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
                      <img className="BattleModal-players-icon" src={SPLATNET + text.brand.url} alt="brand" />
                    </Tooltip>
                  );
                }}
              />
              <Column
                title={<FormattedMessage id="app.battle.brand.favored_ability" defaultMessage="Favored Ability" />}
                key="favoredAbility"
                align="center"
                render={text => {
                  if (text.brand.favoredAbility !== null) {
                    return (
                      <Tooltip title={<FormattedMessage id={text.brand.favoredAbility.ability.name} />}>
                        <img
                          className="BattleModal-players-icon"
                          src={SPLATNET + text.brand.favoredAbility.url}
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
                        src={SPLATNET + text.primaryAbility.url}
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
                              className={(() => {
                                if (index === 0) {
                                  return 'BattleModal-players-icon';
                                } else {
                                  return 'BattleModal-players-icon-adjacent';
                                }
                              })()}
                              src={SPLATNET + element.url}
                              alt="secondaryAbility"
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
          title={<FormattedMessage id="app.battle.player.nickname" defaultMessage="Nickname" />}
          key="nickname"
          align="center"
          render={text => {
            return (
              <span className="BattleModal-players-span">
                <img className="BattleModal-players-player-icon" src={text.url} alt="icon" />
                {text.nickname}
                {(() => {
                  if (text.isSelf) {
                    return (
                      <Tag className="BattleModal-players-tag" color="magenta" key="self">
                        <FormattedMessage id="app.battle.player.you" defaultMessage="You" />
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
                  <img className="BattleModal-players-icon" src={SPLATNET + text.weapon.mainWeaponUrl} alt="main" />
                </Tooltip>
                <Tooltip title={<FormattedMessage id={text.weapon.subWeapon.name} />}>
                  <img
                    className="BattleModal-players-icon-adjacent"
                    src={(() => {
                      if (isMy) {
                        return SPLATNET + text.weapon.subWeaponUrlA;
                      } else {
                        return SPLATNET + text.weapon.subWeaponUrlB;
                      }
                    })()}
                    alt="sub"
                  />
                </Tooltip>
                <Tooltip title={<FormattedMessage id={text.weapon.specialWeapon.name} />}>
                  <img
                    className="BattleModal-players-icon-adjacent"
                    src={(() => {
                      if (isMy) {
                        return SPLATNET + text.weapon.specialWeaponUrlA;
                      } else {
                        return SPLATNET + text.weapon.specialWeaponUrlB;
                      }
                    })()}
                    alt="special"
                  />
                </Tooltip>
              </span>
            );
          }}
        />
        {(() => {
          if (this.props.value.selfPlayer() instanceof RankedBattlePlayer) {
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
          title={<FormattedMessage id="app.battle.player.level" defaultMessage="Level" />}
          key="level"
          align="center"
          render={text => {
            return (
              <span>
                {(() => {
                  if (text.isLevelWithStar()) {
                    return (
                      <span>
                        <Tooltip title={text.level}>
                          <span className="BattleModal-players-star">★</span>
                          {text.levelWithStar()}
                        </Tooltip>
                      </span>
                    );
                  } else {
                    return text.levelWithStar();
                  }
                })()}
              </span>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="app.battle.player.paint" defaultMessage="Ink" />}
          key="paint"
          align="center"
          dataIndex="paint"
        />
        <Column
          title={<FormattedMessage id="app.battle.player.kill_and_death" defaultMessage="K / D" />}
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
                        return <b>{'{0} ({1})'.format(text.killAndAssist(), text.assist)}</b>;
                      } else {
                        return <b>{text.killAndAssist()}</b>;
                      }
                    } else {
                      if (text.assist > 0) {
                        return '{0} ({1})'.format(text.killAndAssist(), text.assist);
                      } else {
                        return text.killAndAssist();
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
          title={<FormattedMessage id="app.battle.player.special" defaultMessage="Special" />}
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
        <PageHeader title={<FormattedMessage id="app.battle.players" defaultMessage="Players" />} />
        {(() => {
          if (this.props.value.isWin()) {
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

  renderShare() {
    return (
      <div>
        <PageHeader title={<FormattedMessage id="app.share" defaultMessage="Share" />} />
        <Collapse>
          <Panel header={<FormattedMessage id="app.battle" defaultMessage="Battle" />} key="battle">
            <img src={this.props.value.url} alt="battle" style={{ width: '100%' }} />
          </Panel>
        </Collapse>
      </div>
    );
  }

  render() {
    return (
      <Modal
        title={(() => {
          return (
            <span>
              <FormattedMessage id="app.battle" defaultMessage="Battle" />{' '}
              <FormattedMessage
                id="app.battle.id"
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
        footer={null}
        column={2}
        width="800px"
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
            return this.renderShare();
          }
        })()}
      </Modal>
    );
  }
}

BattleModal.defaultProps = { visible: false };

export default BattleModal;
