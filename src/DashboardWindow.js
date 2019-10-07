import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Layout, Alert, Button, Row, Col, Card, Statistic, Tabs } from 'antd';

import './DashboardWindow.css';
import icon from './assets/images/character-judd.png';
import leagueIcon from './assets/images/mode-league.png';
import rankedIcon from './assets/images/mode-ranked.png';
import regularIcon from './assets/images/mode-regular.png';
import turfWarIcon from './assets/images/mode-regular.png';
import clamBlitzIcon from './assets/images/rule-clam-blitz.png';
import rainmakerIcon from './assets/images/rule-rainmaker.png';
import splatZonesIcon from './assets/images/rule-splat-zones.png';
import towerControlIcon from './assets/images/rule-tower-control.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import ScheduleCard from './components/ScheduleCard';
import { Mode } from './models/Mode';
import BattleHelper from './utils/BattleHelper';
import TakosError from './utils/ErrorHelper';
import { SPLATNET } from './utils/FileFolderUrl';
import ScheduleHelper from './utils/ScheduleHelper';
import StorageHelper from './utils/StorageHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

class DashboardWindow extends React.Component {
  state = {
    // Render
    battle: null,
    shift: null,
    schedules: [],
    icon: null,
    nickname: '',
    rank: null,
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    errorChecklist: [],
    updateCurrent: 0,
    updateTotal: 0,
    battleUpdated: false,
    schedulesUpdated: false,
    expired: false
  };

  updateData = () => {
    this.setState({
      loaded: false,
      error: false,
      updateCurrent: 0,
      updateTotal: 0,
      battleUpdated: false,
      schedulesUpdated: false,
      expired: false
    });
    let errorBattles = null;
    let errorSchedules = null;
    // Update battles
    this.updateBattles()
      .then(res => {
        if (res instanceof TakosError) {
          errorBattles = res;
        }
      })
      .then(() => {
        // Handle statistics, battles and shifts
        if (this.state.battle !== null) {
          this.setState({
            icon: this.state.battle.selfPlayer().url,
            nickname: this.state.battle.selfPlayer().nickname
          });
        }
        return this.getRank();
      })
      .then(() => {
        // Update schedules
        return this.updateSchedules().then(res => {
          if (res instanceof TakosError) {
            errorSchedules = res;
          }
        });
      })
      .then(() => {
        if (errorBattles !== null || errorSchedules !== null) {
          // Handle error
          let firstErrorLog = null;
          let firstErrorChecklist = [];
          let multipleErrors = false;
          if (errorBattles !== null) {
            this.getBattles()
              .then(() => {
                if (errorBattles instanceof TakosError) {
                  if (errorBattles.message === 'can_not_get_the_latest_battle_from_database') {
                    if (firstErrorLog === null) {
                      firstErrorLog = errorBattles.message;
                      firstErrorChecklist = [];
                    } else {
                      multipleErrors = true;
                    }
                  } else {
                    if (firstErrorLog === null) {
                      firstErrorLog = errorBattles.message;
                      firstErrorChecklist = [
                        <FormattedMessage
                          id="app.problem.troubleshoot.network"
                          defaultMessage="Your network connection"
                        />,
                        <FormattedMessage id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
                      ];
                    } else {
                      multipleErrors = true;
                    }
                  }
                } else {
                  console.error(errorBattles);
                  if (firstErrorLog === null) {
                    firstErrorLog = 'can_not_update_battles';
                    firstErrorChecklist = [
                      <FormattedMessage
                        id="app.problem.troubleshoot.network"
                        defaultMessage="Your network connection"
                      />,
                      <FormattedMessage
                        id="app.problem.troubleshoot.network"
                        defaultMessage="Your network connection"
                      />,
                      <FormattedMessage id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
                    ];
                  } else {
                    multipleErrors = true;
                  }
                }
              })
              .catch();
            this.setState({ battleUpdated: true });
          }
          if (errorSchedules !== null) {
            if (errorSchedules instanceof TakosError) {
              if (firstErrorLog === null) {
                firstErrorLog = errorSchedules.message;
                firstErrorChecklist = [
                  <FormattedMessage id="app.problem.troubleshoot.network" defaultMessage="Your network connection" />
                ];
              } else {
                multipleErrors = true;
              }
            } else {
              if (firstErrorLog === null) {
                firstErrorLog = 'can_not_update_schedules';
                firstErrorChecklist = [
                  <FormattedMessage id="app.problem.troubleshoot.network" defaultMessage="Your network connection" />
                ];
              } else {
                multipleErrors = true;
              }
            }
            this.setState({ schedulesUpdated: true });
          }
          if (multipleErrors) {
            this.setState({ error: true, errorLog: 'multiple_errors', errorChecklist: [] });
          } else {
            this.setState({ error: true, errorLog: firstErrorLog, errorChecklist: firstErrorChecklist });
          }
          throw new Error();
        }
      })
      .then(() => {
        this.setState({ loaded: true });
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
          return new TakosError('can_not_update_data');
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
          console.log(e);
        }
      });
  };

  getRank = () => {
    return StorageHelper.rank()
      .then(res => {
        this.setState({ rank: res });
      })
      .catch(e => {
        console.log(e);
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
          this.timer = setInterval(this.timeout, 60000);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message });
        } else {
          console.error(e);
          this.setState({ error: true, errorLog: 'can_not_parse_schedules' });
        }
      });
  };

  timeout = () => {
    if (new Date(this.state.schedules.regular.endTime * 1000) - new Date() < 0) {
      this.setState({ expired: true });
    } else {
      // Force update the page to update the remaining and coming time
      this.forceUpdate();
    }
  };

  renderContent() {
    return (
      <div>
        {(() => {
          if (this.state.battlesUpdated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.battles_can_not_update"
                    defaultMessage="Takos can not update battles, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.expired) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.schedules_expired"
                    defaultMessage="It seems that these schedules have expired, please refresh this page to update."
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
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.schedules_can_not_update"
                    defaultMessage="Takos can not update schedules, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        <Row>
          <Col className="DashboardWindow-content-column" sm={24} md={16} lg={8}>
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
          if (this.state.battle != null || this.state.shift !== null) {
            return (
              <Row gutter={16}>
                {(() => {
                  if (this.state.rank !== null) {
                    return (
                      <Col className="DashboardWindow-content-column" sm={24} md={12} lg={6}>
                        <Card
                          title={<FormattedMessage id="rank" defaultMessage="Rank" />}
                          bodyStyle={{ padding: '16px 16px 0 16px' }}
                        >
                          <Row gutter={16}>
                            {(() => {
                              if (this.state.rank.splatZones !== undefined) {
                                return (
                                  <Col className="DashboardWindow-content-column" span={12}>
                                    <Statistic
                                      title={<FormattedMessage id="rule.splat_zones" defaultMessage="Splat Zones" />}
                                      value={this.props.intl.formatMessage({ id: this.state.rank.splatZones.name })}
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
                                      value={this.props.intl.formatMessage({ id: this.state.rank.towerControl.name })}
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
                                      value={this.props.intl.formatMessage({ id: this.state.rank.rainmaker.name })}
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
                                      value={this.props.intl.formatMessage({ id: this.state.rank.clamBlitz.name })}
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
                <Col className="DashboardWindow-content-column" sm={24} md={12} lg={6}>
                  <Card
                    title={<FormattedMessage id="app.dashboard.recent_battle" defaultMessage="Recent Battle" />}
                  ></Card>
                </Col>
              </Row>
            );
          }
        })()}
        {(() => {
          if (this.state.schedules !== null) {
            return (
              <Row gutter={16}>
                <Col className="DashboardWindow-content-column" md={24} lg={12}>
                  <Card bodyStyle={{ padding: '0' }}>
                    <Tabs size="large" tabBarStyle={{ margin: '0', padding: '2px 8px 0 8px' }}>
                      {(() => {
                        if (this.state.schedules.regular !== undefined) {
                          return (
                            <TabPane
                              tab={<FormattedMessage id="mode.regular_battle" defaultMessage="Regular Battle" />}
                              key="regular"
                            >
                              <ScheduleCard
                                schedule={this.state.schedules.regular}
                                bordered={false}
                                hoverable={false}
                              />
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
                              <ScheduleCard schedule={this.state.schedules.ranked} bordered={false} hoverable={false} />
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
                              <ScheduleCard schedule={this.state.schedules.league} bordered={false} hoverable={false} />
                            </TabPane>
                          );
                        }
                      })()}
                    </Tabs>
                  </Card>
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
          checklist={this.state.errorChecklist}
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
    clearInterval(this.timer);
  }
}

export default injectIntl(DashboardWindow);
