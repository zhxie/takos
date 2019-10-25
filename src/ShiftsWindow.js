import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Button } from 'antd';

import './ShiftsWindow.css';
import icon from './assets/images/salmon-run.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import RewardGearCard from './components/RewardGearCard';
import ShiftCard from './components/ShiftCard';
import TakosError from './utils/ErrorHelper';
import ShiftHelper from './utils/ShiftHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;

class ShiftsWindow extends React.Component {
  state = {
    // Data
    shifts: [],
    gear: null,
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    expired: false,
    updated: false
  };

  updateShifts = () => {
    this.setState({ error: false, updated: false });
    let firstError = null;
    ShiftHelper.getShifts()
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
          } else {
            throw new TakosError('can_not_parse_shifts');
          }
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          if (firstError === null) {
            firstError = e;
          } else {
            console.error(e);
          }
        } else {
          console.error(e);
          if (firstError === null) {
            firstError = new TakosError('can_not_update_shifts');
          }
        }
      })
      .then(() => {
        return ShiftHelper.getRewardGear();
      })
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_get_reward_gear');
        } else {
          if (res.error !== null) {
            throw new TakosError(res.error);
          } else {
            this.setState({ gear: res });
          }
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          if (firstError === null) {
            firstError = e;
          } else {
            console.error(e);
          }
        } else {
          console.error(e);
          if (firstError === null) {
            firstError = new TakosError('can_not_update_reward_gear');
          }
        }
      })
      .then(() => {
        if (firstError !== null) {
          this.setState({ error: true, errorLog: firstError.message, updated: true });
        } else {
          this.setState({ loaded: true });
          // Set update interval
          this.timer = setInterval(this.timeout, 60000);
        }
      })
      .catch();
  };

  timeout = () => {
    if (this.state.shifts instanceof Array && this.state.shifts.length > 0) {
      if (new Date(this.state.shifts[0].endTime * 1000) - new Date() < 0) {
        this.setState({ expired: true });
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
          if (this.state.updated) {
            return (
              <Alert
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
          if (this.state.expired) {
            return (
              <Alert
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
        {(() => {
          if (this.state.shifts.length > 0) {
            return (
              <div>
                {(() => {
                  if (new Date() < new Date(this.state.shifts[0].startTime * 1000)) {
                    return (
                      <PageHeader
                        title={<FormattedMessage id="app.shifts.soon" defaultMessage="Soon!" />}
                        subTitle={TimeConverter.getTimeTo(this.state.shifts[0].startTime)}
                      />
                    );
                  } else {
                    return (
                      <PageHeader
                        title={<FormattedMessage id="app.shifts.open" defaultMessage="Open!" />}
                        subTitle={TimeConverter.getTimeRemained(this.state.shifts[0].endTime)}
                      />
                    );
                  }
                })()}
                <div className="ShiftsWindow-content-card" key="1">
                  <ShiftCard shift={this.state.shifts[0]} />
                </div>
                {(() => {
                  if (this.state.gear !== null) {
                    return (
                      <div className="ShiftsWindow-content-card-gear" key="gear">
                        <RewardGearCard gear={this.state.gear} />
                      </div>
                    );
                  }
                })()}
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.shifts.length > 1) {
            return (
              <div>
                <PageHeader
                  title={<FormattedMessage id="app.shifts.next" defaultMessage="Next" />}
                  subTitle={TimeConverter.getTimeTo(this.state.shifts[1].startTime)}
                />
                <div className="ShiftsWindow-content-card" key="2">
                  <ShiftCard shift={this.state.shifts[1]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.shifts.length > 2) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.shifts.future" defaultMessage="Future" />} />
                {this.state.shifts.slice(2).map((item, index) => {
                  return (
                    <div className="ShiftsWindow-content-card" key={2 + index}>
                      <ShiftCard shift={item} />
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
              <Button onClick={this.updateShifts} type="primary">
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
          <Header className="ShiftsWindow-header" style={{ zIndex: 1 }}>
            <img className="ShiftsWindow-header-icon" src={icon} alt="icon" />
            <p className="ShiftsWindow-header-title">
              <FormattedMessage id="app.shifts" defaultMessage="Shifts" />
            </p>
            <p className="ShiftsWindow-header-subtitle">
              <FormattedMessage id="app.salmon_run" defaultMessage="Salmon Run" />
            </p>
          </Header>
          <Content className="ShiftsWindow-content">
            {(() => {
              if (!this.state.loaded) {
                return <LoadingResult />;
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
    this.updateShifts();
  }

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.timer);
  }
}

export default ShiftsWindow;
