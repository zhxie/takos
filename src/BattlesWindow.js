import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { PageHeader, Alert, Button, Table, Tag, Tooltip, Empty, Progress, Modal, Icon } from 'antd';

import './BattlesWindow.css';
import leagueIcon from './assets/images/mode-league.png';
import privateIcon from './assets/images/mode-private.png';
import rankedIcon from './assets/images/mode-ranked.png';
import regularIcon from './assets/images/mode-regular.png';
import turfWarIcon from './assets/images/mode-regular.png';
import splatfestIcon from './assets/images/mode-splatfest.png';
import clamBlitzIcon from './assets/images/rule-clam-blitz.png';
import rainmakerIcon from './assets/images/rule-rainmaker.png';
import splatZonesIcon from './assets/images/rule-splat-zones.png';
import towerControlIcon from './assets/images/rule-tower-control.png';
import { OctolingsDeathIcon } from './components/CustomIcons';
import BattleModal from './components/BattleModal';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import WindowLayout from './components/WindowLayout';
import { RankedBattle, LeagueBattle, SplatfestBattle } from './models/Battle';
import { Mode } from './models/Mode';
import Rule from './models/Rule';
import { Stage } from './models/Stage';
import { MainWeapon, SubWeapon, SpecialWeapon } from './models/Weapon';
import BattleHelper from './utils/BattleHelper';
import TakosError from './utils/ErrorHelper';
import FileFolderUrl from './utils/FileFolderUrl';
import StorageHelper from './utils/StorageHelper';
import TimeConverter from './utils/TimeConverter';

const { Column } = Table;
const { confirm } = Modal;

class BattlesWindow extends React.Component {
  state = {
    // Data
    data: [],
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    updateCurrent: 0,
    updateTotal: 0,
    updated: false,
    showBattleId: null,
    search: null
  };

  constructor(props) {
    super(props);
    if (this.props.location.hash !== '') {
      this.state.showBattleId = parseInt(this.props.location.hash.replace('#', ''));
    } else {
      this.state.showBattleId = null;
    }
    if (this.props.location.search !== '') {
      this.state.search = queryString.parse(this.props.location.search);
    } else {
      this.state.search = null;
    }
  }

  modeIconSelector = (mode) => {
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

  ruleIconSelector = (rule) => {
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

  updateBattles = () => {
    // TODO: this method should be extracted
    const getBattleRecursively = (from, to) => {
      return BattleHelper.getBattle(from)
        .then((res) => {
          if (res.error !== null) {
            // Handle previous error
            if (res.error === 'not_found') {
              return;
            } else {
              throw new TakosError(res.error);
            }
          } else {
            return StorageHelper.addBattle(res);
          }
        })
        .then((res) => {
          if (res instanceof TakosError) {
            throw res;
          } else {
            this.setState({ updateCurrent: this.state.updateCurrent + 1 });
            if (from < to) {
              return getBattleRecursively(from + 1, to);
            }
          }
        })
        .catch((e) => {
          if (e instanceof TakosError) {
            return e;
          } else {
            console.error(e);
            return new TakosError('can_not_get_battle');
          }
        });
    };

    this.setState({
      loaded: false,
      error: false,
      updateCurrent: 0,
      updateTotal: 0,
      updated: false
    });
    StorageHelper.latestBattle()
      .then((res) => {
        if (res === -1) {
          throw new TakosError('can_not_get_the_latest_battle_from_database');
        } else {
          return res;
        }
      })
      .then((res) => {
        const currentNumber = res;
        return BattleHelper.getTheLatestBattleNumber().then((res) => {
          if (res === 0) {
            throw new TakosError('can_not_get_battles');
          } else {
            const from = Math.max(1, res - 49, currentNumber + 1);
            const to = res;
            return { from, to };
          }
        });
      })
      .then((res) => {
        if (res.to >= res.from) {
          this.setState({ updateCurrent: 1, updateTotal: res.to - res.from + 1 });
        } else {
          this.setState({ updateTotal: -1 });
          return this.getBattles();
        }
        return getBattleRecursively(res.from, res.to).then((res) => {
          if (res instanceof TakosError) {
            throw res;
          } else {
            this.setState({ updateTotal: -1 });
            return this.getBattles();
          }
        });
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch((e) => {
        this.setState({ updateTotal: -1 });
        this.getBattles()
          .then(() => {
            if (e instanceof TakosError) {
              this.setState({ error: true, errorLog: e.message, updated: true });
            } else {
              console.error(e);
              this.setState({
                error: true,
                errorLog: 'can_not_update_battles',
                updated: true
              });
            }
          })
          .catch();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  getBattles = () => {
    // Every item in list should own an unique key property
    return StorageHelper.battles()
      .then((res) => {
        res.forEach((element) => {
          element.key = element.number;
          element.myTeamMembers.forEach((element) => {
            element.key = element.id;
          });
          element.otherTeamMembers.forEach((element) => {
            element.key = element.id;
          });
        });
        this.setState({
          data: res
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  filteredBattles = () => {
    if (this.state.search === null) {
      return this.state.data;
    } else {
      let data = this.state.data;
      if (this.state.search.with !== undefined) {
        data = data.filter((element) => {
          let isWith = false;
          if (
            element.myTeamMembers.find((ele) => {
              return ele.id === this.state.search.with;
            }) !== undefined
          ) {
            isWith = true;
          }
          if (
            element.otherTeamMembers.find((ele) => {
              return ele.id === this.state.search.with;
            }) !== undefined
          ) {
            isWith = true;
          }
          return isWith;
        });
      }
      return data;
    }
  };

  showBattle = (number) => {
    if (this.state.data instanceof Array) {
      const battle = this.state.data.find((element) => {
        return element.number === number;
      });
      if (battle !== undefined) {
        let buttons = [];
        buttons.push(
          <Button key="delete" type="danger" onClick={this.deleteBattle.bind(this, number)}>
            <FormattedMessage id="app.battles.delete" defaultMessage="Delete Battle" />
          </Button>
        );
        const filteredBattles = this.filteredBattles();
        let toButtons = [];
        // Find previous battle
        let previous = 0;
        filteredBattles.forEach((element) => {
          if (element.number > previous && element.number < number) {
            previous = element.number;
          }
        });
        if (previous > 0) {
          toButtons.push(
            <Button
              key="previous"
              onClick={() => {
                window.location.hash = '/battles{0}#'.format(this.props.location.search) + previous;
              }}
            >
              <Icon type="left" />
              <FormattedMessage
                id="app.battles.previous"
                defaultMessage="Previous Battle #{id}"
                values={{ id: previous }}
              />
            </Button>
          );
        }
        // Find next battle
        let next = Number.MAX_SAFE_INTEGER;
        filteredBattles.forEach((element) => {
          if (element.number < next && element.number > number) {
            next = element.number;
          }
        });
        if (next < Number.MAX_SAFE_INTEGER) {
          toButtons.push(
            <Button
              key="next"
              onClick={() => {
                window.location.hash = '/battles{0}#'.format(this.props.location.search) + next;
              }}
            >
              <FormattedMessage id="app.battles.next" defaultMessage="Next Battle #{id}" values={{ id: next }} />
              <Icon type="right" />
            </Button>
          );
        }
        if (toButtons.length > 0) {
          buttons.push(
            <Button.Group key="group" style={{ marginLeft: '8px' }}>
              {toButtons.map((element) => {
                return element;
              })}
            </Button.Group>
          );
        }
        return { battle, buttons };
      } else {
        return null;
      }
    }
  };

  hideBattle = () => {
    // Modify hash to hide battle
    window.location.hash = '/battles' + this.props.location.search;
  };

  deleteBattle = (number) => {
    const thisHandler = this;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.delete_battle',
        defaultMessage: 'Do you want to delete battle?'
      }),
      content: this.props.intl.formatMessage({
        id: 'app.modal.confirm.delete_battle.content',
        defaultMessage:
          'Once the battle is deleted, you will not be able to undo. It is recommended that you first backup the data.'
      }),
      okType: 'danger',
      autoFocusButton: 'cancel',
      icon: <Icon type="exclamation-circle" />,
      onOk() {
        StorageHelper.removeBattle(number)
          .then((res) => {
            if (res instanceof TakosError) {
              throw res;
            } else {
              thisHandler.setState({
                data: [],
                loaded: false,
                error: false,
                showBattleId: null,
                updateCurrent: 0,
                updateTotal: 0,
                updated: false
              });
              // Modify hash
              window.location.hash = '/battles' + thisHandler.props.location.search;
            }
          })
          .catch((e) => {
            if (e instanceof TakosError) {
              thisHandler.setState({ error: true, errorLog: e.message, updated: true });
            } else {
              console.error(e);
              thisHandler.setState({ error: true, errorLog: 'unknown_error', updated: true });
            }
          });
      },
      onCancel() {}
    });
  };

  renderContent = () => {
    return (
      <div>
        {(() => {
          if (this.state.updated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.battles_can_not_update"
                    defaultMessage="Takos can not update battles, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        {(() => {
          if (this.state.search !== null) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.battles_filtered"
                    defaultMessage="The battles shown have been filtered, please click <l>here</l> to cancel the screening."
                    values={{
                      l: (msg) => <Link to="/battles">{msg}</Link>
                    }}
                  />
                }
                type="info"
                showIcon
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        <div>
          <PageHeader
            title={<FormattedMessage id="app.battles" defaultMessage="Battles" />}
            subTitle={(() => {
              return (
                <Button type="default" onClick={this.updateBattles}>
                  <FormattedMessage id="app.battles.update" defaultMessage="Update Data" />
                </Button>
              );
            })()}
          />
          <Table
            dataSource={this.filteredBattles()}
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
            onRow={(record) => {
              return {
                onClick: () => {
                  window.location.hash = '/battles{0}#'.format(this.props.location.search) + record.number;
                }
              };
            }}
          >
            <Column
              title={<FormattedMessage id="battle.id.prefix" defaultMessage="#" />}
              key="id"
              align="center"
              dataIndex="number"
              sorter={(a, b) => a.number - b.number}
              sortDirections={['descend', 'ascend']}
              defaultSortOrder="descend"
            />
            <Column
              title={<FormattedMessage id="battle.result" defaultMessage="Result" />}
              key="result"
              align="center"
              render={(text) => {
                return (
                  <span>
                    <Tooltip
                      title={() => {
                        if (text.rule === Rule.turfWar) {
                          return (
                            <span>
                              <FormattedMessage
                                id="battle.count.percentage"
                                defaultMessage="{count}%"
                                values={{
                                  count: text.myTeamCount
                                }}
                              />{' '}
                              -{' '}
                              <FormattedMessage
                                id="battle.count.percentage"
                                defaultMessage="{count}%"
                                values={{
                                  count: text.otherTeamCount
                                }}
                              />
                            </span>
                          );
                        } else {
                          return '{0} - {1}'.format(text.myTeamCount, text.otherTeamCount);
                        }
                      }}
                    >
                      {(() => {
                        if (text.isWin) {
                          return (
                            <Tag className="BattlesWindow-content-tag" color="magenta" key="result">
                              <FormattedMessage id="battle.win" defaultMessage="Win!" />
                            </Tag>
                          );
                        } else {
                          return (
                            <Tag className="BattlesWindow-content-tag" color="green" key="result">
                              <FormattedMessage id="battle.lose" defaultMessage="Lose.." />
                            </Tag>
                          );
                        }
                      })()}
                    </Tooltip>
                    {(() => {
                      if (text instanceof RankedBattle || text instanceof LeagueBattle) {
                        if (text.isKnockOut) {
                          return (
                            <Tooltip
                              title={() => {
                                return TimeConverter.formatBattleKoElapsedTime(text.elapsedTime);
                              }}
                            >
                              <Tag className="BattlesWindow-content-tag-adj" color="red" key="ko">
                                <FormattedMessage id="battle.knock_out" defaultMessage="KO BONUS!" />
                              </Tag>
                            </Tooltip>
                          );
                        }
                        if (text.isKnockedOut) {
                          return (
                            <Tooltip
                              title={() => {
                                return TimeConverter.formatBattleKoElapsedTime(text.elapsedTime);
                              }}
                            >
                              <Tag className="BattlesWindow-content-tag-adj" color="green" key="ko">
                                <FormattedMessage id="battle.knock_out" defaultMessage="KO BONUS!" />
                              </Tag>
                            </Tooltip>
                          );
                        }
                      }
                    })()}
                  </span>
                );
              }}
            />
            {(() => {
              if (!StorageHelper.useSimpleLists()) {
                return (
                  <Column
                    title={<FormattedMessage id="battle.count" defaultMessage="Count" />}
                    key="count"
                    align="center"
                    render={(text) => {
                      return (
                        <span>
                          <Tooltip
                            title={() => {
                              return '{0} - {1}'.format(text.myTeamCount, text.otherTeamCount);
                            }}
                          >
                            {(() => {
                              if (text.isWin) {
                                return (
                                  <Progress
                                    className="BattlesWindow-content-table-progress-win"
                                    percent={(() => {
                                      if (text.otherTeamCount === 0) {
                                        return 100;
                                      } else {
                                        return (
                                          (parseFloat(text.myTeamCount) /
                                            (parseFloat(text.myTeamCount) + parseFloat(text.otherTeamCount))) *
                                          100
                                        );
                                      }
                                    })()}
                                    size="small"
                                    showInfo={false}
                                    strokeLinecap="square"
                                  />
                                );
                              } else {
                                return (
                                  <Progress
                                    className="BattlesWindow-content-table-progress-lose"
                                    percent={(() => {
                                      if (text.otherTeamCount === 0) {
                                        return 100;
                                      } else {
                                        return (
                                          (parseFloat(text.myTeamCount) /
                                            (parseFloat(text.myTeamCount) + parseFloat(text.otherTeamCount))) *
                                          100
                                        );
                                      }
                                    })()}
                                    size="small"
                                    showInfo={false}
                                    strokeLinecap="square"
                                  />
                                );
                              }
                            })()}
                          </Tooltip>
                        </span>
                      );
                    }}
                  />
                );
              }
            })()}
            <Column
              title={<FormattedMessage id="mode" defaultMessage="Mode" />}
              key="mode"
              align="center"
              render={(text) => (
                <Tooltip title={<FormattedMessage id={text.gameMode.name} />}>
                  <span>
                    <img
                      className="BattlesWindow-content-table-icon"
                      src={this.modeIconSelector(text.gameMode)}
                      alt="mode"
                    />
                  </span>
                </Tooltip>
              )}
              filters={[
                {
                  text: <FormattedMessage id={Mode.regularBattle.name} />,
                  value: Mode.regularBattle.value
                },
                {
                  text: <FormattedMessage id={Mode.rankedBattle.name} />,
                  value: Mode.rankedBattle.value
                },
                {
                  text: <FormattedMessage id={Mode.leagueBattle.name} />,
                  value: Mode.leagueBattle.value
                },
                {
                  text: <FormattedMessage id={Mode.privateBattle.name} />,
                  value: Mode.privateBattle.value
                },
                {
                  text: <FormattedMessage id={Mode.splatfest.name} />,
                  value: Mode.splatfest.value
                }
              ]}
              onFilter={(value, record) => {
                return record.gameMode.value === value;
              }}
            />
            <Column
              title={<FormattedMessage id="rule" defaultMessage="Rule" />}
              key="rule"
              align="center"
              render={(text) => (
                <Tooltip title={<FormattedMessage id={text.rule.name} />}>
                  <span>
                    <img
                      className="BattlesWindow-content-table-icon"
                      src={this.ruleIconSelector(text.rule)}
                      alt="rule"
                    />
                  </span>
                </Tooltip>
              )}
              filters={[
                {
                  text: <FormattedMessage id={Rule.turfWar.name} />,
                  value: Rule.turfWar.value
                },
                {
                  text: <FormattedMessage id={Rule.splatZones.name} />,
                  value: Rule.splatZones.value
                },
                {
                  text: <FormattedMessage id={Rule.towerControl.name} />,
                  value: Rule.towerControl.value
                },
                {
                  text: <FormattedMessage id={Rule.rainmaker.name} />,
                  value: Rule.rainmaker.value
                },
                {
                  text: <FormattedMessage id={Rule.clamBlitz.name} />,
                  value: Rule.clamBlitz.value
                }
              ]}
              onFilter={(value, record) => {
                return record.rule.value === value;
              }}
            />
            <Column
              title={<FormattedMessage id="battle.level_and_rank" defaultMessage="Level / Rank" />}
              key="levelAndRank"
              align="center"
              render={(text) => {
                return (
                  <span>
                    {(() => {
                      if (text.levelAfterWithStar > text.selfPlayer.levelWithStar) {
                        if (text.isLevelAfterWithStar) {
                          return (
                            <b>
                              <Tooltip title={text.levelAfter}>
                                <span className="BattlesWindow-content-table-star">★</span>
                                {text.levelAfterWithStar}
                              </Tooltip>
                            </b>
                          );
                        } else {
                          return <b>{text.levelAfterWithStar}</b>;
                        }
                      } else {
                        if (text.isLevelAfterWithStar) {
                          return (
                            <span>
                              <Tooltip title={text.levelAfter}>
                                <span className="BattlesWindow-content-table-star">★</span>
                                {text.levelAfterWithStar}
                              </Tooltip>
                            </span>
                          );
                        } else {
                          return text.levelAfterWithStar;
                        }
                      }
                    })()}
                    {(() => {
                      if (text instanceof RankedBattle) {
                        return ' / ';
                      }
                    })()}
                    {(() => {
                      if (text instanceof RankedBattle) {
                        if (text.selfPlayer.rank !== text.rankAfter) {
                          return (
                            <b>
                              <FormattedMessage id={text.rankAfter.name} />
                            </b>
                          );
                        } else {
                          return <FormattedMessage id={text.rankAfter.name} />;
                        }
                      }
                    })()}
                  </span>
                );
              }}
            />
            {(() => {
              if (!StorageHelper.useSimpleLists()) {
                return (
                  <Column
                    title={<FormattedMessage id="battle.power" defaultMessage="Power Level" />}
                    key="estimatedPower"
                    align="center"
                    render={(text) => {
                      return (
                        <span>
                          {(() => {
                            if (text instanceof RankedBattle && text.gameMode === Mode.rankedBattle) {
                              return text.estimatedRankPower;
                            } else if (text instanceof LeagueBattle) {
                              return '{0} - {1}'.format(text.myEstimatedLeaguePoint, text.otherEstimatedLeaguePoint);
                            } else if (text instanceof SplatfestBattle) {
                              return '{0} - {1}'.format(
                                text.myEstimatedSplatfestPower,
                                text.otherEstimatedSplatfestPower
                              );
                            } else {
                              return '-';
                            }
                          })()}
                        </span>
                      );
                    }}
                  />
                );
              }
            })()}
            <Column
              title={<FormattedMessage id="stage" defaultMessage="Stage" />}
              key="stage"
              align="center"
              render={(text) => (
                <span>
                  <FormattedMessage id={text.stage.stage.name} />
                </span>
              )}
              filters={[
                {
                  text: <FormattedMessage id={Stage.theReef.name} />,
                  value: Stage.theReef.value
                },
                {
                  text: <FormattedMessage id={Stage.musselforgeFitness.name} />,
                  value: Stage.musselforgeFitness.value
                },
                {
                  text: <FormattedMessage id={Stage.starfishMainstage.name} />,
                  value: Stage.starfishMainstage.value
                },
                {
                  text: <FormattedMessage id={Stage.sturgeonShipyard.name} />,
                  value: Stage.sturgeonShipyard.value
                },
                {
                  text: <FormattedMessage id={Stage.inkblotArtAcademy.name} />,
                  value: Stage.inkblotArtAcademy.value
                },
                {
                  text: <FormattedMessage id={Stage.humpbackPumpTrack.name} />,
                  value: Stage.humpbackPumpTrack.value
                },
                {
                  text: <FormattedMessage id={Stage.mantaMaria.name} />,
                  value: Stage.mantaMaria.value
                },
                {
                  text: <FormattedMessage id={Stage.portMackerel.name} />,
                  value: Stage.portMackerel.value
                },
                {
                  text: <FormattedMessage id={Stage.morayTowers.name} />,
                  value: Stage.morayTowers.value
                },
                {
                  text: <FormattedMessage id={Stage.snapperCanal.name} />,
                  value: Stage.snapperCanal.value
                },
                {
                  text: <FormattedMessage id={Stage.kelpDome.name} />,
                  value: Stage.kelpDome.value
                },
                {
                  text: <FormattedMessage id={Stage.blackbellySkatepark.name} />,
                  value: Stage.blackbellySkatepark.value
                },
                {
                  text: <FormattedMessage id={Stage.shellendorfInstitute.name} />,
                  value: Stage.shellendorfInstitute.value
                },
                {
                  text: <FormattedMessage id={Stage.makomart.name} />,
                  value: Stage.makomart.value
                },
                {
                  text: <FormattedMessage id={Stage.walleyeWarehouse.name} />,
                  value: Stage.walleyeWarehouse.value
                },
                {
                  text: <FormattedMessage id={Stage.arowanaMall.name} />,
                  value: Stage.arowanaMall.value
                },
                {
                  text: <FormattedMessage id={Stage.campTriggerfish.name} />,
                  value: Stage.campTriggerfish.value
                },
                {
                  text: <FormattedMessage id={Stage.piranhaPit.name} />,
                  value: Stage.piranhaPit.value
                },
                {
                  text: <FormattedMessage id={Stage.gobyArena.name} />,
                  value: Stage.gobyArena.value
                },
                {
                  text: <FormattedMessage id={Stage.newAlbacoreHotel.name} />,
                  value: Stage.newAlbacoreHotel.value
                },
                {
                  text: <FormattedMessage id={Stage.wahooWorld.name} />,
                  value: Stage.wahooWorld.value
                },
                {
                  text: <FormattedMessage id={Stage.anchovGames.name} />,
                  value: Stage.anchovGames.value
                },
                {
                  text: <FormattedMessage id={Stage.skipperPavilion.name} />,
                  value: Stage.skipperPavilion.value
                },
                {
                  text: <FormattedMessage id={Stage.windmillHouseOnThePearlie.name} />,
                  value: Stage.windmillHouseOnThePearlie.value
                },
                {
                  text: <FormattedMessage id={Stage.wayslideCool.name} />,
                  value: Stage.wayslideCool.value
                },
                {
                  text: <FormattedMessage id={Stage.theSecretOfSplat.name} />,
                  value: Stage.theSecretOfSplat.value
                },
                {
                  text: <FormattedMessage id={Stage.goosponge.name} />,
                  value: Stage.goosponge.value
                },
                {
                  text: <FormattedMessage id={Stage.cannonFirePearl.name} />,
                  value: Stage.cannonFirePearl.value
                },
                {
                  text: <FormattedMessage id={Stage.zoneOfGlass.name} />,
                  value: Stage.zoneOfGlass.value
                },
                {
                  text: <FormattedMessage id={Stage.fancySpew.name} />,
                  value: Stage.fancySpew.value
                },
                {
                  text: <FormattedMessage id={Stage.grapplinkGirl.name} />,
                  value: Stage.grapplinkGirl.value
                },
                {
                  text: <FormattedMessage id={Stage.zappyLongshocking.name} />,
                  value: Stage.zappyLongshocking.value
                },
                {
                  text: <FormattedMessage id={Stage.theBunkerGames.name} />,
                  value: Stage.theBunkerGames.value
                },
                {
                  text: <FormattedMessage id={Stage.aSwiftlyTiltingBalance.name} />,
                  value: Stage.aSwiftlyTiltingBalance.value
                },
                { text: <FormattedMessage id={Stage.theSwitches.name} />, value: Stage.theSwitches.value },
                {
                  text: <FormattedMessage id={Stage.sweetValleyTentacles.name} />,
                  value: Stage.sweetValleyTentacles.value
                },
                {
                  text: <FormattedMessage id={Stage.theBounceyTwins.name} />,
                  value: Stage.theBounceyTwins.value
                },
                {
                  text: <FormattedMessage id={Stage.railwayChillin.name} />,
                  value: Stage.railwayChillin.value
                },
                {
                  text: <FormattedMessage id={Stage.gusherTowns.name} />,
                  value: Stage.gusherTowns.value
                },
                {
                  text: <FormattedMessage id={Stage.theMazeDasher.name} />,
                  value: Stage.theMazeDasher.value
                },
                {
                  text: <FormattedMessage id={Stage.floodersInTheAttic.name} />,
                  value: Stage.floodersInTheAttic.value
                },
                {
                  text: <FormattedMessage id={Stage.theSplatInOurZones.name} />,
                  value: Stage.theSplatInOurZones.value
                },
                {
                  text: <FormattedMessage id={Stage.theInkIsSpreading.name} />,
                  value: Stage.theInkIsSpreading.value
                },
                {
                  text: <FormattedMessage id={Stage.bridgeToTentaswitchia.name} />,
                  value: Stage.bridgeToTentaswitchia.value
                },
                {
                  text: <FormattedMessage id={Stage.theChroniclesOfRolonium.name} />,
                  value: Stage.theChroniclesOfRolonium.value
                },
                {
                  text: <FormattedMessage id={Stage.furlerInTheAshes.name} />,
                  value: Stage.furlerInTheAshes.value
                },
                {
                  text: <FormattedMessage id={Stage.mcPrincessDiaries.name} />,
                  value: Stage.mcPrincessDiaries.value
                },
                {
                  text: <FormattedMessage id={Stage.shiftyStation.name} />,
                  value: Stage.shiftyStation.value
                }
              ]}
              onFilter={(value, record) => {
                return record.stage.stage.value === value;
              }}
            />
            <Column
              title={<FormattedMessage id="weapon.main" defaultMessage="Main Weapon" />}
              key="mainWeapon"
              align="center"
              render={(text) => (
                <Tooltip title={<FormattedMessage id={text.selfPlayer.weapon.mainWeapon.name} />}>
                  <span>
                    <img
                      className="BattlesWindow-content-table-icon"
                      src={FileFolderUrl.SPLATNET + text.selfPlayer.weapon.mainWeaponUrl}
                      alt="main"
                    />
                  </span>
                </Tooltip>
              )}
              filters={[
                {
                  text: <FormattedMessage id={MainWeapon.bold.name} />,
                  value: MainWeapon.bold.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.boldNeo.name} />,
                  value: MainWeapon.boldNeo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bold7.name} />,
                  value: MainWeapon.bold7.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.wakaba.name} />,
                  value: MainWeapon.wakaba.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.momiji.name} />,
                  value: MainWeapon.momiji.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.ochiba.name} />,
                  value: MainWeapon.ochiba.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sharp.name} />,
                  value: MainWeapon.sharp.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sharpNeo.name} />,
                  value: MainWeapon.sharpNeo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.promodelerMg.name} />,
                  value: MainWeapon.promodelerMg.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.promodelerRg.name} />,
                  value: MainWeapon.promodelerRg.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.promodelerPg.name} />,
                  value: MainWeapon.promodelerPg.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sshooter.name} />,
                  value: MainWeapon.sshooter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sshooterCollabo.name} />,
                  value: MainWeapon.sshooterCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sshooterBecchu.name} />,
                  value: MainWeapon.sshooterBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.heroshooterReplica.name} />,
                  value: MainWeapon.heroshooterReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.octoshooterReplica.name} />,
                  value: MainWeapon.octoshooterReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._52Gal.name} />,
                  value: MainWeapon._52Gal.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._52GalDeco.name} />,
                  value: MainWeapon._52GalDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._52GalBecchu.name} />,
                  value: MainWeapon._52GalBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nzap85.name} />,
                  value: MainWeapon.nzap85.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nzap89.name} />,
                  value: MainWeapon.nzap89.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nzap83.name} />,
                  value: MainWeapon.nzap83.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.prime.name} />,
                  value: MainWeapon.prime.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.primeCollabo.name} />,
                  value: MainWeapon.primeCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.primeBecchu.name} />,
                  value: MainWeapon.primeBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._96Gal.name} />,
                  value: MainWeapon._96Gal.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._96GalDeco.name} />,
                  value: MainWeapon._96GalDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.jetsweeper.name} />,
                  value: MainWeapon.jetsweeper.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.jetsweeperCustom.name} />,
                  value: MainWeapon.jetsweeperCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bottlegeyser.name} />,
                  value: MainWeapon.bottlegeyser.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bottlegeyserFoil.name} />,
                  value: MainWeapon.bottlegeyserFoil.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nova.name} />,
                  value: MainWeapon.nova.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.novaNeo.name} />,
                  value: MainWeapon.novaNeo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.novaBecchu.name} />,
                  value: MainWeapon.novaBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hotblaster.name} />,
                  value: MainWeapon.hotblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hotblasterCustom.name} />,
                  value: MainWeapon.hotblasterCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.heroblasterReplica.name} />,
                  value: MainWeapon.heroblasterReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.longblaster.name} />,
                  value: MainWeapon.longblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.longblasterCustom.name} />,
                  value: MainWeapon.longblasterCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.longblasterNecro.name} />,
                  value: MainWeapon.longblasterNecro.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.clashblaster.name} />,
                  value: MainWeapon.clashblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.clashblasterNeo.name} />,
                  value: MainWeapon.clashblasterNeo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapid.name} />,
                  value: MainWeapon.rapid.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapidDeco.name} />,
                  value: MainWeapon.rapidDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapidBecchu.name} />,
                  value: MainWeapon.rapidBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapidElite.name} />,
                  value: MainWeapon.rapidElite.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapidEliteDeco.name} />,
                  value: MainWeapon.rapidEliteDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.l3Reelgun.name} />,
                  value: MainWeapon.l3Reelgun.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.l3ReelgunD.name} />,
                  value: MainWeapon.l3ReelgunD.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.l3ReelgunBecchu.name} />,
                  value: MainWeapon.l3ReelgunBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.h3Reelgun.name} />,
                  value: MainWeapon.h3Reelgun.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.h3ReelgunD.name} />,
                  value: MainWeapon.h3ReelgunD.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.h3ReelgunCherry.name} />,
                  value: MainWeapon.h3ReelgunCherry.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.carbon.name} />,
                  value: MainWeapon.carbon.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.carbonDeco.name} />,
                  value: MainWeapon.carbonDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatroller.name} />,
                  value: MainWeapon.splatroller.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatrollerCollabo.name} />,
                  value: MainWeapon.splatrollerCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatrollerBecchu.name} />,
                  value: MainWeapon.splatrollerBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.herorollerReplica.name} />,
                  value: MainWeapon.herorollerReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dynamo.name} />,
                  value: MainWeapon.dynamo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dynamoTesla.name} />,
                  value: MainWeapon.dynamoTesla.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dynamoBecchu.name} />,
                  value: MainWeapon.dynamoBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.variableroller.name} />,
                  value: MainWeapon.variableroller.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.variablerollerFoil.name} />,
                  value: MainWeapon.variablerollerFoil.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.pablo.name} />,
                  value: MainWeapon.pablo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.pabloHue.name} />,
                  value: MainWeapon.pabloHue.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.pabloPermanent.name} />,
                  value: MainWeapon.pabloPermanent.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hokusai.name} />,
                  value: MainWeapon.hokusai.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hokusaiHue.name} />,
                  value: MainWeapon.hokusaiHue.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hokusaiBecchu.name} />,
                  value: MainWeapon.hokusaiBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.herobrushReplica.name} />,
                  value: MainWeapon.herobrushReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.squicleanA.name} />,
                  value: MainWeapon.squicleanA.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.squicleanB.name} />,
                  value: MainWeapon.squicleanB.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.squicleanG.name} />,
                  value: MainWeapon.squicleanG.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatcharger.name} />,
                  value: MainWeapon.splatcharger.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatchargerCollabo.name} />,
                  value: MainWeapon.splatchargerCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatchargerBecchu.name} />,
                  value: MainWeapon.splatchargerBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.herochargerReplica.name} />,
                  value: MainWeapon.herochargerReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatscope.name} />,
                  value: MainWeapon.splatscope.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatscopeCollabo.name} />,
                  value: MainWeapon.splatscopeCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatscopeBecchu.name} />,
                  value: MainWeapon.splatscopeBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4K.name} />,
                  value: MainWeapon.liter4K.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4KCustom.name} />,
                  value: MainWeapon.liter4KCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4KScope.name} />,
                  value: MainWeapon.liter4KScope.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4KScopeCustom.name} />,
                  value: MainWeapon.liter4KScopeCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bamboo14Mk1.name} />,
                  value: MainWeapon.bamboo14Mk1.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bamboo14Mk2.name} />,
                  value: MainWeapon.bamboo14Mk2.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bamboo14Mk3.name} />,
                  value: MainWeapon.bamboo14Mk3.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.soytuber.name} />,
                  value: MainWeapon.soytuber.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.soytuberCustom.name} />,
                  value: MainWeapon.soytuberCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bucketslosher.name} />,
                  value: MainWeapon.bucketslosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bucketslosherDeco.name} />,
                  value: MainWeapon.bucketslosherDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bucketslosherSoda.name} />,
                  value: MainWeapon.bucketslosherSoda.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.heroslosherReplica.name} />,
                  value: MainWeapon.heroslosherReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hissen.name} />,
                  value: MainWeapon.hissen.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hissenHue.name} />,
                  value: MainWeapon.hissenHue.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.screwslosher.name} />,
                  value: MainWeapon.screwslosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.screwslosherNeo.name} />,
                  value: MainWeapon.screwslosherNeo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.screwslosherBecchu.name} />,
                  value: MainWeapon.screwslosherBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.furo.name} />,
                  value: MainWeapon.furo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.furoDeco.name} />,
                  value: MainWeapon.furoDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.explosher.name} />,
                  value: MainWeapon.explosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.explosherCustom.name} />,
                  value: MainWeapon.explosherCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatspinner.name} />,
                  value: MainWeapon.splatspinner.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatspinnerCollabo.name} />,
                  value: MainWeapon.splatspinnerCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatspinnerBecchu.name} />,
                  value: MainWeapon.splatspinnerBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.barrelspinner.name} />,
                  value: MainWeapon.barrelspinner.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.barrelspinnerDeco.name} />,
                  value: MainWeapon.barrelspinnerDeco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.barrelspinnerRemix.name} />,
                  value: MainWeapon.barrelspinnerRemix.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.herospinnerReplica.name} />,
                  value: MainWeapon.herospinnerReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hydra.name} />,
                  value: MainWeapon.hydra.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hydraCustom.name} />,
                  value: MainWeapon.hydraCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kugelschreiber.name} />,
                  value: MainWeapon.kugelschreiber.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kugelschreiberHue.name} />,
                  value: MainWeapon.kugelschreiberHue.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nautilus47.name} />,
                  value: MainWeapon.nautilus47.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nautilus79.name} />,
                  value: MainWeapon.nautilus79.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sputtery.name} />,
                  value: MainWeapon.sputtery.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sputteryHue.name} />,
                  value: MainWeapon.sputteryHue.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sputteryClear.name} />,
                  value: MainWeapon.sputteryClear.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.maneuver.name} />,
                  value: MainWeapon.maneuver.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.maneuverCollabo.name} />,
                  value: MainWeapon.maneuverCollabo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.maneuverBecchu.name} />,
                  value: MainWeapon.maneuverBecchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.heromaneuverReplica.name} />,
                  value: MainWeapon.heromaneuverReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kelvin525.name} />,
                  value: MainWeapon.kelvin525.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kelvin525Deco.name} />,
                  value: MainWeapon.kelvin525Deco.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kelvin525Becchu.name} />,
                  value: MainWeapon.kelvin525Becchu.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dualsweeper.name} />,
                  value: MainWeapon.dualsweeper.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dualsweeperCustom.name} />,
                  value: MainWeapon.dualsweeperCustom.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.quadhopperBlack.name} />,
                  value: MainWeapon.quadhopperBlack.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.quadhopperWhite.name} />,
                  value: MainWeapon.quadhopperWhite.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.parashelter.name} />,
                  value: MainWeapon.parashelter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.parashelterSorella.name} />,
                  value: MainWeapon.parashelterSorella.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.heroshelterReplica.name} />,
                  value: MainWeapon.heroshelterReplica.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.campingshelter.name} />,
                  value: MainWeapon.campingshelter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.campingshelterSorella.name} />,
                  value: MainWeapon.campingshelterSorella.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.campingshelterCamo.name} />,
                  value: MainWeapon.campingshelterCamo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.spygadget.name} />,
                  value: MainWeapon.spygadget.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.spygadgetSorella.name} />,
                  value: MainWeapon.spygadgetSorella.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.spygadgetBecchu.name} />,
                  value: MainWeapon.spygadgetBecchu.value
                }
              ]}
              onFilter={(value, record) => {
                return record.selfPlayer.weapon.mainWeapon.value === value;
              }}
            />
            {(() => {
              if (!StorageHelper.useSimpleLists()) {
                return (
                  <Column
                    title={<FormattedMessage id="weapon.sub" defaultMessage="Sub Weapon" />}
                    key="subWeapon"
                    align="center"
                    render={(text) => (
                      <Tooltip title={<FormattedMessage id={text.selfPlayer.weapon.subWeapon.name} />}>
                        <span>
                          <img
                            className="BattlesWindow-content-table-icon"
                            src={FileFolderUrl.SPLATNET + text.selfPlayer.weapon.subWeaponUrlA}
                            alt="sub"
                          />
                        </span>
                      </Tooltip>
                    )}
                    filters={[
                      {
                        text: <FormattedMessage id={SubWeapon.splatBomb.name} />,
                        value: SubWeapon.splatBomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.suctionBomb.name} />,
                        value: SubWeapon.suctionBomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.burstBomb.name} />,
                        value: SubWeapon.burstBomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.curlingBomb.name} />,
                        value: SubWeapon.curlingBomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.autobomb.name} />,
                        value: SubWeapon.autobomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.inkMine.name} />,
                        value: SubWeapon.inkMine.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.sprinkler.name} />,
                        value: SubWeapon.sprinkler.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.toxicMist.name} />,
                        value: SubWeapon.toxicMist.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.pointSensor.name} />,
                        value: SubWeapon.pointSensor.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.splashWall.name} />,
                        value: SubWeapon.splashWall.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.squidBeakon.name} />,
                        value: SubWeapon.squidBeakon.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.fizzyBomb.name} />,
                        value: SubWeapon.fizzyBomb.value
                      },
                      {
                        text: <FormattedMessage id={SubWeapon.torpedo.name} />,
                        value: SubWeapon.torpedo.value
                      }
                    ]}
                    onFilter={(value, record) => {
                      return record.selfPlayer.weapon.subWeapon.value === value;
                    }}
                  />
                );
              }
            })()}
            {(() => {
              if (!StorageHelper.useSimpleLists()) {
                return (
                  <Column
                    title={<FormattedMessage id="weapon.special" defaultMessage="Special Weapon" />}
                    key="specialWeapon"
                    align="center"
                    render={(text) => (
                      <Tooltip title={<FormattedMessage id={text.selfPlayer.weapon.specialWeapon.name} />}>
                        <span>
                          <img
                            className="BattlesWindow-content-table-icon"
                            src={FileFolderUrl.SPLATNET + text.selfPlayer.weapon.specialWeaponUrlA}
                            alt="special"
                          />
                        </span>
                      </Tooltip>
                    )}
                    filters={[
                      {
                        text: <FormattedMessage id={SpecialWeapon.tentaMissiles.name} />,
                        value: SpecialWeapon.tentaMissiles.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.inkArmor.name} />,
                        value: SpecialWeapon.inkArmor.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.splatBombLauncher.name} />,
                        value: SpecialWeapon.splatBombLauncher.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.suctionBombLauncher.name} />,
                        value: SpecialWeapon.suctionBombLauncher.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.burstBombLauncher.name} />,
                        value: SpecialWeapon.burstBombLauncher.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.curlingBombLauncher.name} />,
                        value: SpecialWeapon.curlingBombLauncher.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.autobombLauncher.name} />,
                        value: SpecialWeapon.autobombLauncher.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.stingRay.name} />,
                        value: SpecialWeapon.stingRay.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.inkjet.name} />,
                        value: SpecialWeapon.inkjet.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.splashdown.name} />,
                        value: SpecialWeapon.splashdown.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.inkStorm.name} />,
                        value: SpecialWeapon.inkStorm.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.baller.name} />,
                        value: SpecialWeapon.baller.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.bubbleBlower.name} />,
                        value: SpecialWeapon.bubbleBlower.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.booyahBomb.name} />,
                        value: SpecialWeapon.booyahBomb.value
                      },
                      {
                        text: <FormattedMessage id={SpecialWeapon.ultraStamp.name} />,
                        value: SpecialWeapon.ultraStamp.value
                      }
                    ]}
                    onFilter={(value, record) => {
                      return record.selfPlayer.weapon.specialWeapon.value === value;
                    }}
                  />
                );
              }
            })()}
            <Column
              title={<FormattedMessage id="player.kill_and_death" defaultMessage="Kill / Death" />}
              key="killAndDeath"
              align="center"
              render={(text) => {
                return (
                  <Tooltip
                    title={() => {
                      if (text.selfPlayer.death === 0) {
                        return '99.99';
                      } else {
                        return (text.selfPlayer.kill / text.selfPlayer.death).toFixed(2);
                      }
                    }}
                  >
                    <span>
                      {(() => {
                        if (text.selfPlayer.kill > text.selfPlayer.death) {
                          if (text.selfPlayer.assist > 0) {
                            return <b>{'{0} ({1})'.format(text.selfPlayer.killAndAssist, text.selfPlayer.assist)}</b>;
                          } else {
                            return <b>{text.selfPlayer.killAndAssist}</b>;
                          }
                        } else {
                          if (text.selfPlayer.assist > 0) {
                            return '{0} ({1})'.format(text.selfPlayer.killAndAssist, text.selfPlayer.assist);
                          } else {
                            return text.selfPlayer.killAndAssist;
                          }
                        }
                      })()}{' '}
                      /{' '}
                      {(() => {
                        if (text.selfPlayer.death > text.selfPlayer.kill) {
                          return <b>{text.selfPlayer.death}</b>;
                        } else {
                          return text.selfPlayer.death;
                        }
                      })()}
                    </span>
                  </Tooltip>
                );
              }}
            />
          </Table>
          {(() => {
            // Find battle
            if (this.state.showBattleId !== null) {
              this.battle = this.showBattle(this.state.showBattleId);
            }
            if (this.battle === null) {
              return <Redirect to="/404" />;
            } else {
              if (this.battle !== undefined) {
                return (
                  <BattleModal
                    value={this.battle.battle}
                    visible={this.state.showBattleId !== null}
                    onCancel={this.hideBattle}
                    footer={this.battle.buttons}
                    width={900}
                    highlightPlayer={(() => {
                      if (this.state.search === null) {
                        return null;
                      } else {
                        if (this.state.search.with !== undefined) {
                          return this.state.search.with;
                        } else {
                          return null;
                        }
                      }
                    })()}
                  />
                );
              }
            }
          })()}
        </div>
      </div>
    );
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorResult
          error={this.state.errorLog}
          checklist={[
            <FormattedMessage
              key="network"
              id="app.problem.troubleshoot.network"
              defaultMessage="Your network connection"
            />,
            <FormattedMessage key="cookie" id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
          ]}
          extra={[
            [
              <Button key="retry" onClick={this.updateBattles} type="primary">
                <FormattedMessage id="app.retry" defaultMessage="Retry" />
              </Button>,
              <Link to="/settings" key="toSettings">
                <Button type="default">
                  <FormattedMessage id="app.to_settings" defaultMessage="To Settings" />
                </Button>
              </Link>,
              <Button
                key="continue"
                onClick={() => {
                  this.setState({ error: false, loaded: true });
                }}
                type="default"
              >
                <FormattedMessage id="app.continue" defaultMessage="Continue" />
              </Button>
            ]
          ]}
        />
      );
    } else {
      return (
        <WindowLayout icon={regularIcon} title={<FormattedMessage id="app.battles" defaultMessage="Battles" />}>
          {(() => {
            if (!this.state.loaded) {
              if (this.state.updateTotal === 0) {
                return (
                  <LoadingResult
                    description={
                      <FormattedMessage
                        id="app.result.loading.description.check_update_data"
                        defaultMessage="Takos is checking for updated data, which will last for a few seconds to a few minutes..."
                      />
                    }
                  />
                );
              } else if (this.state.updateCurrent > this.state.updateTotal) {
                return <LoadingResult />;
              } else {
                return (
                  <LoadingResult
                    description={
                      <FormattedMessage
                        id="app.result.loading.description.update_data"
                        defaultMessage="Takos is updating data {current}/{total}, which will last for a few seconds to a few minutes..."
                        values={{
                          current: this.state.updateCurrent,
                          total: this.state.updateTotal
                        }}
                      />
                    }
                  />
                );
              }
            } else {
              return this.renderContent();
            }
          })()}
        </WindowLayout>
      );
    }
  }

  componentDidMount() {
    this.updateBattles();
  }

  componentDidUpdate(prevProps, prevState) {
    let showBattleId = null;
    if (this.props.location.hash !== '') {
      showBattleId = parseInt(this.props.location.hash.replace('#', ''));
    }
    let search = null;
    if (this.props.location.search !== '') {
      search = queryString.parse(this.props.location.search);
    }
    if (
      this.props.location.hash !== prevProps.location.hash ||
      this.props.location.search !== prevProps.location.search
    ) {
      this.setState({ showBattleId: showBattleId, search: search });
    }
    if (this.state.loaded !== prevState.loaded && this.state.loaded === false) {
      this.updateBattles();
    }
  }
}

export default injectIntl(BattlesWindow);
