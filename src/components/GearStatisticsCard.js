import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Descriptions, Tooltip } from 'antd';

import './GearStatisticsCard.css';
import FileFolderUrl from '../utils/FileFolderUrl';

class GearStatisticsCard extends React.Component {
  render() {
    return (
      <Card hoverable bordered={false} bodyStyle={{ padding: 0 }} style={{ cursor: 'default' }}>
        <Descriptions bordered style={this.props.style} column={4}>
          <Descriptions.Item label={<FormattedMessage id="gear" defaultMessage="Gear" />} span={4}>
            <Tooltip title={<FormattedMessage id={this.props.gear.gear.name} />}>
              <img className="GearStatisticsCard-img" src={FileFolderUrl.SPLATNET + this.props.gear.url} alt="gear" />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="brand" defaultMessage="Brand" />} span={4}>
            <Tooltip title={<FormattedMessage id={this.props.gear.gear.name} />}>
              <img
                className="GearStatisticsCard-img-small"
                src={FileFolderUrl.SPLATNET + this.props.gear.brand.url}
                alt="brand"
              />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="ability.primary" defaultMessage="Primary Ability" />}
            span={4}
          >
            <Tooltip title={<FormattedMessage id={this.props.gear.primaryAbility.ability.name} />}>
              <img
                className="GearStatisticsCard-img-small"
                src={FileFolderUrl.SPLATNET + this.props.gear.primaryAbility.url}
                alt="primary"
              />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="ability.secondary" defaultMessage="Secondary Ability" />}
            span={4}
          >
            {this.props.gear.secondaryAbilities.map((element, index) => {
              return (
                <Tooltip key={index} title={<FormattedMessage id={element.ability.name} />}>
                  {(() => {
                    if (index === 0) {
                      return (
                        <img
                          className="GearStatisticsCard-img-small"
                          src={FileFolderUrl.SPLATNET + element.url}
                          alt="secondary"
                        />
                      );
                    } else {
                      return (
                        <img
                          className="GearStatisticsCard-img-small-adj"
                          src={FileFolderUrl.SPLATNET + element.url}
                          alt="secondary"
                        />
                      );
                    }
                  })()}
                </Tooltip>
              );
            })}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

export default GearStatisticsCard;
