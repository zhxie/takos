import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { PageHeader, Button, Modal } from 'antd';

import './GearsStatisticsWindow.css';
import icon from './assets/images/gear-clothes-basic-tee.png';
import ErrorResult from './components/ErrorResult';
import GearStatisticsCard from './components/GearStatisticsCard';
import LoadingResult from './components/LoadingResult';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import StatisticsHelper from './utils/StatisticsHelper';

class GearsStatisticsWindow extends React.Component {
  state = {
    // Data
    statistics: null,
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error'
  };

  updateData = () => {
    this.setState({
      loaded: false,
      error: false
    });
    return StatisticsHelper.updateGearsStatistics(res => {
      this.setState({ statistics: res });
    })
      .then(res => {
        if (res instanceof TakosError) {
          throw res;
        }
      })
      .then(() => {
        this.setState({ loaded: true });
      })
      .then(() => {
        const search = queryString.parse(this.props.location.search);
        switch (search.type) {
          case 'headgear':
            this.scrollToAnchor(this.props.location.hash.replace('#', 'headgear-'));
            break;
          case 'clothes':
            this.scrollToAnchor(this.props.location.hash.replace('#', 'clothes-'));
            break;
          case 'shoes':
            this.scrollToAnchor(this.props.location.hash.replace('#', 'shoes-'));
            break;
          default:
            this.scrollToAnchor(this.props.location.hash.replace('#', 'headgear-'));
            break;
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          this.setState({ error: true, errorLog: e.message });
        } else {
          console.error(e);
          this.setState({ error: true, errorLog: 'can_not_update_gears_statistics' });
        }
      });
  };

  scrollToAnchor = anchorName => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else {
        Modal.info({
          title: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_gear',
            defaultMessage: 'No matching gear'
          }),
          content: this.props.intl.formatMessage({
            id: 'app.modal.info.no_matching_gear.content',
            defaultMessage:
              'Takos can not find a matching gear in statistics. You can switch whether to show SplatNet stats in statistics in settings.'
          })
        });
      }
    }
  };

  renderContent() {
    console.log(this.state.statistics);
    return (
      <div>
        {(() => {
          if (this.state.statistics.headgears.length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="gear.headgears" defaultMessage="Headgears" />} />
                {this.state.statistics.headgears.map(element => {
                  return (
                    <div
                      className="GearsStatisticsWindow-content-card"
                      key={element.gear.value}
                      id={'headgear-' + element.gear.value}
                    >
                      <GearStatisticsCard gear={element} />
                    </div>
                  );
                })}
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.statistics.clothes.length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="gear.clothes" defaultMessage="Clothes" />} />
                {this.state.statistics.clothes.map(element => {
                  return (
                    <div
                      className="GearsStatisticsWindow-content-card"
                      key={element.gear.value}
                      id={'headgear-' + element.gear.value}
                    >
                      <GearStatisticsCard gear={element} />
                    </div>
                  );
                })}
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.statistics.shoes.length > 0) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="gear.shoes" defaultMessage="Shoes" />} />
                {this.state.statistics.shoes.map(element => {
                  return (
                    <div
                      className="GearsStatisticsWindow-content-card"
                      key={element.gear.value}
                      id={'headgear-' + element.gear.value}
                    >
                      <GearStatisticsCard gear={element} />
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
        <WindowLayout icon={icon} title={<FormattedMessage id="app.gears" defaultMessage="Gears" />}>
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

export default injectIntl(GearsStatisticsWindow);
