import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Button, Table, Divider, Tag, Tooltip } from 'antd';

import './BattlesWindow.css';
import leagueIcon from './assets/images/mode-league.png';
import privateIcon from './assets/images/mode-private.png';
import turfWarIcon from './assets/images/mode-regular.png';
import regularIcon from './assets/images/mode-regular.png';
import splatfestIcon from './assets/images/mode-splatfest.png';
import clamBlitzIcon from './assets/images/rule-clam-blitz.png';
import rainmakerIcon from './assets/images/rule-rainmaker.png';
import rankedIcon from './assets/images/mode-ranked.png';
import splatZonesIcon from './assets/images/rule-splat-zones.png';
import towerControlIcon from './assets/images/rule-tower-control.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import { RankedBattle, LeagueBattle } from './models/Battle';
import { Mode } from './models/Mode';
import Rule from './models/Rule';
import BattleHelper from './utils/BattleHelper';
import TakosError from './utils/ErrorHelper';
import { SPLATNET } from './utils/FileFolderUrl';
import StorageHelper from './utils/StorageHelper';

const { Header, Content } = Layout;
const { Column } = Table;

class BattlesWindow extends React.Component {
  state = {
    data: [],
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    errorChecklist: [],
    updateCurrent: 0,
    updateTotal: 0,
    updated: false
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

  updateBattles = () => {
    const getBattleRecursively = (from, to) => {
      return BattleHelper.getBattle(from)
        .then(res => {
          if (res.error !== null) {
            // Handle previous error
            throw new TakosError(res.error);
          } else {
            return BattleHelper.saveBattle(res);
          }
        })
        .then(res => {
          if (res instanceof TakosError) {
            throw new TakosError(res.message);
          } else {
            this.setState({ updateCurrent: this.state.updateCurrent + 1 });
            if (from < to) {
              return getBattleRecursively(from + 1, to);
            }
          }
        })
        .catch(e => {
          if (e instanceof TakosError) {
            return new TakosError(e.message);
          } else {
            console.error(e);
            return new TakosError('can_not_get_battle');
          }
        });
    };

    this.setState({ error: false });
    StorageHelper.latestBattle()
      .then(res => {
        if (res === -1) {
          throw new TakosError('can_not_get_the_latest_battle_from_database');
        } else {
          return res;
        }
      })
      .then(res => {
        const currentNumber = res;
        return BattleHelper.getTheLatestBattleNumber().then(res => {
          if (res === 0) {
            throw new TakosError('can_not_get_battles');
          } else {
            const from = Math.max(1, res - 49, currentNumber + 1);
            const to = res;
            return { from, to };
          }
        });
      })
      .then(res => {
        if (res.to >= res.from) {
          this.setState({ updateCurrent: 1, updateTotal: res.to - res.from + 1 });
        } else {
          return this.getBattles();
        }
        return getBattleRecursively(res.from, res.to).then(res => {
          if (res instanceof TakosError) {
            throw new TakosError(res.message);
          } else {
            return this.getBattles();
          }
        });
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(e => {
        this.getBattles().then(() => {
          if (e instanceof TakosError) {
            if (e.message === 'can_not_get_the_latest_battle_from_database') {
              this.setState({ error: true, errorLog: e.message });
            } else {
              this.setState({
                error: true,
                errorLog: e.message,
                errorChecklist: [
                  <FormattedMessage id="app.problem.troubleshoot.network" defaultMessage="Your network connection" />,
                  <FormattedMessage id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
                ]
              });
            }
          } else {
            console.error(e);
            this.setState({
              error: true,
              errorLog: 'can_not_update_battles',
              errorChecklist: [
                <FormattedMessage id="app.problem.troubleshoot.network" defaultMessage="Your network connection" />,
                <FormattedMessage id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
              ]
            });
          }
        });
      });
  };

  getBattles = () => {
    return StorageHelper.battles()
      .then(res => {
        res.forEach(element => {
          element.key = element.number;
        });
        this.setState({
          data: res.sort((firstEl, secondEl) => {
            return secondEl.number - firstEl.number;
          })
        });
      })
      .catch(e => {
        console.error(e);
      });
  };

  renderContent = () => {
    return (
      <div>
        {(() => {
          if (this.state.updated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.battles_updated"
                    defaultMessage="It seems that battles have been updated, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        <div>
          <PageHeader title={<FormattedMessage id="app.battles" defaultMessage="Battles" />} />
          <Table dataSource={this.state.data}>
            <Column title={<FormattedMessage id="app.battle.id" defaultMessage="#" />} key="id" dataIndex="number" />
            <Column
              title={<FormattedMessage id="app.battle.result" defaultMessage="Result" />}
              key="result"
              render={text => (
                <span>
                  {(() => {
                    if (text.isWin()) {
                      if (text instanceof RankedBattle || text instanceof LeagueBattle) {
                        if (text.isKnockOut()) {
                          return (
                            <Tag color="magenta" key="result">
                              <FormattedMessage id="app.battle.knock_out" defaultMessage="KO BONUS!" />
                            </Tag>
                          );
                        } else {
                          return (
                            <Tag color="magenta" key="result">
                              <FormattedMessage id="app.battle.win" defaultMessage="Win!" />
                            </Tag>
                          );
                        }
                      } else {
                        return (
                          <Tag color="magenta" key="result">
                            <FormattedMessage id="app.battle.win" defaultMessage="Win!" />
                          </Tag>
                        );
                      }
                    } else {
                      return (
                        <Tag color="green" key="result">
                          <FormattedMessage id="app.battle.lose" defaultMessage="Lose.." />
                        </Tag>
                      );
                    }
                  })()}
                </span>
              )}
            />
            <Column
              title={<FormattedMessage id="mode" defaultMessage="Mode" />}
              key="mode"
              render={text => (
                <span>
                  <img className="BattlesWindow-content-icon" src={this.modeIconSelector(text.gameMode)} alt="mode" />
                </span>
              )}
            />
            <Column
              title={<FormattedMessage id="rule" defaultMessage="Rule" />}
              key="rule"
              render={text => (
                <span>
                  <img className="BattlesWindow-content-icon" src={this.ruleIconSelector(text.rule)} alt="rule" />
                </span>
              )}
            />
            <Column
              title={<FormattedMessage id="app.battle.level_and_rank" defaultMessage="Level / Rank" />}
              key="levelAndRank"
              render={text => {
                return (
                  <span>
                    {(() => {
                      if (text.selfPlayer().level !== text.levelAfter) {
                        return <b>{text.levelAfter}</b>;
                      } else {
                        return text.levelAfter;
                      }
                    })()}
                    {(() => {
                      if (text instanceof RankedBattle) {
                        return ' / ';
                      }
                    })()}
                    {(() => {
                      if (text instanceof RankedBattle) {
                        if (text.selfPlayer().rank !== text.rankAfter) {
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
            <Column
              title={<FormattedMessage id="stage" defaultMessage="Stage" />}
              key="stage"
              render={text => (
                <span>
                  <FormattedMessage id={text.stage.stage.name} />
                </span>
              )}
            />
            <Column
              title={<FormattedMessage id="weapon.main" defaultMessage="Main Weapon" />}
              key="mainWeapon"
              render={text => (
                <Tooltip title={<FormattedMessage id={text.selfPlayer().weapon.mainWeapon.name} />}>
                  <img
                    className="BattlesWindow-content-icon"
                    src={SPLATNET + text.selfPlayer().weapon.mainWeaponUrl}
                    alt="main"
                  />
                </Tooltip>
              )}
            />
            <Column
              title={<FormattedMessage id="weapon.sub" defaultMessage="Sub Weapon" />}
              key="subWeapon"
              render={text => (
                <Tooltip title={<FormattedMessage id={text.selfPlayer().weapon.subWeapon.name} />}>
                  <img
                    className="BattlesWindow-content-icon"
                    src={SPLATNET + text.selfPlayer().weapon.subWeaponUrlA}
                    alt="sub"
                  />
                </Tooltip>
              )}
            />
            <Column
              title={<FormattedMessage id="weapon.special" defaultMessage="Special Weapon" />}
              key="specialWeapon"
              render={text => (
                <Tooltip title={<FormattedMessage id={text.selfPlayer().weapon.specialWeapon.name} />}>
                  <img
                    className="BattlesWindow-content-icon"
                    src={SPLATNET + text.selfPlayer().weapon.specialWeaponUrlA}
                    alt="special"
                  />
                </Tooltip>
              )}
            />
            <Column
              title={<FormattedMessage id="app.battle.kill_and_death" defaultMessage="K / D" />}
              key="killAndDeath"
              render={text => {
                return (
                  <span>
                    {(() => {
                      if (text.selfPlayer().kill > text.selfPlayer().death) {
                        return <b>{text.selfPlayer().kill}</b>;
                      } else {
                        return text.selfPlayer().kill;
                      }
                    })()}{' '}
                    /{' '}
                    {(() => {
                      if (text.selfPlayer().death > text.selfPlayer().kill) {
                        return <b>{text.selfPlayer().death}</b>;
                      } else {
                        return text.selfPlayer().death;
                      }
                    })()}
                  </span>
                );
              }}
            />
          </Table>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorResult
          error={this.state.errorLog}
          checklist={this.state.errorChecklist}
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
        <Layout>
          <Header className="BattlesWindow-header" style={{ zIndex: 1 }}>
            <img className="BattlesWindow-header-icon" src={regularIcon} alt="battle" />
            <p className="BattlesWindow-header-title">
              <FormattedMessage id="app.battles" defaultMessage="Battles" />
            </p>
          </Header>
          <Content className="BattlesWindow-content">
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
          </Content>
        </Layout>
      );
    }
  }

  componentDidMount() {
    this.updateBattles();
  }
}

export default BattlesWindow;
