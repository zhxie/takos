import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { PageHeader, Alert, Button, Modal } from 'antd';

import './GearShopWindow.css';
import icon from './assets/images/character-cooler-heads-2.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import OrderedGearCard from './components/OrderedGearCard';
import ShopGearCard from './components/ShopGearCard';
import WindowLayout from './components/WindowLayout';
import TakosError from './utils/ErrorHelper';
import GearShopHelper from './utils/GearShopHelper';
import TimeConverter from './utils/TimeConverter';

const { confirm } = Modal;

class GearShopWindow extends React.Component {
  state = {
    // Data
    order: null,
    gears: [],
    // Render
    loaded: false,
    error: false,
    errorLog: 'unknown_error',
    orderUpdated: false,
    gearsUpdated: false,
    expired: false
  };

  updateData = () => {
    this.setState({ error: false, orderUpdated: false, gearsUpdated: false, expired: false });
    let errorOrder = null;
    let errorGears = null;
    let firstErrorLog = null;
    return Promise.allSettled([
      GearShopHelper.updateOrderedGear(res => {
        this.setState({ order: res });
      }),
      GearShopHelper.updateShopGears(res => {
        this.setState({ gears: res });
        // Set update interval
        this.timer = setInterval(this.timeout, 60000);
      })
    ])
      .then(results => {
        if (results[0].value instanceof TakosError) {
          errorOrder = results[0].value;
        }
        if (results[1].value instanceof TakosError) {
          errorGears = results[1].value;
        }
      })
      .catch(e => {
        console.error(e);
        errorOrder = e;
        errorGears = e;
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

  orderGear = id => {
    const thisHandler = this;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.order_gear',
        defaultMessage: 'Do you want to order gear?'
      }),
      content: this.props.intl.formatMessage({
        id: 'app.modal.confirm.order_gear.content',
        defaultMessage:
          'You can order one piece of gear at a time, and ordering more gear before making your purchase will cancel the original order.'
      }),
      autoFocusButton: 'cancel',
      onOk() {
        return GearShopHelper.orderGear(id)
          .then(res => {
            if (res === true) {
              thisHandler.setState({ loaded: false });
              thisHandler.updateData();
            } else {
              throw new TakosError('can_not_order_gear');
            }
          })
          .catch(e => {
            if (e instanceof TakosError) {
              thisHandler.setState({ loaded: false, error: true, errorLog: e.message });
            } else {
              console.error(e);
              thisHandler.setState({ loaded: false, error: true, errorLog: 'can_not_order_gear' });
            }
          });
      },
      onCancel() {}
    });
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
          if (this.state.orderUpdated) {
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
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        {(() => {
          if (this.state.gearsUpdated) {
            return (
              <Alert
                message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
                description={
                  <FormattedMessage
                    id="app.alert.warning.shop_gears_can_not_update"
                    defaultMessage="Takos can not update shop gears, please refresh this page to update."
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
                style={{ marginBottom: '12px' }}
              />
            );
          }
        })()}
        {(() => {
          if (this.state.order !== null) {
            return (
              <div>
                <PageHeader title={<FormattedMessage id="app.gear_shop.order" defaultMessage="Ordered" />} />
                <OrderedGearCard gear={this.state.order} />
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
                      <ShopGearCard gear={item} action={this.orderGear.bind(this, item.id)} />
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
        <WindowLayout icon={icon} title={<FormattedMessage id="app.gear_shop" defaultMessage="Gear Shop" />}>
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

  componentWillUnmount() {
    // Remove update timer
    clearInterval(this.timer);
  }
}

export default injectIntl(GearShopWindow);
