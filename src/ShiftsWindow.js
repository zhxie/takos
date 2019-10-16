import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Button } from 'antd';

import './ShiftsWindow.css';
import icon from './assets/images/salmon-run.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import ShiftCard from './components/ShiftCard';
import TakosError from './utils/ErrorHelper';
import ShiftHelper from './utils/ShiftHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;

class ShiftsWindow extends React.Component {
  state = {
    // Data
    data: [],
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    expired: false,
    updated: false
  };

  updateShifts = () => {
    this.setState({ error: false, updated: false });
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
            this.setState({ data: res, loaded: true });
            // Set update interval
            this.timer = setInterval(this.timeout, 60000);
          } else {
            throw new TakosError('can_not_parse_shifts');
          }
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message, updated: true });
        } else {
          console.error(e);
          this.setState({ error: true, errorLog: 'can_not_parse_shifts', updated: true });
        }
      });
  };

  timeout = () => {
    if (this.state.data instanceof Array && this.state.data.length > 0) {
      if (new Date(this.state.data[0].endTime * 1000) - new Date() < 0) {
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
          if (this.state.data.length > 0) {
            return (
              <div>
                {(() => {
                  if (new Date() < new Date(this.state.data[0].startTime * 1000)) {
                    return <PageHeader title={<FormattedMessage id="app.shifts.soon" defaultMessage="Soon!" />} />;
                  } else {
                    return <PageHeader title={<FormattedMessage id="app.shifts.open" defaultMessage="Open!" />} />;
                  }
                })()}
                <div className="ShiftsWindow-content-card" key="1">
                  <ShiftCard shift={this.state.data[0]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 1) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.shifts.next" defaultMessage="Next" />} />
                <div className="ShiftsWindow-content-card" key="2">
                  <ShiftCard shift={this.state.data[1]} />
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.data.length > 2) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.shifts.future" defaultMessage="Future" />} />
                {this.state.data.slice(2).map((item, index) => {
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
