import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { PageHeader, Alert, Button, Table, Tag, Tooltip, Empty, Progress, Modal, Icon } from 'antd';

import './JobsWindow.css';
import icon from './assets/images/salmon-run.png';
import { OctolingsDeathIcon } from './components/CustomIcons';
import ErrorResult from './components/ErrorResult';
import JobModal from './components/JobModal';
import LoadingResult from './components/LoadingResult';
import WindowLayout from './components/WindowLayout';
import { Stage } from './models/Stage';
import { MainWeapon, SpecialWeapon } from './models/Weapon';
import TakosError from './utils/ErrorHelper';
import FileFolderUrl from './utils/FileFolderUrl';
import JobHelper from './utils/JobHelper';
import StorageHelper from './utils/StorageHelper';

const { Column } = Table;
const { confirm } = Modal;

class JobsWindow extends React.Component {
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
    showJobId: null,
    search: null
  };

  constructor(props) {
    super(props);
    if (this.props.location.hash !== '') {
      this.state.showJobId = parseInt(this.props.location.hash.replace('#', ''));
    } else {
      this.state.showJobId = null;
    }
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
          this.setState({ updateTotal: -1 });
          return this.getJobs();
        }
        return getJobRecursively(res.from, res.to).then(res => {
          if (res instanceof TakosError) {
            throw res;
          } else {
            this.setState({ updateTotal: -1 });
            return this.getJobs();
          }
        });
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(e => {
        this.setState({ updateTotal: -1 });
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
    // Every item in list should own an unique key property
    return StorageHelper.jobs()
      .then(res => {
        res.forEach(element => {
          element.key = element.number;
          element.players.forEach(element => {
            element.key = element.id;
            element.bossSalmoniodKills.forEach(element => {
              element.key = element.salmoniod.value;
            });
          });
          element.waves.forEach((element, index) => {
            element.key = index;
          });
          element.bossSalmoniodAppearances.forEach(element => {
            element.key = element.salmoniod.value;
          });
        });
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

  showJob = number => {
    if (this.state.data instanceof Array) {
      const job = this.state.data.find(element => {
        return element.number === number;
      });
      if (job !== undefined) {
        let buttons = [];
        buttons.push(
          <Button key="delete" type="danger" onClick={this.deleteJob.bind(this, number)}>
            <FormattedMessage id="app.jobs.delete" defaultMessage="Delete Job" />
          </Button>
        );
        const filteredJobs = this.filteredJobs();
        let toButtons = [];
        // Find previous job
        let previous = 0;
        filteredJobs.forEach(element => {
          if (element.number > previous && element.number < number) {
            previous = element.number;
          }
        });
        if (previous > 0) {
          toButtons.push(
            <Button
              key="previous"
              onClick={() => {
                window.location.hash = '/jobs{0}#'.format(this.props.location.search) + previous;
              }}
            >
              <Icon type="left" />
              <FormattedMessage id="app.jobs.previous" defaultMessage="Previous Job #{id}" values={{ id: previous }} />
            </Button>
          );
        }
        // Find next job
        let next = Number.MAX_SAFE_INTEGER;
        filteredJobs.forEach(element => {
          if (element.number < next && element.number > number) {
            next = element.number;
          }
        });
        if (next < Number.MAX_SAFE_INTEGER) {
          toButtons.push(
            <Button
              key="next"
              onClick={() => {
                window.location.hash = '/jobs{0}#'.format(this.props.location.search) + next;
              }}
            >
              <FormattedMessage id="app.jobs.next" defaultMessage="Next Job #{id}" values={{ id: next }} />
              <Icon type="right" />
            </Button>
          );
        }
        if (toButtons.length > 0) {
          buttons.push(
            <Button.Group key="group" style={{ marginLeft: '8px' }}>
              {toButtons.map(element => {
                return element;
              })}
            </Button.Group>
          );
        }
        return { job, buttons };
      } else {
        return null;
      }
    }
  };

  hideJob = () => {
    // Modify hash to hide job
    window.location.hash = '/jobs' + this.props.location.search;
  };

  deleteJob = number => {
    const thisHandler = this;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.delete_job',
        defaultMessage: 'Do you want to delete job?'
      }),
      content: this.props.intl.formatMessage({
        id: 'app.modal.confirm.delete_job.content',
        defaultMessage:
          'Once the job is deleted, you will not be able to undo. It is recommended that you first backup the data.'
      }),
      okType: 'danger',
      autoFocusButton: 'cancel',
      icon: <Icon type="exclamation-circle" />,
      onOk() {
        StorageHelper.removeJob(number)
          .then(res => {
            if (res instanceof TakosError) {
              throw res;
            } else {
              thisHandler.setState({
                data: [],
                loaded: false,
                error: false,
                showJobId: null,
                updateCurrent: 0,
                updateTotal: 0,
                updated: false
              });
              // Modify hash
              window.location.hash = '/jobs' + thisHandler.props.location.search;
            }
          })
          .catch(e => {
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
                      l: msg => <Link to="/jobs">{msg}</Link>
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
            title={<FormattedMessage id="app.jobs" defaultMessage="Jobs" />}
            subTitle={(() => {
              return (
                <Button type="default" onClick={this.updateJobs}>
                  <FormattedMessage id="app.jobs.update" defaultMessage="Update Data" />
                </Button>
              );
            })()}
          />
          <Table
            dataSource={this.filteredJobs()}
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
            onRow={record => {
              return {
                onClick: () => {
                  window.location.hash = '/jobs{0}#'.format(this.props.location.search) + record.number;
                }
              };
            }}
          >
            <Column
              title={<FormattedMessage id="job.id.prefix" defaultMessage="#" />}
              key="id"
              align="center"
              dataIndex="number"
              sorter={(a, b) => a.number - b.number}
              sortDirections={['descend', 'ascend']}
              defaultSortOrder="descend"
            />
            <Column
              title={<FormattedMessage id="job.result" defaultMessage="Result" />}
              key="result"
              align="center"
              render={text => {
                if (text.isClear) {
                  return (
                    <Tag className="JobsWindow-content-tag" color="green" key="result">
                      <FormattedMessage id={text.result.name} />
                    </Tag>
                  );
                } else {
                  return (
                    <span>
                      <Tag className="JobsWindow-content-tag" color="orange" key="fail">
                        <FormattedMessage id="job_result.defeat" defaultMessage="Defeat" />
                      </Tag>
                      <Tag className="JobsWindow-content-tag-adj" color="orange" key="result">
                        <FormattedMessage id={text.result.name} />
                      </Tag>
                    </span>
                  );
                }
              }}
            />
            <Column
              title={<FormattedMessage id="grade" defaultMessage="Rank" />}
              key="grade"
              align="center"
              render={text => {
                return (
                  <span>
                    {(() => {
                      if (text.gradePointDelta !== 0) {
                        return (
                          <b>
                            {(() => {
                              return <FormattedMessage id={text.grade.name} />;
                            })()}{' '}
                            / {text.gradePoint}
                          </b>
                        );
                      } else {
                        return (
                          <span>
                            {(() => {
                              return <FormattedMessage id={text.grade.name} />;
                            })()}{' '}
                            / {text.gradePoint}
                          </span>
                        );
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
                    title={<FormattedMessage id="job.hazard_level" defaultMessage="Hazard Level" />}
                    key="hazardLevel"
                    align="center"
                    render={text => {
                      if (text.hazardLevel >= 200) {
                        return (
                          <Tooltip
                            title={<FormattedMessage id="job.hazard_level.max" defaultMessage="Hazard Level MAX!!" />}
                          >
                            <Progress percent={100} showInfo={false} strokeColor="#fa541c" />
                          </Tooltip>
                        );
                      } else {
                        return (
                          <Tooltip
                            title={
                              <FormattedMessage
                                id="job.hazard_level.value"
                                defaultMessage="{value}%"
                                values={{
                                  value: text.hazardLevel
                                }}
                              />
                            }
                          >
                            <Progress percent={(text.hazardLevel / 200) * 100} showInfo={false} strokeColor="#fa8c16" />
                          </Tooltip>
                        );
                      }
                    }}
                  />
                );
              }
            })()}
            <Column
              title={<FormattedMessage id="stage" defaultMessage="Stage" />}
              key="stage"
              align="center"
              render={text => (
                <span>
                  <FormattedMessage id={text.shift.stage.stage.name} />
                </span>
              )}
              filters={[
                {
                  text: <FormattedMessage id={Stage.spawningGrounds.name} />,
                  value: Stage.spawningGrounds.value
                },
                {
                  text: <FormattedMessage id={Stage.maroonersBay.name} />,
                  value: Stage.maroonersBay.value
                },
                {
                  text: <FormattedMessage id={Stage.lostOutpost.name} />,
                  value: Stage.lostOutpost.value
                },
                {
                  text: <FormattedMessage id={Stage.salmonidSmokeyard.name} />,
                  value: Stage.salmonidSmokeyard.value
                },
                {
                  text: <FormattedMessage id={Stage.ruinsOfArkPolaris.name} />,
                  value: Stage.ruinsOfArkPolaris.value
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
              render={text =>
                text.selfPlayer.weapons.map((element, index) => {
                  return (
                    <Tooltip key={index} title={<FormattedMessage id={element.mainWeapon.name} />}>
                      <span>
                        {(() => {
                          if (index === 0) {
                            return (
                              <img
                                className="JobsWindow-content-table-icon"
                                src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                                alt="special"
                              />
                            );
                          } else {
                            return (
                              <img
                                className="JobsWindow-content-table-icon-adj"
                                src={FileFolderUrl.SPLATNET + element.mainWeaponUrl}
                                alt="special"
                              />
                            );
                          }
                        })()}
                      </span>
                    </Tooltip>
                  );
                })
              }
              filters={[
                {
                  text: <FormattedMessage id={MainWeapon.bold.name} />,
                  value: MainWeapon.bold.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.wakaba.name} />,
                  value: MainWeapon.wakaba.value
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
                  text: <FormattedMessage id={MainWeapon.sshooter.name} />,
                  value: MainWeapon.sshooter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._52Gal.name} />,
                  value: MainWeapon._52Gal.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nzap85.name} />,
                  value: MainWeapon.nzap85.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.prime.name} />,
                  value: MainWeapon.prime.value
                },
                {
                  text: <FormattedMessage id={MainWeapon._96Gal.name} />,
                  value: MainWeapon._96Gal.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.jetsweeper.name} />,
                  value: MainWeapon.jetsweeper.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bottlegeyser.name} />,
                  value: MainWeapon.bottlegeyser.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nova.name} />,
                  value: MainWeapon.nova.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hotblaster.name} />,
                  value: MainWeapon.hotblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.longblaster.name} />,
                  value: MainWeapon.longblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.clashblaster.name} />,
                  value: MainWeapon.clashblaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapid.name} />,
                  value: MainWeapon.rapid.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.rapidElite.name} />,
                  value: MainWeapon.rapidElite.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.l3Reelgun.name} />,
                  value: MainWeapon.l3Reelgun.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.h3Reelgun.name} />,
                  value: MainWeapon.h3Reelgun.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.carbon.name} />,
                  value: MainWeapon.carbon.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatroller.name} />,
                  value: MainWeapon.splatroller.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dynamo.name} />,
                  value: MainWeapon.dynamo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.variableroller.name} />,
                  value: MainWeapon.variableroller.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.pablo.name} />,
                  value: MainWeapon.pablo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hokusai.name} />,
                  value: MainWeapon.hokusai.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.squicleanA.name} />,
                  value: MainWeapon.squicleanA.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatcharger.name} />,
                  value: MainWeapon.splatcharger.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatscope.name} />,
                  value: MainWeapon.splatscope.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4K.name} />,
                  value: MainWeapon.liter4K.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.liter4KScope.name} />,
                  value: MainWeapon.liter4KScope.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bamboo14Mk1.name} />,
                  value: MainWeapon.bamboo14Mk1.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.soytuber.name} />,
                  value: MainWeapon.soytuber.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.bucketslosher.name} />,
                  value: MainWeapon.bucketslosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hissen.name} />,
                  value: MainWeapon.hissen.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.screwslosher.name} />,
                  value: MainWeapon.screwslosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.furo.name} />,
                  value: MainWeapon.furo.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.explosher.name} />,
                  value: MainWeapon.explosher.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.splatspinner.name} />,
                  value: MainWeapon.splatspinner.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.barrelspinner.name} />,
                  value: MainWeapon.barrelspinner.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.hydra.name} />,
                  value: MainWeapon.hydra.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kugelschreiber.name} />,
                  value: MainWeapon.kugelschreiber.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.nautilus47.name} />,
                  value: MainWeapon.nautilus47.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.sputtery.name} />,
                  value: MainWeapon.sputtery.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.maneuver.name} />,
                  value: MainWeapon.maneuver.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kelvin525.name} />,
                  value: MainWeapon.kelvin525.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.dualsweeper.name} />,
                  value: MainWeapon.dualsweeper.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.quadhopperBlack.name} />,
                  value: MainWeapon.quadhopperBlack.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.parashelter.name} />,
                  value: MainWeapon.parashelter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.campingshelter.name} />,
                  value: MainWeapon.campingshelter.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.spygadget.name} />,
                  value: MainWeapon.spygadget.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kumaBlaster.name} />,
                  value: MainWeapon.kumaBlaster.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kumaBrella.name} />,
                  value: MainWeapon.kumaBrella.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kumaCharger.name} />,
                  value: MainWeapon.kumaCharger.value
                },
                {
                  text: <FormattedMessage id={MainWeapon.kumaSlosher.name} />,
                  value: MainWeapon.kumaSlosher.value
                }
              ]}
              onFilter={(value, record) => {
                return (
                  record.selfPlayer.weapons.find(element => {
                    return element.mainWeapon.value === value;
                  }) !== undefined
                );
              }}
            />
            <Column
              title={<FormattedMessage id="weapon.special" defaultMessage="Special Weapon" />}
              key="specialWeapon"
              align="center"
              render={text => (
                <Tooltip title={<FormattedMessage id={text.selfPlayer.specialWeapon.specialWeapon.name} />}>
                  <span>
                    <img
                      className="JobsWindow-content-table-icon"
                      src={FileFolderUrl.SPLATNET + text.selfPlayer.specialWeapon.specialWeaponUrlA}
                      alt="special"
                    />
                  </span>
                </Tooltip>
              )}
              filters={[
                {
                  text: <FormattedMessage id={SpecialWeapon.splatBombLauncher.name} />,
                  value: SpecialWeapon.splatBombLauncher.value
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
                }
              ]}
              onFilter={(value, record) => {
                return record.selfPlayer.specialWeapon.specialWeapon.value === value;
              }}
            />
            <Column
              title={<FormattedMessage id="job.golden_egg" defaultMessage="Golden Egg" />}
              key="goldenEgg"
              align="center"
              render={text => {
                return (
                  <span>
                    {text.selfPlayer.goldenEgg} / {text.goldenEgg}
                  </span>
                );
              }}
            />
            <Column
              title={<FormattedMessage id="job.power_egg" defaultMessage="Power Egg" />}
              key="powerEgg"
              align="center"
              render={text => {
                return (
                  <span>
                    {text.selfPlayer.powerEgg} / {text.powerEgg}
                  </span>
                );
              }}
            />
            {(() => {
              if (!StorageHelper.useSimpleLists()) {
                return (
                  <Column
                    title={<FormattedMessage id="job.grizzco_points" defaultMessage="Grizzco Points" />}
                    key="grizzcoPoint"
                    align="center"
                    dataIndex="grizzcoPoint"
                  />
                );
              }
            })()}
          </Table>
          {(() => {
            // Find job
            if (this.state.showJobId !== null) {
              this.job = this.showJob(this.state.showJobId);
            }
            if (this.job === null) {
              return <Redirect to="/404" />;
            } else {
              if (this.job !== undefined) {
                return (
                  <JobModal
                    value={this.job.job}
                    visible={this.state.showJobId !== null}
                    onCancel={this.hideJob}
                    footer={this.job.buttons}
                    width={950}
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
    let showJobId = null;
    if (this.props.location.hash !== '') {
      showJobId = parseInt(this.props.location.hash.replace('#', ''));
    }
    let search = null;
    if (this.props.location.search !== '') {
      search = queryString.parse(this.props.location.search);
    }
    if (
      this.props.location.hash !== prevProps.location.hash ||
      this.props.location.search !== prevProps.location.search
    ) {
      this.setState({ showJobId: showJobId, search: search });
    }
    if (this.state.loaded !== prevState.loaded && this.state.loaded === false) {
      this.updateJobs();
    }
  }
}

export default injectIntl(JobsWindow);
