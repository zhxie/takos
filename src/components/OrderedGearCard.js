import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Card, Icon, Tooltip, Row, Col, Statistic } from 'antd';

import './OrderedGearCard.css';
import cashIcon from '../assets/images/cash.png';
import FileFolderUrl from '../utils/FileFolderUrl';

const { Meta } = Card;

class OrderedGearCard extends React.Component {
  render() {
    return (
      <Card
        className="OrderedGearCard-gear"
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
      >
        <Row>
          <Col xs={24} sm={12}>
            <Card
              className="OrderedGearCard-gear-gear"
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
                className="OrderedGearCard-gear-gear-image"
                alt="gear"
                src={FileFolderUrl.SPLATNET + this.props.gear.gear.url}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              className="OrderedGearCard-gear-ability"
              hoverable
              bodyStyle={{
                padding: '12px 12px 0'
              }}
            >
              <Row gutter={16}>
                <Col className="OrderedGearCard-gear-column" span={24}>
                  <Statistic
                    title={<FormattedMessage id="ability.primary" defaultMessage="Primary Ability" />}
                    prefix={
                      <Tooltip title={<FormattedMessage id={this.props.gear.gear.primaryAbility.ability.name} />}>
                        <img
                          className="OrderedGearCard-gear-ability-icon"
                          src={FileFolderUrl.SPLATNET + this.props.gear.gear.primaryAbility.url}
                          alt="ability"
                        />
                      </Tooltip>
                    }
                    value=" "
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="OrderedGearCard-gear-column" span={24}>
                  <Statistic
                    title={<FormattedMessage id="brand.favored_ability" defaultMessage="Favored Ability" />}
                    prefix={(() => {
                      if (this.props.gear.gear.brand.favoredAbility !== null) {
                        return (
                          <Tooltip
                            title={<FormattedMessage id={this.props.gear.gear.brand.favoredAbility.ability.name} />}
                          >
                            <img
                              className="OrderedGearCard-gear-ability-icon"
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
          className="OrderedGearCard-gear-meta"
          avatar={
            <Tooltip title={<FormattedMessage id={this.props.gear.gear.brand.brand.name} />}>
              <img
                className="OrderedGearCard-gear-meta-image"
                src={FileFolderUrl.SPLATNET + this.props.gear.gear.brand.url}
                alt="brand"
              />
            </Tooltip>
          }
          title={<FormattedMessage id={this.props.gear.gear.gear.name} />}
          description={
            <span className="OrderedGearCard-gear-meta-cash">
              <img className="OrderedGearCard-gear-meta-cash-image" src={cashIcon} alt="cash" />
              {this.props.gear.price}
            </span>
          }
        />
      </Card>
    );
  }
}

OrderedGearCard.defaultProps = {
  bordered: true,
  hoverable: true,
  pointer: false
};

export default injectIntl(OrderedGearCard);
