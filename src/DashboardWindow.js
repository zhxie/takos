import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Layout, Alert, Button, Row, Col, Card, Statistic, Tooltip, Tabs } from 'antd';

import './DashboardWindow.css';
import icon from './assets/images/character-judd.png';
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
import ScheduleCard from './components/ScheduleCard';
import ShiftCard from './components/ShiftCard';
import { RankedBattle, LeagueBattle } from './models/Battle';
import { Mode } from './models/Mode';
import Rule from './models/Rule';
import BattleHelper from './utils/BattleHelper';
import TakosError from './utils/ErrorHelper';
import FileFolderUrl from './utils/FileFolderUrl';
import JobHelper from './utils/JobHelper';
import ScheduleHelper from './utils/ScheduleHelper';
import ShiftHelper from './utils/ShiftHelper';
import StorageHelper from './utils/StorageHelper';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

class DashboardWindow extends React.Component {
  state = {
    // Data
    battle: null,
    job: null,
    schedules: null,
    shifts: [],
    icon: null,
    nickname: '',
    rank: null,
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    updateCurrent: 0,
    updateTotal: 0,
    battlesUpdated: false,
    jobsUpdated: false,
    schedulesUpdated: false,
    shiftsUpdated: false,
    schedulesExpired: false,
    shiftsExpired: false
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

  updateData = () => {
    this.setState({
      loaded: false,
      error: false,
      updateCurrent: 0,
      updateTotal: 0,
      battlesUpdated: false,
      jobsUpdated: false,
      schedulesUpdated: false,
      shiftsUpdated: false,
      schedulesExpired: false,
      shiftsExpired: false
    });
    let errorBattles = null;
    let errorJobs = null;
    let errorSchedules = null;
    let errorShifts = null;
    let firstErrorLog = null;
    // Update battles
    this.updateBattles()
      .then(res => {
        if (res instanceof TakosError) {
          errorBattles = res;
        }
      })
      .then(() => {
        // Update jobs
        return this.updateJobs();
      })
      .then(res => {
        if (res instanceof TakosError) {
          errorJobs = res;
        }
      })
      .then(() => {
        // Update schedules and shifts
        return Promise.all([this.updateSchedules(), this.updateShifts()])
          .then(values => {
            if (values[0] instanceof TakosError) {
              errorSchedules = values[0];
            }
            if (values[1] instanceof TakosError) {
              errorShifts = values[1];
            }
          })
          .catch(e => {
            console.error(e);
            errorSchedules = e;
            errorShifts = e;
          });
      })
      .then(() => {
        if (errorBattles !== null) {
          // Handle error
          return this.getBattles()
            .then(() => {
              if (errorBattles instanceof TakosError) {
                if (firstErrorLog === null) {
                  firstErrorLog = errorBattles.message;
                }
              } else {
                console.error(errorBattles);
                if (firstErrorLog === null) {
                  firstErrorLog = 'can_not_update_battles';
                }
              }
              this.setState({ battlesUpdated: true });
            })
            .catch();
        }
      })
      .then(() => {
        if (errorJobs !== null) {
          // Handle error
          return this.getJobs()
            .then(() => {
              if (errorJobs instanceof TakosError) {
                if (firstErrorLog === null) {
                  firstErrorLog = errorJobs.message;
                }
              } else {
                console.error(errorJobs);
                if (firstErrorLog === null) {
                  firstErrorLog = 'can_not_update_battles';
                }
              }
              this.setState({ jobsUpdated: true });
            })
            .catch();
        }
      })
      .then(() => {
        if (errorSchedules !== null) {
          // Handle error
          if (errorSchedules instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorSchedules.message;
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_schedules';
            }
          }
          this.setState({ schedulesUpdated: true });
        }
      })
      .then(() => {
        if (errorShifts !== null) {
          // Handle error
          if (errorShifts instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorShifts.message;
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_shifts';
            }
          }
          this.setState({ shiftsUpdated: true });
        }
      })
      .then(() => {
        // Handle icon
        let id = null;
        if (this.state.battle !== null) {
          id = this.state.battle.selfPlayer.id;
        } else if (this.state.job !== null) {
          id = this.state.job.selfPlayer.id;
        }
        if (id !== null) {
          BattleHelper.getPlayerIcon(id)
            .then(res => {
              if (res === null) {
                throw new TakosError('can_not_get_player_icon');
              } else {
                if (res !== '') {
                  this.setState({ icon: res });
                }
              }
            })
            .catch(e => {
              console.error(e);
            });
        }
      })
      .then(() => {
        // Handle statistics, battles and jobs
        let nickname = null;
        if (this.state.battle !== null) {
          nickname = this.state.battle.selfPlayer.nickname;
        } else if (this.state.job !== null) {
          nickname = this.state.job.selfPlayer.nickname;
        }
        if (nickname !== null) {
          this.setState({
            nickname: nickname
          });
        }
        return this.getRank();
      })
      .then(() => {
        if (firstErrorLog !== null) {
          this.setState({ error: true, errorLog: firstErrorLog });
        } else {
          this.setState({ loaded: true });
        }
      })
      .catch();
  };

  updateBattles = () => {
    // TODO: this method should be extracted
    const getBattleRecursively = (from, to) => {
      return BattleHelper.getBattle(from)
        .then(res => {
          if (res.error !== null) {
            // Handle previous error
            throw new TakosError(res.error);
          } else {
            return StorageHelper.addBattle(res);
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

    return StorageHelper.latestBattle()
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
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_battles');
        }
      });
  };

  updateJobs = () => {
    // TODO: this method should be extracted
    const getJobRecursively = (from, to) => {
      return JobHelper.getJob(from)
        .then(res => {
          if (res.error !== null) {
            // Handle previous error
            throw new TakosError(res.error);
          } else {
            return StorageHelper.addJob(res);
          }
        })
        .then(res => {
          if (res instanceof TakosError) {
            throw new TakosError(res.message);
          } else {
            this.setState({ updateCurrent: this.state.updateCurrent + 1 });
            if (from < to) {
              return getJobRecursively(from + 1, to);
            }
          }
        })
        .catch(e => {
          if (e instanceof TakosError) {
            return new TakosError(e.message);
          } else {
            console.error(e);
            return new TakosError('can_not_get_job');
          }
        });
    };

    return StorageHelper.latestJob()
      .then(res => {
        if (res === -1) {
          throw new TakosError('can_not_get_the_latest_job_from_database');
        } else {
          return res;
        }
      })
      .then(res => {
        const currentNumber = res;
        return JobHelper.getTheLatestJobNumber().then(res => {
          if (res === 0) {
            throw new TakosError('can_not_get_jobs');
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
          return this.getJobs();
        }
        return getJobRecursively(res.from, res.to).then(res => {
          if (res instanceof TakosError) {
            throw new TakosError(res.message);
          } else {
            return this.getJobs();
          }
        });
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_jobs');
        }
      });
  };

  getBattles = () => {
    return StorageHelper.latestBattle()
      .then(res => {
        if (res === -1) {
          throw new TakosError('can_not_get_the_latest_battle_from_database');
        } else if (res !== 0) {
          return StorageHelper.battle(res);
        }
      })
      .then(res => {
        if (res.error !== null) {
          throw new TakosError(res.error);
        } else {
          this.setState({ battle: res });
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
        } else {
          console.error(e);
        }
      });
  };

  getJobs = () => {
    return StorageHelper.latestJob()
      .then(res => {
        if (res === -1) {
          throw new TakosError('can_not_get_the_latest_job_from_database');
        } else if (res !== 0) {
          return StorageHelper.job(res);
        }
      })
      .then(res => {
        if (res.error !== null) {
          throw new TakosError(res.error);
        } else {
          this.setState({ job: res });
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
        } else {
          console.error(e);
        }
      });
  };

  getRank = () => {
    return StorageHelper.rank()
      .then(res => {
        this.setState({ rank: res });
      })
      .catch(e => {
        console.error(e);
      });
  };

  updateSchedules = () => {
    return ScheduleHelper.getSchedules()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_get_schedules');
        } else {
          let schedules = {};
          if (res.regularSchedules[0].error !== null) {
            throw new TakosError(res.regularSchedules[0].error);
          } else {
            schedules.regular = res.regularSchedules[0];
          }
          if (res.rankedSchedules[0].error !== null) {
            throw new TakosError(res.rankedSchedules[0].error);
          } else {
            schedules.ranked = res.rankedSchedules[0];
          }
          if (res.leagueSchedules[0].error !== null) {
            throw new TakosError(res.leagueSchedules[0].error);
          } else {
            schedules.league = res.leagueSchedules[0];
          }
          this.setState({ schedules: schedules });
          // Set update interval
          this.schedulesTimer = setInterval(this.schedulesTimeout, 60000);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return new TakosError(e.message);
        } else {
          console.error(e);
          return new TakosError('can_not_parse_schedules');
        }
      });
  };

  updateShifts = () => {
    return ShiftHelper.getShifts()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_get_shifts');
        } else {
          res.forEach(element => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          if (res.length > 0) {
            this.setState({ shifts: res });
            // Set update interval
            this.shiftsTimer = setInterval(this.shiftsTimeout, 60000);
          } else {
            throw new TakosError('can_not_parse_shifts');
          }
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return new TakosError(e.message);
        } else {
          console.error(e);
          return new TakosError('can_not_parse_shifts');
        }
      });
  };

  schedulesTimeout = () => {
    if (this.state.schedules instanceof Array && this.state.schedules.length > 0) {
      if (new Date(this.state.schedules.regular.endTime * 1000) - new Date() < 0) {
        this.setState({ schedulesExpired: true });
      } else {
        // Force update the page to update the remaining and coming time
        this.forceUpdate();
      }
    }
  };

  shiftsTimeout = () => {
    if (this.state.shifts instanceof Array && this.state.shifts.length > 0) {
      if (new Date(this.state.shifts[0].endTime * 1000) - new Date() < 0) {
        this.setState({ shiftsExpired: true });
      } else {
        // Force update the page to update the remaining and coming time
        this.forceUpdate();
      }
    }
  };

  renderContent() {
    return (
      <div>
        {(() => {
          if (this.state.battlesUpdated) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.battles_can_not_update"
                    defaultMessage="Takos can not update battles, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.jobsUpdated) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.jobs_can_not_update"
                    defaultMessage="Takos can not update jobs, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.schedulesUpdated) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.schedules_can_not_update"
                    defaultMessage="Takos can not update schedules, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.shiftsUpdated) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.shifts_can_not_update"
                    defaultMessage="Takos can not update shifts, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.schedulesExpired) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.schedules_expired"
                    defaultMessage="It seems that these schedules have expired, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.shiftssExpired) {
            return (
              <Alert
                className="DashboardWindow-content-alert"
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.shifts_expired"
                    defaultMessage="It seems that these shifts have expired, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        <Row>
          <Col className="DashboardWindow-content-column" md={24} lg={12}>
            <Card
              bodyStyle={{
                alignItems: 'center',
                display: 'flex',
                padding: '16px'
              }}
            >
              {(() => {
                if (this.state.icon !== null) {
                  return <img className="DashboardWindow-content-card-welcome-icon" src={this.state.icon} alt="icon" />;
                }
              })()}
              <h2 style={{ fontSize: '1.6em', margin: '0 8px' }}>
                {(() => {
                  if (this.state.nickname === '') {
                    return <FormattedMessage id="app.dashboard.welcome" defaultMessage="Welcome to Takos!" />;
                  } else {
                    return (
                      <FormattedMessage
                        id="app.dashboard.welcome.name"
                        defaultMessage="Welcome to Takos, {name}!"
                        values={{ name: this.state.nickname }}
                      />
                    );
                  }
                })()}
              </h2>
            </Card>
          </Col>
        </Row>
        {(() => {
          if (this.state.battle !== null || this.state.shifts !== null) {
            return (
              <Row gutter={16}>
                <Col className="DashboardWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                  <Card
                    title={<FormattedMessage id="app.dashboard.level_and_grade" defaultMessage="Level / Rank" />}
                    bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                  >
                    {(() => {
                      if (this.state.battle !== null) {
                        return (
                          <Row gutter={16}>
                            <Col className="DashboardWindow-content-column" span={24}>
                              <Statistic
                                className="DashboardWindow-content-statistic"
                                title={<FormattedMessage id="battle.level" defaultMessage="Level" />}
                                prefix={(() => {
                                  if (this.state.battle.isLevelAfterWithStar) {
                                    return (
                                      <Tooltip title={this.state.battle.star}>
                                        <span className="DashboardWindow-content-statistic-star">★</span>
                                      </Tooltip>
                                    );
                                  }
                                })()}
                                value={this.state.battle.levelAfterWithStar}
                              />
                            </Col>
                          </Row>
                        );
                      }
                    })()}
                    {(() => {
                      if (this.state.job !== null) {
                        return (
                          <Row gutter={16}>
                            <Col className="DashboardWindow-content-column" span={24}>
                              <Statistic
                                className="DashboardWindow-content-statistic"
                                title={<FormattedMessage id="job.grade" defaultMessage="Rank" />}
                                value={this.props.intl.formatMessage({
                                  id: this.state.job.grade.name
                                })}
                              />
                            </Col>
                          </Row>
                        );
                      }
                    })()}
                  </Card>
                </Col>
                {(() => {
                  if (this.state.rank !== null) {
                    return (
                      <Col className="DashboardWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <Card
                          title={<FormattedMessage id="rank" defaultMessage="Rank" />}
                          bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                        >
                          <Row gutter={16}>
                            {(() => {
                              if (this.state.rank.splatZones !== undefined) {
                                return (
                                  <Col className="DashboardWindow-content-column" span={12}>
                                    <Statistic
                                      title={<FormattedMessage id="rule.splat_zones" defaultMessage="Splat Zones" />}
                                      value={this.props.intl.formatMessage({
                                        id: this.state.rank.splatZones.name,
                                        defaultMessage: 'Splat Zones'
                                      })}
                                    />
                                  </Col>
                                );
                              }
                            })()}
                            {(() => {
                              if (this.state.rank.towerControl !== undefined) {
                                return (
                                  <Col className="DashboardWindow-content-column" span={12}>
                                    <Statistic
                                      title={
                                        <FormattedMessage id="rule.tower_control" defaultMessage="Tower Control" />
                                      }
                                      value={this.props.intl.formatMessage({
                                        id: this.state.rank.towerControl.name,
                                        defaultMessage: 'Tower Control'
                                      })}
                                    />
                                  </Col>
                                );
                              }
                            })()}
                            {(() => {
                              if (this.state.rank.rainmaker !== undefined) {
                                return (
                                  <Col className="DashboardWindow-content-column" span={12}>
                                    <Statistic
                                      title={<FormattedMessage id="rule.rainmaker" defaultMessage="Rainmaker" />}
                                      value={this.props.intl.formatMessage({
                                        id: this.state.rank.rainmaker.name,
                                        defaultMessage: 'Rainmaker'
                                      })}
                                    />
                                  </Col>
                                );
                              }
                            })()}
                            {(() => {
                              if (this.state.rank.clamBlitz !== undefined) {
                                return (
                                  <Col className="DashboardWindow-content-column" span={12}>
                                    <Statistic
                                      title={<FormattedMessage id="rule.clam_blitz" defaultMessage="Clam Blitz" />}
                                      value={this.props.intl.formatMessage({
                                        id: this.state.rank.clamBlitz.name,
                                        defaultMessage: 'Clam Blitz'
                                      })}
                                    />
                                  </Col>
                                );
                              }
                            })()}
                          </Row>
                        </Card>
                      </Col>
                    );
                  }
                })()}
                {(() => {
                  if (this.state.battle !== null) {
                    return (
                      <Col className="DashboardWindow-content-column" xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Link to={'/battles#{0}'.format(this.state.battle.number)}>
                          <Card
                            title={<FormattedMessage id="app.dashboard.recent_battle" defaultMessage="Recent Battle" />}
                            hoverable
                            bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                          >
                            <Row gutter={16}>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="battle.result" defaultMessage="Result" />}
                                  value={(() => {
                                    if (this.state.battle.isWin) {
                                      if (
                                        this.state.battle instanceof RankedBattle ||
                                        this.state.battle instanceof LeagueBattle
                                      ) {
                                        if (this.state.battle.isKnockOut) {
                                          return this.props.intl.formatMessage({
                                            id: 'battle.knock_out',
                                            defaultMessage: 'KO BONUS!'
                                          });
                                        } else {
                                          return this.props.intl.formatMessage({
                                            id: 'battle.win',
                                            defaultMessage: 'Win!'
                                          });
                                        }
                                      } else {
                                        return this.props.intl.formatMessage({
                                          id: 'battle.win',
                                          defaultMessage: 'Win!'
                                        });
                                      }
                                    } else {
                                      return this.props.intl.formatMessage({
                                        id: 'battle.lose',
                                        defaultMessage: 'Lose..'
                                      });
                                    }
                                  })()}
                                  valueStyle={(() => {
                                    if (this.state.battle.isWin) {
                                      if (
                                        this.state.battle instanceof RankedBattle ||
                                        this.state.battle instanceof LeagueBattle
                                      ) {
                                        if (this.state.battle.isKnockOut) {
                                          return { color: '#f5222d' };
                                        } else {
                                          return { color: '#eb2f96' };
                                        }
                                      } else {
                                        return { color: '#eb2f96' };
                                      }
                                    } else {
                                      return { color: '#52c41a' };
                                    }
                                  })()}
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={
                                    <FormattedMessage
                                      id="player.kill_and_death_and_special"
                                      defaultMessage="K / D / Special"
                                    />
                                  }
                                  value={(() => {
                                    if (this.state.battle.selfPlayer.assist > 0) {
                                      return '{0} ({1}) / {2} / {3}'.format(
                                        this.state.battle.selfPlayer.killAndAssist,
                                        this.state.battle.selfPlayer.assist,
                                        this.state.battle.selfPlayer.death,
                                        this.state.battle.selfPlayer.special
                                      );
                                    } else {
                                      return '{0} / {1} / {2}'.format(
                                        this.state.battle.selfPlayer.killAndAssist,
                                        this.state.battle.selfPlayer.death,
                                        this.state.battle.selfPlayer.special
                                      );
                                    }
                                  })()}
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="weapon" defaultMessage="Weapon" />}
                                  prefix={
                                    <span>
                                      <Tooltip
                                        title={
                                          <FormattedMessage id={this.state.battle.selfPlayer.weapon.mainWeapon.name} />
                                        }
                                      >
                                        <img
                                          className="DashboardWindow-content-statistic-icon"
                                          src={
                                            FileFolderUrl.SPLATNET + this.state.battle.selfPlayer.weapon.mainWeaponUrl
                                          }
                                          alt="main"
                                        />
                                      </Tooltip>
                                      <Tooltip
                                        title={
                                          <FormattedMessage id={this.state.battle.selfPlayer.weapon.subWeapon.name} />
                                        }
                                      >
                                        <img
                                          className="DashboardWindow-content-statistic-icon"
                                          src={
                                            FileFolderUrl.SPLATNET + this.state.battle.selfPlayer.weapon.subWeaponUrlA
                                          }
                                          alt="sub"
                                          style={{ marginLeft: '4px' }}
                                        />
                                      </Tooltip>
                                      <Tooltip
                                        title={
                                          <FormattedMessage
                                            id={this.state.battle.selfPlayer.weapon.specialWeapon.name}
                                          />
                                        }
                                      >
                                        <img
                                          className="DashboardWindow-content-statistic-icon"
                                          src={
                                            FileFolderUrl.SPLATNET +
                                            this.state.battle.selfPlayer.weapon.specialWeaponUrlA
                                          }
                                          alt="special"
                                          style={{ marginLeft: '4px' }}
                                        />
                                      </Tooltip>
                                    </span>
                                  }
                                  value=" "
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="stage" defaultMessage="Stage" />}
                                  value={this.props.intl.formatMessage({ id: this.state.battle.stage.stage.name })}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </Link>
                      </Col>
                    );
                  }
                })()}
                {(() => {
                  if (this.state.job !== null) {
                    return (
                      <Col className="DashboardWindow-content-column" xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Link to={'/jobs#{0}'.format(this.state.job.number)}>
                          <Card
                            title={<FormattedMessage id="app.dashboard.recent_job" defaultMessage="Recent Job" />}
                            hoverable
                            bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                          >
                            <Row gutter={16}>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="job.result" defaultMessage="Result" />}
                                  value={this.props.intl.formatMessage({
                                    id: this.state.job.result.name
                                  })}
                                  valueStyle={(() => {
                                    if (this.state.job.isClear) {
                                      return { color: '#52c41a' };
                                    } else {
                                      return { color: '#fa8c16' };
                                    }
                                  })()}
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="job.grizzco_points" defaultMessage="Grizzco Points" />}
                                  value={this.state.job.grizzcoPoint}
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="weapon" defaultMessage="Weapon" />}
                                  prefix={
                                    <span>
                                      {(() => {
                                        return this.state.job.selfPlayer.weapons.map((element, index) => {
                                          console.log(index);
                                          if (index === 0) {
                                            return (
                                              <Tooltip
                                                key={index}
                                                title={<FormattedMessage id={element.mainWeapon.name} />}
                                              >
                                                <img
                                                  className="DashboardWindow-content-statistic-icon"
                                                  src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                                                  alt="main"
                                                />
                                              </Tooltip>
                                            );
                                          } else {
                                            return (
                                              <Tooltip
                                                key={index}
                                                title={<FormattedMessage id={element.mainWeapon.name} />}
                                              >
                                                <img
                                                  className="DashboardWindow-content-statistic-icon"
                                                  src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                                                  alt="main"
                                                  style={{ marginLeft: '4px' }}
                                                />
                                              </Tooltip>
                                            );
                                          }
                                        });
                                      })()}
                                    </span>
                                  }
                                  value=" "
                                />
                              </Col>
                              <Col className="DashboardWindow-content-column" span={12}>
                                <Statistic
                                  title={<FormattedMessage id="stage" defaultMessage="Stage" />}
                                  value={this.props.intl.formatMessage({ id: this.state.job.shift.stage.stage.name })}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </Link>
                      </Col>
                    );
                  }
                })()}
              </Row>
            );
          }
        })()}
        {(() => {
          if (this.state.schedules !== null || this.state.shifts.length > 0) {
            return (
              <Row gutter={16}>
                <Col className="DashboardWindow-content-column" md={24} lg={12}>
                  {(() => {
                    if (this.state.schedules !== null) {
                      return (
                        <Card hoverable bodyStyle={{ padding: '0' }} style={{ cursor: 'default' }}>
                          <Tabs size="large" tabBarStyle={{ margin: '0', padding: '2px 8px 0 8px' }}>
                            {(() => {
                              if (this.state.schedules.regular !== undefined) {
                                return (
                                  <TabPane
                                    tab={<FormattedMessage id="mode.regular_battle" defaultMessage="Regular Battle" />}
                                    key="regular"
                                  >
                                    <Link to={'/schedules/regular'}>
                                      <ScheduleCard
                                        schedule={this.state.schedules.regular}
                                        bordered={false}
                                        hoverable={false}
                                        pointer={true}
                                      />
                                    </Link>
                                  </TabPane>
                                );
                              }
                            })()}
                            {(() => {
                              if (this.state.schedules.ranked !== undefined) {
                                return (
                                  <TabPane
                                    tab={<FormattedMessage id="mode.ranked_battle" defaultMessage="Ranked Battle" />}
                                    key="ranked"
                                  >
                                    <Link to={'/schedules/ranked'}>
                                      <ScheduleCard
                                        schedule={this.state.schedules.ranked}
                                        bordered={false}
                                        hoverable={false}
                                        pointer={true}
                                      />
                                    </Link>
                                  </TabPane>
                                );
                              }
                            })()}
                            {(() => {
                              if (this.state.schedules.league !== undefined) {
                                return (
                                  <TabPane
                                    tab={<FormattedMessage id="mode.league_battle" defaultMessage="League Battle" />}
                                    key="league"
                                  >
                                    <Link to={'/schedules/league'}>
                                      <ScheduleCard
                                        schedule={this.state.schedules.league}
                                        bordered={false}
                                        hoverable={false}
                                        pointer={true}
                                      />
                                    </Link>
                                  </TabPane>
                                );
                              }
                            })()}
                          </Tabs>
                        </Card>
                      );
                    }
                  })()}
                </Col>
                <Col className="DashboardWindow-content-column" md={24} lg={12}>
                  {(() => {
                    if (this.state.shifts.length > 0) {
                      return (
                        <Card
                          title={<FormattedMessage id="app.shifts" defaultMessage="Shifts" />}
                          hoverable
                          bodyStyle={{ padding: '1px 0 0 0' }}
                          style={{ cursor: 'default' }}
                        >
                          <Link to={'/shifts'}>
                            <ShiftCard shift={this.state.shifts[0]} bordered={false} hoverable={false} pointer={true} />
                          </Link>
                        </Card>
                      );
                    }
                  })()}
                </Col>
              </Row>
            );
          }
        })()}
      </div>
    );
  }

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
              <Button key="retry" onClick={this.updateData} type="primary">
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
          <Header className="DashboardWindow-header" style={{ zIndex: 1 }}>
            <img className="DashboardWindow-header-icon" src={icon} alt="dashboard" />
            <p className="DashboardWindow-header-title">
              <FormattedMessage id="app.dashboard" defaultMessage="Dashboard" />
            </p>
          </Header>
          <Content className="DashboardWindow-content">
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
    this.updateData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded !== prevState.loaded && this.state.loaded === false) {
      this.updateData();
    }
  }

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.schedulesTimer);
    clearInterval(this.shiftsTimer);
  }
}

export default injectIntl(DashboardWindow);
