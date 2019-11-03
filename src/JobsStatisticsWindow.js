import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { PageHeader, Alert, Button, Row, Col, Card, Statistic } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

import './JobsStatisticsWindow.css';
import icon from './assets/images/salmon-run.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import JobHelper from './utils/JobHelper';
import StorageHelper from './utils/StorageHelper';
import { JobResult, WaterLevel, EventType } from './models/Job';

class JobsStatisticsWindow extends React.Component {
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
    search: null
  };

  constructor(props) {
    super(props);
    if (this.props.location.search !== '') {
      this.state.search = queryString.parse(this.props.location.search);
    } else {
      this.state.search = null;
    }
  }

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
            throw res;
          } else {
            this.setState({ updateCurrent: this.state.updateCurrent + 1 });
            if (from < to) {
              return getJobRecursively(from + 1, to);
            }
          }
        })
        .catch(e => {
          if (e instanceof TakosError) {
            return e;
          } else {
            console.error(e);
            return new TakosError('can_not_get_job');
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
    StorageHelper.latestJob()
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
            throw res;
          } else {
            return this.getJobs();
          }
        });
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(e => {
        this.getJobs()
          .then(() => {
            if (e instanceof TakosError) {
              this.setState({ error: true, errorLog: e.message, updated: true });
            } else {
              console.error(e);
              this.setState({
                error: true,
                errorLog: 'can_not_update_jobs',
                updated: true
              });
            }
          })
          .catch();
      })
      .catch(e => {
        console.error(e);
      });
  };

  getJobs = () => {
    return StorageHelper.jobs()
      .then(res => {
        this.setState({
          data: res
        });
      })
      .catch(e => {
        console.error(e);
      });
  };

  filteredJobs = () => {
    if (this.state.search === null) {
      return this.state.data;
    } else {
      let data = this.state.data;
      if (this.state.search.with !== undefined) {
        data = data.filter(element => {
          let isWith = false;
          if (
            element.players.find(ele => {
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
          if (this.state.search !== null) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
                description={
                  <FormattedMessage
                    id="app.alert.info.jobs_filtered"
                    defaultMessage="The jobs shown have been filtered, please click <l>here</l> to cancel the screening."
                    values={{
                      l: msg => <Link to="/stats/jobs">{msg}</Link>
                    }}
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          const data = this.filteredJobs();
          let waves = 0;
          let selfSpecialUses = 0;
          let selfGoldenEggs = 0;
          let goldenEggs = 0;
          let quotas = 0;
          let goldenEggPops = 0;
          let selfPowerEggs = 0;
          let powerEggs = 0;
          let selfKills = 0;
          let kills = 0;
          let selfHelps = 0;
          let selfDeaths = 0;
          let appearances = 0;
          let waterLevels = {
            normal: 0,
            low: 0,
            high: 0
          };
          let eventTypes = {
            waterLevels: 0,
            rush: 0,
            fog: 0,
            goldieSeeking: 0,
            griller: 0,
            cohockCharge: 0,
            theMothership: 0
          };
          let salmoniods = [];
          data.forEach(element => {
            waves = waves + element.waves.length;
            if (element.result !== JobResult.clear) {
              waves = waves - 1;
            }
            element.waves.forEach(ele => {
              // Water level
              switch (ele.waterLevel) {
                case WaterLevel.normal:
                  waterLevels.normal++;
                  break;
                case WaterLevel.low:
                  waterLevels.low++;
                  break;
                case WaterLevel.high:
                  waterLevels.high++;
                  break;
                default:
                  throw new RangeError();
              }
              // Event type
              switch (ele.eventType) {
                case EventType.waterLevels:
                  eventTypes.waterLevels++;
                  break;
                case EventType.rush:
                  eventTypes.rush++;
                  break;
                case EventType.fog:
                  eventTypes.fog++;
                  break;
                case EventType.goldieSeeking:
                  eventTypes.goldieSeeking++;
                  break;
                case EventType.griller:
                  eventTypes.griller++;
                  break;
                case EventType.cohockCharge:
                  eventTypes.cohockCharge++;
                  break;
                case EventType.theMothership:
                  eventTypes.theMothership++;
                  break;
                default:
                  throw new RangeError();
              }
            });
            selfSpecialUses = selfSpecialUses + 2 - element.selfPlayer.specialRemained;
            selfGoldenEggs = selfGoldenEggs + element.selfPlayer.goldenEgg;
            goldenEggs = goldenEggs + element.goldenEgg;
            quotas = quotas + element.quota;
            goldenEggPops = goldenEggPops + element.goldenEggPop;
            selfPowerEggs = selfPowerEggs + element.selfPlayer.powerEgg;
            powerEggs = powerEggs + element.powerEgg;
            selfKills = selfKills + element.selfPlayer.kill;
            kills = kills + element.kill;
            selfHelps = selfHelps + element.selfPlayer.help;
            selfDeaths = selfDeaths + element.selfPlayer.death;
            appearances = appearances + element.appearances;
            element.bossSalmoniodAppearances.forEach(ele => {
              let salmoniod = salmoniods.find(e => {
                return e.salmoniod === ele.salmoniod;
              });
              if (salmoniod === undefined) {
                salmoniods.push({
                  salmoniod: ele.salmoniod,
                  appearance: 0,
                  kill: 0,
                  selfKill: 0
                });
                // Find salmoniod again
                salmoniod = salmoniods.find(e => {
                  return e.salmoniod === ele.salmoniod;
                });
              }
              salmoniod.appearance = salmoniod.appearance + ele.appearance;
              salmoniod.kill = salmoniod.kill + element.getBossSalmoniodKill(salmoniod.salmoniod);
              const selfBossSalmoniodKill = element.selfPlayer.bossSalmoniodKills.find(e => {
                return e.salmoniod === salmoniod.salmoniod;
              });
              if (selfBossSalmoniodKill !== undefined) {
                salmoniod.selfKill = salmoniod.selfKill + selfBossSalmoniodKill.kill;
              }
            });
          });
          let chartData = [];
          data
            .sort((a, b) => {
              return a.number - b.number;
            })
            .slice(-20)
            .forEach(element => {
              chartData.push({
                number: element.number.toString(),
                hazardLevel: parseFloat(element.hazardLevel),
                rate: element.rate,
                score: element.score,
                grizzcoPoint: element.grizzcoPoint
              });
            });
          if (data.length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.jobs" defaultMessage="Jobs" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="app.jobs.count" defaultMessage="Job Times" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.splatnet" defaultMessage="SplatNet" />}
                            value={
                              this.state.data.sort((a, b) => {
                                return b.number - a.number;
                              })[0].number
                            }
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.local" defaultMessage="Local" />}
                            value={data.length}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.result" defaultMessage="Result" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.clear" defaultMessage="Clear!" />}
                            value={
                              data.filter(element => {
                                return element.result === JobResult.clear;
                              }).length
                            }
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.defeat" defaultMessage="Defeat" />}
                            value={
                              data.filter(element => {
                                return element.result !== JobResult.clear;
                              }).length
                            }
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.time_limit" defaultMessage="Time Up!" />}
                            value={
                              data.filter(element => {
                                return element.result === JobResult.timeLimit;
                              }).length
                            }
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.wipe_out" defaultMessage="DEFEAT!" />}
                            value={
                              data.filter(element => {
                                return element.result === JobResult.wipeOut;
                              }).length
                            }
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="app.jobs.clear_waves" defaultMessage="Clear WAVEs" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={waves}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(waves / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="player.special_use" defaultMessage="Special Use" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfSpecialUses}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfSpecialUses / data.length).toFixed(2)}
                            suffix="/ 2"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.golden_egg.quota" defaultMessage="Quota" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={quotas}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(quotas / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.golden_egg" defaultMessage="Golden Egg" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={goldenEggs}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(goldenEggs / data.length).toFixed(2)}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfGoldenEggs}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfGoldenEggs / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.golden_egg.pop" defaultMessage="Appearances" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={goldenEggPops}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(goldenEggPops / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.power_egg" defaultMessage="Power Egg" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={powerEggs}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(powerEggs / data.length).toFixed(2)}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfPowerEggs}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfPowerEggs / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.salmoniod.kill" defaultMessage="Splat" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={kills}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(kills / data.length).toFixed(2)}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfKills}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfKills / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.salmoniod.appearance" defaultMessage="Appearances" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={appearances}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(appearances / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="player.help" defaultMessage="Rescue" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfHelps}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfHelps / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="player.death" defaultMessage="Crushed" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total.your" defaultMessage="Your Total" />}
                            value={selfDeaths}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average.your" defaultMessage="Your Average" />}
                            value={(selfDeaths / data.length).toFixed(2)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <PageHeader title={<FormattedMessage id="app.jobs.water_levels" defaultMessage="Water Levels" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="water_level.normal" defaultMessage="Normal" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={waterLevels.normal}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(waterLevels.normal / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="water_level.low" defaultMessage="Low Tide" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={waterLevels.low}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(waterLevels.low / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="water_level.high" defaultMessage="High Tide" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={waterLevels.high}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(waterLevels.high / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <PageHeader title={<FormattedMessage id="app.jobs.event_types" defaultMessage="Events" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.rush" defaultMessage="Rush" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.rush}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.rush / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.fog" defaultMessage="Fog" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.fog}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.fog / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.goldie_seeking" defaultMessage="Goldie Seeking" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.goldieSeeking}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.goldieSeeking / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.griller" defaultMessage="Griller" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.griller}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.griller / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.cohock_charge" defaultMessage="Cohock Charge" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.cohockCharge}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.cohockCharge / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="event_type.the_mothership" defaultMessage="The Mothership" />}
                      bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
                    >
                      <Row gutter={16}>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                            value={eventTypes.theMothership}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                            value={(eventTypes.theMothership / data.length).toFixed(2)}
                            suffix="/ 3"
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <PageHeader title={<FormattedMessage id="salmoniods" defaultMessage="Salmoniods" />} />
                <Row gutter={16}>
                  {salmoniods.map(element => {
                    return (
                      <Col
                        className="JobsStatisticsWindow-content-column"
                        key={element.salmoniod.value}
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={6}
                      >
                        <Card
                          className="JobsStatisticsWindow-content-card"
                          hoverable
                          title={<FormattedMessage id={element.salmoniod.name} />}
                          bodyStyle={{ padding: '16px 16px 0 16px' }}
                        >
                          <Row gutter={16}>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage
                                    id="app.jobs.salmoniods.appearance.total"
                                    defaultMessage="Total Appearances"
                                  />
                                }
                                value={element.appearance}
                              />
                            </Col>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage
                                    id="app.jobs.salmoniods.appearance.average"
                                    defaultMessage="Average Appearances"
                                  />
                                }
                                value={(element.appearance / data.length).toFixed(2)}
                              />
                            </Col>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage id="app.jobs.salmoniods.kill.total" defaultMessage="Total Splat" />
                                }
                                value={element.kill}
                              />
                            </Col>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage
                                    id="app.jobs.salmoniods.kill.average"
                                    defaultMessage="Average Splat"
                                  />
                                }
                                value={(element.kill / data.length).toFixed(2)}
                              />
                            </Col>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage
                                    id="app.jobs.salmoniods.kill.total.your"
                                    defaultMessage="Your Total Splat"
                                  />
                                }
                                value={element.selfKill}
                              />
                            </Col>
                            <Col className="JobsStatisticsWindow-content-column" span={12}>
                              <Statistic
                                className="JobsStatisticsWindow-content-statistic"
                                title={
                                  <FormattedMessage
                                    id="app.jobs.salmoniods.kill.average.your"
                                    defaultMessage="Your Average Splat"
                                  />
                                }
                                value={(element.selfKill / data.length).toFixed(2)}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                <PageHeader title={<FormattedMessage id="app.trending" defaultMessage="Trending" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" md={24} lg={12}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.hazard_level" defaultMessage="Hazard Level" />}
                      bodyStyle={{ padding: '16px 10px', minHeight: '170px' }}
                    >
                      <Chart
                        data={chartData}
                        scale={{
                          hazardLevel: { minLimit: 0, maxLimit: 200 },
                          number: { range: [0, 1] }
                        }}
                        height={200}
                        padding={[0, 6]}
                        forceFit
                      >
                        <Axis />
                        <Tooltip
                          crosshairs={{
                            type: 'y'
                          }}
                        />
                        <Geom
                          type="line"
                          position="number*hazardLevel"
                          tooltip={[
                            'number*hazardLevel',
                            (number, hazardLevel) => {
                              return {
                                name: this.props.intl.formatMessage({
                                  id: 'job.hazard_level',
                                  defaultMessage: 'Hazard Level'
                                }),
                                title: this.props.intl.formatMessage(
                                  {
                                    id: 'job.id',
                                    defaultMessage: '#{id}'
                                  },
                                  { id: number }
                                ),
                                value: this.props.intl.formatMessage(
                                  {
                                    id: 'job.hazard_level.value',
                                    defaultMessage: '{value}%'
                                  },
                                  { value: hazardLevel }
                                )
                              };
                            }
                          ]}
                          size={2}
                          shape={'smooth'}
                          color="#fa8c16"
                        />
                      </Chart>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" md={24} lg={12}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.rate" defaultMessage="Pay Grade" />}
                      bodyStyle={{ padding: '16px 10px', minHeight: '170px' }}
                    >
                      <Chart
                        data={chartData}
                        scale={{
                          number: { range: [0, 1] }
                        }}
                        height={200}
                        padding={[0, 6]}
                        forceFit
                      >
                        <Axis />
                        <Tooltip
                          crosshairs={{
                            type: 'y'
                          }}
                        />
                        <Geom
                          type="line"
                          position="number*rate"
                          tooltip={[
                            'number*rate',
                            (number, rate) => {
                              return {
                                name: this.props.intl.formatMessage({
                                  id: 'job.rate',
                                  defaultMessage: 'Pay Grade'
                                }),
                                title: this.props.intl.formatMessage(
                                  {
                                    id: 'job.id',
                                    defaultMessage: '#{id}'
                                  },
                                  { id: number }
                                ),
                                value: this.props.intl.formatMessage(
                                  {
                                    id: 'job.rate.value',
                                    defaultMessage: '{value}%'
                                  },
                                  { value: rate }
                                )
                              };
                            }
                          ]}
                          size={2}
                          shape={'smooth'}
                          color="#fa8c16"
                        />
                      </Chart>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" md={24} lg={12}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.score" defaultMessage="Job Score" />}
                      bodyStyle={{ padding: '16px 10px', minHeight: '170px' }}
                    >
                      <Chart
                        data={chartData}
                        scale={{
                          number: { range: [0, 1] }
                        }}
                        height={200}
                        padding={[0, 6]}
                        forceFit
                      >
                        <Axis />
                        <Tooltip
                          crosshairs={{
                            type: 'y'
                          }}
                        />
                        <Geom
                          type="line"
                          position="number*score"
                          tooltip={[
                            'number*score',
                            (number, score) => {
                              return {
                                name: this.props.intl.formatMessage({
                                  id: 'job.score',
                                  defaultMessage: 'Job Score'
                                }),
                                title: this.props.intl.formatMessage(
                                  {
                                    id: 'job.id',
                                    defaultMessage: '#{id}'
                                  },
                                  { id: number }
                                ),
                                value: score
                              };
                            }
                          ]}
                          size={2}
                          shape={'smooth'}
                          color="#fa8c16"
                        />
                      </Chart>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" md={24} lg={12}>
                    <Card
                      className="JobsStatisticsWindow-content-card"
                      hoverable
                      title={<FormattedMessage id="job.grizzco_points" defaultMessage="Grizzco Points" />}
                      bodyStyle={{ padding: '16px 10px', minHeight: '170px' }}
                    >
                      <Chart
                        data={chartData}
                        scale={{
                          number: { range: [0, 1] }
                        }}
                        height={200}
                        padding={[0, 6]}
                        forceFit
                      >
                        <Axis />
                        <Tooltip
                          crosshairs={{
                            type: 'y'
                          }}
                        />
                        <Geom
                          type="line"
                          position="number*grizzcoPoint"
                          tooltip={[
                            'number*grizzcoPoint',
                            (number, grizzcoPoint) => {
                              return {
                                name: this.props.intl.formatMessage({
                                  id: 'job.grizzco_points',
                                  defaultMessage: 'Grizzco Points'
                                }),
                                title: this.props.intl.formatMessage(
                                  {
                                    id: 'job.id',
                                    defaultMessage: '#{id}'
                                  },
                                  { id: number }
                                ),
                                value: grizzcoPoint
                              };
                            }
                          ]}
                          size={2}
                          shape={'smooth'}
                          color="#fa8c16"
                        />
                      </Chart>
                    </Card>
                  </Col>
                </Row>
              </div>
            );
          }
        })()}
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
              <Button key="retry" onClick={this.updateJobs} type="primary">
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
        <WindowLayout icon={icon} title={<FormattedMessage id="app.jobs" defaultMessage="Jobs" />}>
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
    this.updateJobs();
  }

  componentDidUpdate(prevProps, prevState) {
    let search = null;
    if (this.props.location.search !== '') {
      search = queryString.parse(this.props.location.search);
    }
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({ search: search });
    }
    if (this.state.loaded !== prevState.loaded && this.state.loaded === false) {
      this.updateJobs();
    }
  }
}

export default injectIntl(JobsStatisticsWindow);
