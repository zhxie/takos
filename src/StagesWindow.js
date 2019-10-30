import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { PageHeader, Alert, Button } from 'antd';

import './ShiftsWindow.css';
import icon from './assets/images/rule-tower-control.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import StatisticsHelper from './utils/StatisticsHelper';

class StagesWindow extends React.Component {
  state = {
    // Data
    record: null,
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
    let errorRecord = null;
    let errorStatistics = null;
    let firstErrorLog = null;
    return Promise.all([
      StatisticsHelper.updateStagesRecord(res => {
        this.setState({ record: res });
      }),
      StatisticsHelper.updateStagesStatistics(res => {
        this.setState({ statistics: res });
      })
    ])
      .then(values => {
        if (values[0] instanceof TakosError) {
          errorRecord = values[0];
        }
        if (values[1] instanceof TakosError) {
          errorStatistics = values[1];
        }
      })
      .catch(e => {
        console.error(e);
        errorRecord = e;
        errorStatistics = e;
      })
      .then(() => {
        if (errorRecord !== null) {
          // Handle error
          if (errorRecord instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorRecord.message;
            } else {
              console.error(errorRecord);
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_stages_record';
            }
          }
          this.setState({ updated: true });
        }
      })
      .then(() => {
        if (errorStatistics !== null) {
          // Handle error
          if (errorStatistics instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorStatistics.message;
            } else {
              console.error(errorStatistics);
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_stages_statistics';
            }
          }
        }
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

  formatData = () => {
    let stages = [];
    if (this.state.record !== null) {
      // Record
      this.state.record.forEach(element => {
        let stage = {
          stage: element.stage,
          isSalmonRun: false,
          record: element.result,
          statistics: null
        };
        if (this.state.statistics !== null) {
          const statisticsStage = this.state.statistics.find(ele => {
            return ele.stage.stage === element.stage.stage;
          });
          if (statisticsStage !== undefined) {
            stage.statistics = statisticsStage.result;
          }
        }
        stages.push(stage);
      });
      // Statistics
      if (this.state.statistics !== null) {
        this.state.statistics.forEach(element => {
          if (
            stages.find(ele => {
              return ele.stage.stage === element.stage.stage;
            }) === undefined
          ) {
            let stage = {
              stage: element.stage,
              isSalmonRun: element.isSalmonRun,
              record: null,
              statistics: element.result
            };
            stages.push(stage);
          }
        });
      }
    } else {
      // Statistics
      this.state.statistics.forEach(element => {
        let stage = {
          stage: element.stage,
          isSalmonRun: element.isSalmonRun,
          record: null,
          statistics: element.result
        };
        stages.push(stage);
      });
    }
    return stages;
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
                    id="app.alert.warning.record_can_not_update"
                    defaultMessage="Takos can not update stats, please refresh this page to update."
                  />
                }
                type="warning"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.record !== null || this.state.statistics !== null) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.stages" defaultMessage="Stages" />} />
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

export default StagesWindow;
