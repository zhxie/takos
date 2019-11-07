import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import moment from 'moment';
import { PageHeader, Alert, Button, Form, DatePicker, Row, Col, Card, Statistic } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

import './JobsStatisticsWindow.css';
import icon from './assets/images/salmon-run.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import StatisticsCard from './components/StatisticsCard';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import JobHelper from './utils/JobHelper';
import StorageHelper from './utils/StorageHelper';
import { JobResult, WaterLevel, EventType } from './models/Job';

const { RangePicker } = DatePicker;

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
    search: null,
    startTime: []
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
    let data = this.state.data;
    // Start time
    if (this.state.startTime.length !== 0) {
      data = data.filter(element => {
        return element.startTime > this.state.startTime[0] && element.startTime < this.state.startTime[1];
      });
    }
    // With
    if (this.state.search !== null) {
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
    }
    return data;
  };

  filterStartTime = date => {
    let startTime = [];
    date.forEach(element => {
      startTime.push(element.utc() / 1000);
    });
    this.setState({ startTime: startTime });
  };

  range = () => {
    const today = this.props.intl.formatMessage({ id: 'app.time.today', defaultMessage: 'Today' });
    const lastThreeDays = this.props.intl.formatMessage({
      id: 'app.time.last_three_days',
      defaultMessage: 'Last 3 Days'
    });
    const thisWeek = this.props.intl.formatMessage({ id: 'app.time.this_week', defaultMessage: 'This Week' });
    const thisMonth = this.props.intl.formatMessage({ id: 'app.time.this_month', defaultMessage: 'This Month' });
    let range = {};
    range[today] = [moment(), moment()];
    range[lastThreeDays] = [moment().subtract(3, 'days'), moment()];
    range[thisWeek] = [moment().startOf('week'), moment().endOf('week')];
    range[thisMonth] = [moment().startOf('month'), moment().endOf('month')];
    return range;
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
                    id="app.alert.info.jobs_filtered"
                    defaultMessage="The jobs shown have been filtered, please click <l>here</l> to cancel the screening."
                    values={{
                      l: msg => <Link to="/stats/jobs">{msg}</Link>
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
        <PageHeader title={<FormattedMessage id="app.filter" defaultMessage="Filter" />} />
        <Form className="JobsStatisticsWindow-content-form" labelCol={{ span: 24 }}>
          <Form.Item label={<FormattedMessage id="job.time.start" defaultMessage="Start Time" />}>
            <Row gutter={8}>
              <Col sm={18} md={12}>
                <RangePicker ranges={this.range()} onChange={this.filterStartTime} />
              </Col>
            </Row>
          </Form.Item>
        </Form>
        {(() => {
          const data = this.filteredJobs();
          // Job
          let waves = 0;
          let clear = 0;
          let timeLimit = 0;
          let wipeOut = 0;
          let hazardLevel = 0;
          let maxHazardLevel = 0;
          let score = 0;
          let maxScore = 0;
          let grizzcoPoint = 0;
          let maxGrizzcoPoint = 0;
          let rate = 0;
          let maxRate = 0;
          let quota = 0;
          let maxQuota = 0;
          let goldenEgg = 0;
          let maxGoldenEgg = 0;
          let goldenEggPop = 0;
          let maxGoldenEggPop = 0;
          let powerEgg = 0;
          let maxPowerEgg = 0;
          // Wave
          let normal = 0;
          let low = 0;
          let high = 0;
          let rush = 0;
          let fog = 0;
          let goldieSeeking = 0;
          let griller = 0;
          let cohockCharge = 0;
          let theMothership = 0;
          // Player
          let selfSpecialUse = 0;
          let selfMaxSpecialUse = 0;
          let selfGoldenEgg = 0;
          let selfMaxGoldenEgg = 0;
          let selfPowerEgg = 0;
          let selfMaxPowerEgg = 0;
          let selfKill = 0;
          let selfMaxKill = 0;
          let selfHelp = 0;
          let selfMaxHelp = 0;
          let selfDeath = 0;
          let selfMaxDeath = 0;
          let selfBossSalmoniods = [];
          // Salmoniods
          let kill = 0;
          let maxKill = 0;
          let appearances = 0;
          let maxAppearances = 0;
          let bossSalmoniods = [];
          data.forEach(element => {
            // Job
            waves = waves + element.waves.length;
            if (element.result !== JobResult.clear) {
              waves = waves - 1;
            }
            switch (element.result) {
              case JobResult.clear:
                clear++;
                break;
              case JobResult.timeLimit:
                timeLimit++;
                break;
              case JobResult.wipeOut:
                wipeOut++;
                break;
              default:
                throw new RangeError();
            }
            hazardLevel = hazardLevel + parseFloat(element.hazardLevel);
            if (parseFloat(element.hazardLevel) > maxHazardLevel) {
              maxHazardLevel = element.hazardLevel;
            }
            score = score + element.score;
            maxScore = Math.max(maxScore, element.score);
            grizzcoPoint = grizzcoPoint + element.grizzcoPoint;
            maxGrizzcoPoint = Math.max(maxGrizzcoPoint, element.grizzcoPoint);
            rate = rate + element.rate;
            maxRate = Math.max(maxRate, element.rate);
            quota = quota + element.quota;
            maxQuota = Math.max(maxQuota, element.quota);
            goldenEgg = goldenEgg + element.goldenEgg;
            maxGoldenEgg = Math.max(maxGoldenEgg, element.goldenEgg);
            goldenEggPop = goldenEggPop + element.goldenEggPop;
            maxGoldenEggPop = Math.max(maxGoldenEggPop, element.goldenEggPop);
            powerEgg = powerEgg + element.powerEgg;
            maxPowerEgg = Math.max(maxPowerEgg, element.powerEgg);
            // Wave
            element.waves.forEach(ele => {
              switch (ele.waterLevel) {
                case WaterLevel.normal:
                  normal++;
                  break;
                case WaterLevel.low:
                  low++;
                  break;
                case WaterLevel.high:
                  high++;
                  break;
                default:
                  throw new RangeError();
              }
              switch (ele.eventType) {
                case EventType.waterLevels:
                  break;
                case EventType.rush:
                  rush++;
                  break;
                case EventType.fog:
                  fog++;
                  break;
                case EventType.goldieSeeking:
                  goldieSeeking++;
                  break;
                case EventType.griller:
                  griller++;
                  break;
                case EventType.cohockCharge:
                  cohockCharge++;
                  break;
                case EventType.theMothership:
                  theMothership++;
                  break;
                default:
                  throw new RangeError();
              }
            });
            // Player
            selfSpecialUse = selfSpecialUse + 2 - element.selfPlayer.specialRemained;
            selfMaxSpecialUse = Math.max(selfMaxSpecialUse, 2 - element.selfPlayer.specialRemained);
            selfGoldenEgg = selfGoldenEgg + element.selfPlayer.goldenEgg;
            selfMaxGoldenEgg = Math.max(selfMaxGoldenEgg, element.selfPlayer.goldenEgg);
            selfPowerEgg = selfPowerEgg + element.selfPlayer.powerEgg;
            selfMaxPowerEgg = Math.max(selfMaxPowerEgg, element.selfPlayer.powerEgg);
            selfKill = selfKill + element.selfPlayer.kill;
            selfMaxKill = Math.max(selfMaxKill, element.selfPlayer.kill);
            selfHelp = selfHelp + element.selfPlayer.help;
            selfMaxHelp = Math.max(selfMaxHelp, element.selfPlayer.help);
            selfDeath = selfDeath + element.selfPlayer.death;
            selfMaxDeath = Math.max(selfMaxDeath, element.selfPlayer.death);
            element.selfPlayer.bossSalmoniodKills.forEach(ele => {
              let bossSalmoniod = selfBossSalmoniods.find(e => {
                return e.salmoniod === ele.salmoniod;
              });
              if (bossSalmoniod === undefined) {
                selfBossSalmoniods.push({
                  salmoniod: ele.salmoniod,
                  kill: 0,
                  maxKill: 0
                });
                // Find boss salmoniod again
                bossSalmoniod = selfBossSalmoniods.find(e => {
                  return e.salmoniod === ele.salmoniod;
                });
              }
              bossSalmoniod.kill = bossSalmoniod.kill + ele.kill;
              bossSalmoniod.maxKill = Math.max(bossSalmoniod.maxKill, ele.kill);
            });
            // Salmoniods
            kill = kill + element.kill;
            maxKill = Math.max(maxKill, element.kill);
            appearances = appearances + element.appearances;
            maxAppearances = Math.max(maxAppearances, element.appearances);
            element.bossSalmoniodAppearances.forEach(ele => {
              let bossSalmoniod = bossSalmoniods.find(e => {
                return e.salmoniod === ele.salmoniod;
              });
              if (bossSalmoniod === undefined) {
                bossSalmoniods.push({
                  salmoniod: ele.salmoniod,
                  kill: 0,
                  maxKill: 0,
                  appearance: 0,
                  maxAppearance: 0
                });
                // Find boss salmoniod again
                bossSalmoniod = bossSalmoniods.find(e => {
                  return e.salmoniod === ele.salmoniod;
                });
              }
              const bossSalmoniodKill = element.getBossSalmoniodKill(ele.salmoniod);
              bossSalmoniod.kill = bossSalmoniod.kill + bossSalmoniodKill;
              bossSalmoniod.maxKill = Math.max(bossSalmoniod.maxKill, bossSalmoniodKill);
              bossSalmoniod.appearance = bossSalmoniod.appearance + ele.appearance;
              bossSalmoniod.maxAppearance = Math.max(bossSalmoniod.maxAppearance, ele.appearance);
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
                isClear: element.isClear,
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
                        {(() => {
                          if (data.length === this.state.data.length) {
                            return (
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
                            );
                          }
                        })()}
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
                            value={clear}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.defeat" defaultMessage="Defeat" />}
                            value={timeLimit + wipeOut}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.time_limit" defaultMessage="Time Up!" />}
                            value={timeLimit}
                          />
                        </Col>
                        <Col className="JobsStatisticsWindow-content-column" span={12}>
                          <Statistic
                            className="JobsStatisticsWindow-content-statistic"
                            title={<FormattedMessage id="job_result.wipe_out" defaultMessage="DEFEAT!" />}
                            value={wipeOut}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="app.jobs.clear_waves" defaultMessage="Clear WAVEs" />}
                      total={waves}
                      average={(waves / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.hazard_level" defaultMessage="Hazard Level" />}
                      average={this.props.intl.formatMessage(
                        { id: 'job.hazard_level.value', defaultMessage: '{value}%' },
                        {
                          value: (hazardLevel / data.length).toFixed(1)
                        }
                      )}
                      averageSuffix="/ 200%"
                      max={this.props.intl.formatMessage(
                        { id: 'job.hazard_level.value', defaultMessage: '{value}%' },
                        {
                          value: maxHazardLevel
                        }
                      )}
                      maxSuffix="/ 200%"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.score" defaultMessage="Job Score" />}
                      total={score}
                      average={(score / data.length).toFixed(2)}
                      max={maxScore}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.grizzco_points" defaultMessage="Grizzco Points" />}
                      total={grizzcoPoint}
                      average={(grizzcoPoint / data.length).toFixed(2)}
                      max={maxGrizzcoPoint}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.rate" defaultMessage="Pay Grade" />}
                      average={this.props.intl.formatMessage(
                        {
                          id: 'job.rate.value',
                          defaultMessage: '{value}%'
                        },
                        {
                          value: (rate / data.length).toFixed(0)
                        }
                      )}
                      max={this.props.intl.formatMessage(
                        {
                          id: 'job.rate.value',
                          defaultMessage: '{value}%'
                        },
                        {
                          value: maxRate
                        }
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.golden_egg.quota" defaultMessage="Quota" />}
                      total={quota}
                      average={(quota / data.length).toFixed(2)}
                      max={maxQuota}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.golden_egg" defaultMessage="Golden Egg" />}
                      total={goldenEgg}
                      average={(goldenEgg / data.length).toFixed(2)}
                      max={maxGoldenEgg}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.golden_egg.pop" defaultMessage="Appearances" />}
                      total={goldenEggPop}
                      average={(goldenEggPop / data.length).toFixed(2)}
                      max={maxGoldenEggPop}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.power_egg" defaultMessage="Power Egg" />}
                      total={powerEgg}
                      average={(powerEgg / data.length).toFixed(2)}
                      max={maxPowerEgg}
                    />
                  </Col>
                </Row>
                <PageHeader title={<FormattedMessage id="app.jobs.waves" defaultMessage="WAVEs" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="water_level.normal" defaultMessage="Normal" />}
                      total={normal}
                      average={(normal / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="water_level.low" defaultMessage="Low Tide" />}
                      total={low}
                      average={(low / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="water_level.high" defaultMessage="High Tide" />}
                      total={high}
                      average={(high / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.rush" defaultMessage="Rush" />}
                      total={rush}
                      average={(rush / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.fog" defaultMessage="Fog" />}
                      total={fog}
                      average={(fog / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.goldie_seeking" defaultMessage="Goldie Seeking" />}
                      total={goldieSeeking}
                      average={(goldieSeeking / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.griller" defaultMessage="Griller" />}
                      total={griller}
                      average={(griller / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.cohock_charge" defaultMessage="Cohock Charge" />}
                      total={cohockCharge}
                      average={(cohockCharge / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="event_type.the_mothership" defaultMessage="The Mothership" />}
                      total={theMothership}
                      average={(theMothership / data.length).toFixed(2)}
                      averageSuffix="/ 3"
                    />
                  </Col>
                </Row>
                <PageHeader title={<FormattedMessage id="salmoniods" defaultMessage="Salmoniods" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.salmoniod.kill" defaultMessage="Splat" />}
                      total={kill}
                      average={(kill / data.length).toFixed(2)}
                      max={maxKill}
                    />
                  </Col>
                  {bossSalmoniods.map(element => {
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
                        <StatisticsCard
                          title={<FormattedMessage id={element.salmoniod.name} />}
                          total={element.kill}
                          average={(element.kill / data.length).toFixed(2)}
                          max={element.maxKill}
                        />
                      </Col>
                    );
                  })}
                </Row>
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="job.salmoniod.appearance" defaultMessage="Appearances" />}
                      total={appearances}
                      average={(appearances / data.length).toFixed(2)}
                      max={maxAppearances}
                    />
                  </Col>
                  {bossSalmoniods.map(element => {
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
                        <StatisticsCard
                          title={<FormattedMessage id={element.salmoniod.name} />}
                          total={element.appearance}
                          average={(element.appearance / data.length).toFixed(2)}
                          max={element.maxAppearance}
                        />
                      </Col>
                    );
                  })}
                </Row>
                <PageHeader title={<FormattedMessage id="player" defaultMessage="Player" />} />
                <Row gutter={16}>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.special_use" defaultMessage="Special Use" />}
                      total={selfSpecialUse}
                      average={(selfSpecialUse / data.length).toFixed(2)}
                      averageSuffix="/ 2"
                      max={selfMaxSpecialUse}
                      maxSuffix="/ 2"
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.golden_egg" defaultMessage="Golden Egg" />}
                      total={selfGoldenEgg}
                      average={(selfGoldenEgg / data.length).toFixed(2)}
                      max={selfMaxGoldenEgg}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.power_egg" defaultMessage="Power Egg" />}
                      total={selfPowerEgg}
                      average={(selfPowerEgg / data.length).toFixed(2)}
                      max={selfMaxPowerEgg}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.kill" defaultMessage="Splat" />}
                      total={selfKill}
                      average={(selfKill / data.length).toFixed(2)}
                      max={selfMaxKill}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.help" defaultMessage="Rescue" />}
                      total={selfHelp}
                      average={(selfHelp / data.length).toFixed(2)}
                      max={selfMaxHelp}
                    />
                  </Col>
                  <Col className="JobsStatisticsWindow-content-column" xs={24} sm={12} md={12} lg={12} xl={6}>
                    <StatisticsCard
                      title={<FormattedMessage id="player.death" defaultMessage="Crushed" />}
                      total={selfDeath}
                      average={(selfDeath / data.length).toFixed(2)}
                      max={selfMaxDeath}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  {selfBossSalmoniods.map(element => {
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
                        <StatisticsCard
                          title={<FormattedMessage id={element.salmoniod.name} />}
                          total={element.kill}
                          average={(element.kill / data.length).toFixed(2)}
                          max={element.maxKill}
                        />
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
                        <Geom
                          type="point"
                          position="number*hazardLevel"
                          size={4}
                          shape={[
                            'isClear',
                            isClear => {
                              if (isClear) {
                                return 'circle';
                              } else {
                                return 'cross';
                              }
                            }
                          ]}
                          color="#fa8c16"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1
                          }}
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
                        <Geom
                          type="point"
                          position="number*rate"
                          size={4}
                          shape={[
                            'isClear',
                            isClear => {
                              if (isClear) {
                                return 'circle';
                              } else {
                                return 'cross';
                              }
                            }
                          ]}
                          color="#fa8c16"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1
                          }}
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
                        <Geom
                          type="point"
                          position="number*score"
                          size={4}
                          shape={[
                            'isClear',
                            isClear => {
                              if (isClear) {
                                return 'circle';
                              } else {
                                return 'cross';
                              }
                            }
                          ]}
                          color="#fa8c16"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1
                          }}
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
                        <Geom
                          type="point"
                          position="number*grizzcoPoint"
                          size={4}
                          shape={[
                            'isClear',
                            isClear => {
                              if (isClear) {
                                return 'circle';
                              } else {
                                return 'cross';
                              }
                            }
                          ]}
                          color="#fa8c16"
                          style={{
                            stroke: '#fff',
                            lineWidth: 1
                          }}
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
