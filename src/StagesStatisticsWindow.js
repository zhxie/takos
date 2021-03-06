import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PageHeader, Alert, Button, Modal } from 'antd';

import './StagesStatisticsWindow.css';
import icon from './assets/images/rule-tower-control.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import StageStatisticsCard from './components/StageStatisticsCard';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import StatisticsHelper from './utils/StatisticsHelper';
import StorageHelper from './utils/StorageHelper';

class StagesStatisticsWindow extends React.Component {
  state = {
    // Data
    records: null,
    statistics: null,
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    updated: false
  };

  updateData = () => {
    this.setState({
      loaded: false,
      error: false,
      updated: false
    });
    return new Promise((resolve) => {
      if (StorageHelper.showSplatNetStats()) {
        resolve(
          StatisticsHelper.updateStagesRecords((res) => {
            this.setState({ records: res });
          })
        );
      } else {
        resolve(
          StatisticsHelper.updateStagesStatistics((res) => {
            this.setState({ statistics: res });
          })
        );
      }
    })
      .then((res) => {
        if (res instanceof TakosError) {
          throw res;
        }
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .then(() => {
        this.scrollToAnchor(this.props.location.hash.replace('#', ''));
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message, updated: true });
        } else {
          console.error(e);
          if (StorageHelper.showSplatNetStats()) {
            this.setState({ error: true, errorLog: 'can_not_update_stages_records', updated: true });
          } else {
            this.setState({ error: true, errorLog: 'can_not_update_stages_statistics', updated: true });
          }
        }
      });
  };

  formatData = () => {
    let stages = [];
    if (StorageHelper.showSplatNetStats()) {
      // Records
      this.state.records.forEach((element) => {
        element.isSalmonRun = false;
        stages.push(element);
      });
    } else {
      // Statistics
      this.state.statistics.forEach((element) => {
        stages.push(element);
      });
    }
    return stages;
  };

  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else {
        Modal.info({
          title: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_stage',
            defaultMessage: 'No matching stage'
          }),
          content: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_stage.content',
            defaultMessage:
              'Takos can not find a matching stage in statistics. You can switch whether to show SplatNet stats in statistics in settings.'
          })
        });
      }
    }
  };

  renderContent() {
    return (
      <div>
        {(() => {
          if (this.state.updated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.records_can_not_update"
                    defaultMessage="Takos can not update stats, please refresh this page to update."
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
          const data = this.formatData().sort((a, b) => {
            return a.stage.stage.value - b.stage.stage.value;
          });
          if (data.length > 0) {
            const battles = data.filter((element) => !element.isSalmonRun);
            const jobs = data.filter((element) => element.isSalmonRun);
            return (
              <div>
                {(() => {
                  if (battles.length > 0) {
                    return (
                      <div>
                        <PageHeader title={<FormattedMessage id="app.battles" defaultMessage="Battles" />} />
                        {battles.map((element) => {
                          return (
                            <div
                              className="StagesStatisticsWindow-content-card"
                              key={element.stage.stage.value}
                              id={element.stage.stage.value}
                            >
                              <StageStatisticsCard stage={element} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })()}
                {(() => {
                  if (jobs.length > 0) {
                    return (
                      <div>
                        <PageHeader title={<FormattedMessage id="app.jobs" defaultMessage="Jobs" />} />
                        {jobs.map((element) => {
                          return (
                            <div
                              className="StagesStatisticsWindow-content-card"
                              key={element.stage.stage.value}
                              id={element.stage.stage.value}
                            >
                              <StageStatisticsCard stage={element} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })()}
              </div>
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
            />
          ]}
          extra={[
            [
              <Button key="update" onClick={this.updateData} type="primary">
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
        <WindowLayout icon={icon} title={<FormattedMessage id="app.stages" defaultMessage="Stages" />}>
          {(() => {
            if (!this.state.loaded) {
              return <LoadingResult />;
            } else {
              return this.renderContent();
            }
          })()}
        </WindowLayout>
      );
    }
  }

  componentDidMount() {
    this.updateData();
  }
}

export default injectIntl(StagesStatisticsWindow);
