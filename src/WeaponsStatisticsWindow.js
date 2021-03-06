import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { PageHeader, Alert, Button, Modal } from 'antd';

import './WeaponsStatisticsWindow.css';
import icon from './assets/images/weapon-splattershot.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import WeaponStatisticsCard from './components/WeaponStatisticsCard';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import StatisticsHelper from './utils/StatisticsHelper';
import StorageHelper from './utils/StorageHelper';

class WeaponsStatisticsWindow extends React.Component {
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
          StatisticsHelper.updateWeaponsRecords((res) => {
            this.setState({ records: res });
          })
        );
      } else {
        resolve(
          StatisticsHelper.updateWeaponsStatistics((res) => {
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
        const search = queryString.parse(this.props.location.search);
        if (search.salmon !== undefined && search.salmon === '1') {
          this.scrollToAnchor(this.props.location.hash.replace('#', 'salmon-'));
        } else {
          this.scrollToAnchor(this.props.location.hash.replace('#', ''));
        }
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message, updated: true });
        } else {
          console.error(e);
          if (StorageHelper.showSplatNetStats()) {
            this.setState({ error: true, errorLog: 'can_not_update_weapons_records', updated: true });
          } else {
            this.setState({ error: true, errorLog: 'can_not_update_weapons_statistics', updated: true });
          }
        }
      });
  };

  formatData = () => {
    let weapons = [];
    if (StorageHelper.showSplatNetStats()) {
      // Records
      this.state.records.forEach((element) => {
        element.isSalmonRun = false;
        weapons.push(element);
      });
    } else {
      // Statistics
      this.state.statistics.forEach((element) => {
        if (element.winMeter === null) {
          element.winMeter = 0;
        }
        weapons.push(element);
      });
    }
    return weapons;
  };

  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else {
        Modal.info({
          title: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_weapon',
            defaultMessage: 'No matching weapon'
          }),
          content: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_weapon.content',
            defaultMessage:
              'Takos can not find a matching weapon in statistics. You can switch whether to show SplatNet stats in statistics in settings.'
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
            return a.weapon.mainWeapon.value - b.weapon.mainWeapon.value;
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
                              className="WeaponStatisticsWindow-content-card"
                              key={element.weapon.mainWeapon.value}
                              id={element.weapon.mainWeapon.value}
                            >
                              <WeaponStatisticsCard weapon={element} />
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
                              className="WeaponStatisticsWindow-content-card"
                              key={element.weapon.mainWeapon.value}
                              id={'salmon-' + element.weapon.mainWeapon.value}
                            >
                              <WeaponStatisticsCard weapon={element} />
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
        <WindowLayout icon={icon} title={<FormattedMessage id="app.weapons" defaultMessage="Weapons" />}>
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

export default injectIntl(WeaponsStatisticsWindow);
