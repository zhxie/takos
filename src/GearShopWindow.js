import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Button } from 'antd';

import './GearShopWindow.css';
import icon from './assets/images/character-cooler-heads-2.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import ShopGearCard from './components/ShopGearCard';
import TakosError from './utils/ErrorHelper';
import GearShopHelper from './utils/GearShopHelper';
import TimeConverter from './utils/TimeConverter';

const { Header, Content } = Layout;

class GearShopWindow extends React.Component {
  state = {
    // Data
    order: null,
    gears: [],
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    expired: false,
    orderUpdated: false,
    gearsUpdated: false
  };

  updateData = () => {
    this.setState({ error: false, orderUpdated: false, gearsUpdated: false });
    let errorOrder = null;
    let errorGears = null;
    let firstErrorLog = null;
    return GearShopHelper.getOrderedGear()
      .then(res => {
        if (res !== null) {
          if (res.error != null) {
            throw res.error;
          } else {
            this.setState({ order: res });
          }
        } else {
          this.setState({ order: null });
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          errorOrder = e;
        } else {
          console.error(e);
          errorOrder = new TakosError('can_not_update_ordered_gear');
        }
      })
      .then(() => {
        return GearShopHelper.getShopGears();
      })
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_get_shop_gears');
        } else {
          res.forEach(element => {
            if (element.error !== null) {
              throw element.error;
            }
          });
          this.setState({ gears: res });
          // Set update interval
          this.timer = setInterval(this.timeout, 60000);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          errorGears = e;
        } else {
          console.error(e);
          errorGears = new TakosError('can_not_update_shop_gears');
        }
      })
      .then(() => {
        if (errorOrder !== null) {
          // Handle error
          if (errorOrder instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorOrder.message;
            } else {
              console.error(errorOrder);
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_ordered_gear';
            }
          }
          this.setState({ orderUpdated: true });
        }
      })
      .then(() => {
        if (errorGears !== null) {
          // Handle error
          if (errorGears instanceof TakosError) {
            if (firstErrorLog === null) {
              firstErrorLog = errorGears.message;
            } else {
              console.error(errorGears);
            }
          } else {
            if (firstErrorLog === null) {
              firstErrorLog = 'can_not_update_shop_gears';
            }
          }
          this.setState({ gearsUpdated: true });
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

  timeout = () => {
    if (this.state.gears instanceof Array && this.state.gears.length > 0) {
      if (new Date(this.state.gears[0].endTime * 1000) - new Date() < 0) {
        this.setState({ expired: true });
      } else {
        // Force update the page to update the remaining and coming time
        this.forceUpdate();
      }
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
                    id="app.alert.warning.ordered_gear_can_not_update"
                    defaultMessage="Takos can not update ordered gear, please refresh this page to update."
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
                    id="app.alert.info.shop_gears_expired"
                    defaultMessage="It seems that these shop gears have expired, please refresh this page to update."
                  />
                }
                type="info"
                showIcon
              />
            );
          }
        })()}
        {(() => {
          if (this.state.order !== null) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.gear_shop.order" defaultMessage="Ordered" />} />
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.gears.length > 0) {
            return (
              <div>
                <PageHeader
                  title={<FormattedMessage id="app.gear_shop" defaultMessage="Gear Shop" />}
                  subTitle={TimeConverter.getTimeRemained(this.state.gears[0].endTime)}
                />
                {this.state.gears.map((item, index) => {
                  return (
                    <div className="GearShopWindow-content-card" key={1 + index}>
                      <ShopGearCard gear={item} />
                    </div>
                  );
                })}
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
        <Layout>
          <Header className="GearShopWindow-header" style={{ zIndex: 1 }}>
            <img className="GearShopWindow-header-icon" src={icon} alt="icon" />
            <p className="GearShopWindow-header-title">
              <FormattedMessage id="app.gear_shop" defaultMessage="Gear Shop" />
            </p>
          </Header>
          <Content className="GearShopWindow-content">
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
    this.updateData();
  }

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.timer);
  }
}

export default injectIntl(GearShopWindow);
