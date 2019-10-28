import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Card, Icon, Tooltip, Row, Col, Statistic } from 'antd';

import './ShopGearCard.css';
import cashIcon from '../assets/images/cash.png';
import FileFolderUrl from '../utils/FileFolderUrl';

const { Meta } = Card;

class ShopGearCard extends React.Component {
  render() {
    return (
      <Card
        className="ShopGearCard-gear"
        hoverable={this.props.hoverable}
        bordered={this.props.bordered}
        bodyStyle={{
          padding: '6px'
        }}
        style={(() => {
          if (this.props.pointer) {
            return {
              cursor: 'pointer'
            };
          }
        })()}
        actions={[<Icon type="shopping-cart" key="order" onClick={this.props.action} />]}
      >
        <Row>
          <Col xs={24} sm={12}>
            <Card
              className="ShopGearCard-gear-gear"
              hoverable
              bodyStyle={{
                padding: '6px'
              }}
              style={(() => {
                if (this.props.pointer) {
                  return {
                    cursor: 'pointer'
                  };
                }
              })()}
            >
              <img
                className="ShopGearCard-gear-gear-image"
                alt="gear"
                src={FileFolderUrl.SPLATNET + this.props.gear.gear.url}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              className="ShopGearCard-gear-ability"
              hoverable
              bodyStyle={{
                padding: '6px'
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={<FormattedMessage id="ability.primary" defaultMessage="Primary Ability" />}
                    prefix={
                      <Tooltip title={<FormattedMessage id={this.props.gear.gear.primaryAbility.ability.name} />}>
                        <img
                          className="ShopGearCard-gear-ability-icon"
                          src={FileFolderUrl.SPLATNET + this.props.gear.gear.primaryAbility.url}
                          alt="ability"
                        />
                      </Tooltip>
                    }
                    value=" "
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<FormattedMessage id="app.gear_shop.original_ability" defaultMessage="Original Ability" />}
                    prefix={(() => {
                      if (this.props.gear.originalGear !== null) {
                        return (
                          <Tooltip
                            title={<FormattedMessage id={this.props.gear.originalGear.primaryAbility.ability.name} />}
                          >
                            <img
                              className="ShopGearCard-gear-ability-icon"
                              src={FileFolderUrl.SPLATNET + this.props.gear.originalGear.primaryAbility.url}
                              alt="ability"
                            />
                          </Tooltip>
                        );
                      }
                    })()}
                    value={(() => {
                      if (this.props.gear.originalGear !== null) {
                        return ' ';
                      } else {
                        return this.props.intl.formatMessage({
                          id: 'ability.empty',
                          defaultMessage: 'Empty'
                        });
                      }
                    })()}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={<FormattedMessage id="brand.favored_ability" defaultMessage="Favored Ability" />}
                    prefix={(() => {
                      if (this.props.gear.gear.brand.favoredAbility !== null) {
                        return (
                          <Tooltip
                            title={<FormattedMessage id={this.props.gear.gear.brand.favoredAbility.ability.name} />}
                          >
                            <img
                              className="ShopGearCard-gear-ability-icon"
                              src={FileFolderUrl.SPLATNET + this.props.gear.gear.brand.favoredAbility.url}
                              alt="ability"
                            />
                          </Tooltip>
                        );
                      }
                    })()}
                    value={(() => {
                      if (this.props.gear.gear.brand.favoredAbility !== null) {
                        return ' ';
                      } else {
                        return this.props.intl.formatMessage({
                          id: 'ability.empty',
                          defaultMessage: 'Empty'
                        });
                      }
                    })()}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Meta
          className="ShopGearCard-gear-meta"
          avatar={
            <Tooltip title={<FormattedMessage id={this.props.gear.gear.brand.brand.name} />}>
              <img
                className="ShopGearCard-gear-meta-image"
                src={FileFolderUrl.SPLATNET + this.props.gear.gear.brand.url}
                alt="brand"
              />
            </Tooltip>
          }
          title={<FormattedMessage id={this.props.gear.gear.gear.name} />}
          description={
            <span className="ShopGearCard-gear-meta-cash">
              <img className="ShopGearCard-gear-meta-cash-image" src={cashIcon} alt="cash" />
              {this.props.gear.price}
              {(() => {
                if (this.props.gear.originalPrice !== null) {
                  return ' (' + this.props.gear.originalPrice + ')';
                }
              })()}
            </span>
          }
        />
      </Card>
    );
  }
}

ShopGearCard.defaultProps = {
  bordered: true,
  hoverable: true,
  pointer: false
};

export default injectIntl(ShopGearCard);
